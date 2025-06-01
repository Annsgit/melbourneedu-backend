import { School } from "@shared/schema";
import { storage } from "../storage";

/**
 * Direct SchoolBot service that doesn't rely on OpenAI
 * Provides responses based on database content
 */

// The maximum number of schools to include in responses
const MAX_SCHOOLS_IN_RESPONSE = 6;

/**
 * Process a user query directly without using OpenAI
 * @param query The user's question about schools
 * @param filterSchoolIds Optional array of school IDs to limit context to specific schools
 * @returns A response based on the available school data
 */
export async function processSchoolBotQueryDirect(
  query: string, 
  filterSchoolIds?: number[]
): Promise<string> {
  try {
    // Get relevant schools
    let relevantSchools: School[] = [];
    
    // If specific schools are requested, get those
    if (filterSchoolIds && filterSchoolIds.length > 0) {
      for (const id of filterSchoolIds) {
        const school = await storage.getSchoolById(id);
        if (school) relevantSchools.push(school);
      }
    } else {
      // Search for schools based on the query
      const queryLower = query.toLowerCase();
      
      // First try direct search - might match school names or suburbs
      const searchResults = await storage.searchSchools(query);
      if (searchResults.length > 0) {
        relevantSchools = searchResults;
      } else {
        // Then try filtering by type
        if (queryLower.includes("public") || queryLower.includes("government")) {
          relevantSchools = await storage.getSchoolsByType("Public");
        } else if (queryLower.includes("private") || queryLower.includes("independent")) {
          relevantSchools = await storage.getSchoolsByType("Private");
        } else if (queryLower.includes("catholic")) {
          relevantSchools = await storage.getSchoolsByType("Catholic");
        }
        
        // Filter by education level
        if (queryLower.includes("primary") || queryLower.includes("elementary")) {
          const primarySchools = await storage.getSchoolsByEducationLevel("Primary");
          relevantSchools = relevantSchools.length > 0 
            ? relevantSchools.filter(s => primarySchools.some(p => p.id === s.id))
            : primarySchools;
        } else if (queryLower.includes("secondary") || queryLower.includes("high school")) {
          const secondarySchools = await storage.getSchoolsByEducationLevel("Secondary");
          relevantSchools = relevantSchools.length > 0 
            ? relevantSchools.filter(s => secondarySchools.some(p => p.id === s.id))
            : secondarySchools;
        } else if (queryLower.includes("combined") || queryLower.includes("p-12") || queryLower.includes("k-12")) {
          const combinedSchools = await storage.getSchoolsByEducationLevel("Combined");
          relevantSchools = relevantSchools.length > 0 
            ? relevantSchools.filter(s => combinedSchools.some(p => p.id === s.id))
            : combinedSchools;
        }
        
        // Filter by suburb if mentioned
        if (relevantSchools.length === 0) {
          // Extract potential suburb names from the query 
          // (this is simplified - would be better with NLP)
          const queryWords = queryLower.split(/\s+/);
          for (const word of queryWords.filter(w => w.length > 3)) {
            const suburbSchools = await storage.getSchoolsBySuburb(
              word.charAt(0).toUpperCase() + word.slice(1)
            );
            if (suburbSchools.length > 0) {
              relevantSchools = suburbSchools;
              break;
            }
          }
        }
        
        // If still no results, get a diverse sample
        if (relevantSchools.length === 0) {
          // Get a mix of public, private, and catholic schools
          const allSchools = await storage.getAllSchools();
          
          const publicSchools = allSchools
            .filter(s => s.type === "Public")
            .slice(0, 3);
          
          const privateSchools = allSchools
            .filter(s => s.type === "Private")
            .slice(0, 2);
          
          const catholicSchools = allSchools
            .filter(s => s.type === "Catholic")
            .slice(0, 1);
          
          relevantSchools = [...publicSchools, ...privateSchools, ...catholicSchools];
        }
      }
      
      // Limit the number of schools
      relevantSchools = relevantSchools.slice(0, MAX_SCHOOLS_IN_RESPONSE);
    }
    
    // Generate appropriate response based on the query
    return generateResponse(query, relevantSchools);
    
  } catch (error) {
    console.error("Error in direct SchoolBot processing:", error);
    return "Sorry, I couldn't process your request right now. Please try asking a different question about Melbourne schools.";
  }
}

/**
 * Generate a response based on the query type and available schools
 */
function generateResponse(query: string, schools: School[]): string {
  const queryLower = query.toLowerCase();
  
  // If we didn't find any relevant schools
  if (schools.length === 0) {
    return "I couldn't find specific schools matching your query. Our database includes schools across Melbourne. Try asking about schools in a specific suburb like Brighton or Kew, or about a specific type like 'public high schools'.";
  }
  
  // Look for specific question types
  
  // Questions about a specific school
  const specificSchoolMatch = schools.find(school => 
    queryLower.includes(school.name.toLowerCase())
  );
  
  if (specificSchoolMatch || 
      (schools.length === 1) || 
      queryLower.includes("tell me about") || 
      queryLower.includes("information on")) {
    
    const school = specificSchoolMatch || schools[0];
    
    return `
Here's information about ${school.name}:

Type: ${school.type} school
Education Level: ${school.educationLevel}
Location: ${school.suburb}, ${school.postcode}
Address: ${school.address}
${school.yearLevels ? `Year Levels: ${school.yearLevels}` : ''}
${school.studentCount ? `Student Population: ${school.studentCount}` : ''}
${school.atarAverage ? `ATAR Average: ${school.atarAverage}` : ''}
${school.fees ? `Annual Fees: $${school.fees.toLocaleString()}` : school.type === 'Public' ? 'Fees: Minimal (Public School)' : ''}

${school.description || ""}

${school.facilities && school.facilities.length > 0 ? `Facilities: ${school.facilities.join(', ')}` : ''}
${school.programs && school.programs.length > 0 ? `Programs: ${school.programs.join(', ')}` : ''}
${school.website ? `Website: ${school.website}` : ''}

What else would you like to know about schools in Melbourne?`;
  }
  
  // Questions about locations
  if (queryLower.includes("where") || 
      queryLower.includes("location") || 
      queryLower.includes("address") || 
      queryLower.includes("find") ||
      queryLower.includes("near")) {
    
    const locationList = schools.map(school => 
      `- ${school.name} is located in ${school.suburb} (${school.postcode}), at ${school.address}`
    ).join("\n");
    
    return `Here are the locations of some relevant schools:\n\n${locationList}\n\nCan I help you with more specific information about any of these schools?`;
  }
  
  // Questions about fees
  if (queryLower.includes("fee") || 
      queryLower.includes("cost") || 
      queryLower.includes("tuition") || 
      queryLower.includes("expensive") || 
      queryLower.includes("affordable")) {
    
    // Sort schools by fees (fees are stored as text in the DB)
    const schoolsWithFees = [...schools].filter(s => s.fees !== null);
    schoolsWithFees.sort((a, b) => {
      // Parse fees string to number for comparison
      const aFees = a.fees ? parseFloat(a.fees.replace(/[^0-9.]/g, '')) : 0;
      const bFees = b.fees ? parseFloat(b.fees.replace(/[^0-9.]/g, '')) : 0;
      return aFees - bFees;
    });
    
    if (schoolsWithFees.length === 0) {
      const schoolTypes = schools.map(s => s.type).join(", ");
      
      return `I don't have specific fee information for the ${schoolTypes} schools in your query. As a general guide:
      
- Public schools typically have minimal fees, usually under $1,000 per year
- Catholic schools often range from $2,000 to $10,000 per year
- Private/Independent schools can range from $15,000 to $40,000+ per year

Fees can vary significantly based on the school's location, facilities, and programs.`;
    }
    
    const feeList = schoolsWithFees.map(school => 
      `- ${school.name} (${school.type}): ${school.fees ? `$${school.fees.toLocaleString()} per year` : 'Fee information not available'}`
    ).join("\n");
    
    return `Here's fee information for schools in your query (sorted from lowest to highest):\n\n${feeList}\n\nRemember that many schools offer scholarships and financial assistance programs. Would you like information about a specific school?`;
  }
  
  // Questions about academic performance
  if (queryLower.includes("academic") || 
      queryLower.includes("performance") || 
      queryLower.includes("atar") || 
      queryLower.includes("result") || 
      queryLower.includes("score")) {
    
    const schoolsWithATAR = schools.filter(s => s.atarAverage !== null);
    
    if (schoolsWithATAR.length === 0) {
      const schoolList = schools.slice(0, 4).map(s => s.name).join(", ");
      
      return `I don't have specific academic performance data for ${schoolList} in our database. Many schools publish their VCE results and ATAR scores on their websites. Academic performance can vary from year to year, and it's just one factor to consider when choosing a school.`;
    }
    
    // Sort by ATAR average (descending)
    schoolsWithATAR.sort((a, b) => {
      // Ensure we're working with numbers
      const aAtar = a.atarAverage !== null && typeof a.atarAverage === 'number' ? a.atarAverage : 0;
      const bAtar = b.atarAverage !== null && typeof b.atarAverage === 'number' ? b.atarAverage : 0;
      // TypeScript explicitly understands these are numbers now
      return bAtar - aAtar; // Descending order
    });
    
    const atarList = schoolsWithATAR.map(school => 
      `- ${school.name} (${school.type}): ATAR Average of ${school.atarAverage}`
    ).join("\n");
    
    return `Here are the ATAR results for some schools (sorted by performance):\n\n${atarList}\n\nRemember that ATAR scores are just one measure of a school's quality. Teaching approaches, school culture, and program offerings are also important factors to consider.`;
  }
  
  // Questions about school types
  if (queryLower.includes("public") || 
      queryLower.includes("private") || 
      queryLower.includes("catholic") || 
      queryLower.includes("independent") ||
      queryLower.includes("type")) {
    
    // Group schools by type
    const schoolsByType: Record<string, School[]> = {};
    
    for (const school of schools) {
      if (!schoolsByType[school.type]) {
        schoolsByType[school.type] = [];
      }
      schoolsByType[school.type].push(school);
    }
    
    let response = "Here are schools grouped by type:\n\n";
    
    for (const [type, typeSchools] of Object.entries(schoolsByType)) {
      if (typeSchools.length > 0) {
        response += `${type} Schools:\n`;
        response += typeSchools.map(s => 
          `- ${s.name} (${s.suburb}, ${s.educationLevel})`
        ).join("\n");
        response += "\n\n";
      }
    }
    
    return response + "Would you like more specific information about any of these schools?";
  }
  
  // Questions about education level
  if (queryLower.includes("primary") || 
      queryLower.includes("secondary") || 
      queryLower.includes("high school") || 
      queryLower.includes("p-12") ||
      queryLower.includes("combined") ||
      queryLower.includes("education level")) {
    
    // Group schools by education level
    const schoolsByLevel: Record<string, School[]> = {};
    
    for (const school of schools) {
      if (!schoolsByLevel[school.educationLevel]) {
        schoolsByLevel[school.educationLevel] = [];
      }
      schoolsByLevel[school.educationLevel].push(school);
    }
    
    let response = "Here are schools grouped by education level:\n\n";
    
    for (const [level, levelSchools] of Object.entries(schoolsByLevel)) {
      if (levelSchools.length > 0) {
        response += `${level} Schools:\n`;
        response += levelSchools.map(s => 
          `- ${s.name} (${s.suburb}, ${s.type})`
        ).join("\n");
        response += "\n\n";
      }
    }
    
    return response + "Can I help you with more information about any of these schools?";
  }
  
  // Default response for generic queries
  const schoolList = schools.map(school => {
    const details = [];
    if (school.type) details.push(school.type);
    if (school.educationLevel) details.push(school.educationLevel);
    const detailsText = details.length > 0 ? `(${details.join(", ")})` : "";
    
    return `- ${school.name} ${detailsText} in ${school.suburb}`;
  }).join("\n");
  
  return `Here are some schools that might interest you:\n\n${schoolList}\n\nI can provide more details about any of these schools. You can ask about their location, fees, academic performance, or facilities.`;
}