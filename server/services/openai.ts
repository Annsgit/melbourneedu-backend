import OpenAI from "openai";
import { storage } from "../storage";
import { School } from "@shared/schema";

/**
 * Generates a fallback response when the OpenAI API is unavailable
 * This function uses the school data directly to provide simple responses
 * 
 * @param query User's query
 * @param schools List of schools that were found relevant to the query
 * @returns A simple response based on the available data
 */
/**
 * Enhanced fallback response generator that provides relevant information
 * even when OpenAI API is unavailable.
 */
function generateFallbackResponse(query: string, schools: School[]): string {
  const queryLower = query.toLowerCase();
  
  // If we didn't find any relevant schools
  if (schools.length === 0) {
    return "I couldn't find specific schools matching your query. Our database includes 169 schools across Melbourne and surrounding areas. Please try asking about schools in a specific suburb like Brighton or Kew, or about a specific type like 'public high schools'.";
  }
  
  // Check for common question patterns
  const isQuestionAbout = {
    location: queryLower.includes("where") || 
              queryLower.includes("location") || 
              queryLower.includes("suburb") ||
              queryLower.includes("address") ||
              queryLower.includes("near"),
              
    type: queryLower.includes("public") || 
          queryLower.includes("private") || 
          queryLower.includes("catholic") ||
          queryLower.includes("independent") ||
          queryLower.includes("government"),
          
    level: queryLower.includes("primary") ||
           queryLower.includes("secondary") ||
           queryLower.includes("high school") ||
           queryLower.includes("elementary") ||
           queryLower.includes("p-12") ||
           queryLower.includes("k-12") ||
           queryLower.includes("combined"),
           
    fees: queryLower.includes("fee") || 
          queryLower.includes("cost") || 
          queryLower.includes("price") ||
          queryLower.includes("expensive") ||
          queryLower.includes("affordable"),
          
    academic: queryLower.includes("academic") ||
              queryLower.includes("atar") ||
              queryLower.includes("score") ||
              queryLower.includes("performance") ||
              queryLower.includes("results"),
              
    programs: queryLower.includes("program") ||
              queryLower.includes("stem") ||
              queryLower.includes("science") ||
              queryLower.includes("music") ||
              queryLower.includes("sport") ||
              queryLower.includes("art"),
              
    facilities: queryLower.includes("facilit") ||
                queryLower.includes("pool") ||
                queryLower.includes("gym") ||
                queryLower.includes("library") ||
                queryLower.includes("field") ||
                queryLower.includes("center") ||
                queryLower.includes("centre"),
                
    specific: queryLower.includes("tell me about") ||
              queryLower.includes("information about") ||
              queryLower.includes("can you describe") ||
              queryLower.includes("what is") ||
              queryLower.includes("details on")
  };
  
  // For queries about specific schools
  const singleSchoolNames = schools.filter(school => 
    queryLower.includes(school.name.toLowerCase())
  );
  
  if (singleSchoolNames.length === 1 || isQuestionAbout.specific) {
    // Return details about a specific school
    const school = singleSchoolNames.length === 1 ? singleSchoolNames[0] : schools[0];
    
    return `
Here's information about ${school.name}:

Type: ${school.type} school
Education Level: ${school.educationLevel}
Location: ${school.suburb}, ${school.postcode}
Address: ${school.address}
Student Population: ${school.studentCount || "Information not available"}
${school.atarAverage ? `ATAR Average: ${school.atarAverage}` : ''}
${school.fees ? `Annual Fees: $${school.fees.toLocaleString()}` : school.type === 'Public' ? 'Fees: Minimal (Public School)' : 'Fee information not available'}

${school.description || ""}

${school.facilities?.length ? `Facilities: ${school.facilities.join(', ')}` : ''}
${school.programs?.length ? `Programs: ${school.programs.join(', ')}` : ''}
${school.website ? `Website: ${school.website}` : ''}

Is there anything specific about this school you'd like to know more about?`;
  }
  
  // Location-based queries
  if (isQuestionAbout.location) {
    const locationInfo = schools.slice(0, 5).map(school => {
      return `- ${school.name} is located in ${school.suburb} (${school.postcode}), at ${school.address}`;
    }).join("\n");
    
    return `Here are the locations of some relevant schools:\n\n${locationInfo}\n\nI can provide more details about any of these schools if you'd like.`;
  }
  
  // Type-based queries (public, private, catholic)
  if (isQuestionAbout.type) {
    // Group schools by type
    const schoolsByType = schools.reduce((acc, school) => {
      if (!acc[school.type]) {
        acc[school.type] = [];
      }
      acc[school.type].push(school);
      return acc;
    }, {} as Record<string, School[]>);
    
    let response = "Here are schools grouped by type:\n\n";
    
    for (const [type, typeSchools] of Object.entries(schoolsByType)) {
      if (typeSchools.length > 0) {
        response += `${type} Schools:\n`;
        response += typeSchools.slice(0, 4).map(s => 
          `- ${s.name} (${s.suburb}, ${s.educationLevel})`
        ).join("\n");
        response += "\n\n";
      }
    }
    
    return response;
  }
  
  // Education level queries (primary, secondary, combined)
  if (isQuestionAbout.level) {
    // Group schools by education level
    const schoolsByLevel = schools.reduce((acc, school) => {
      if (!acc[school.educationLevel]) {
        acc[school.educationLevel] = [];
      }
      acc[school.educationLevel].push(school);
      return acc;
    }, {} as Record<string, School[]>);
    
    let response = "Here are schools grouped by education level:\n\n";
    
    for (const [level, levelSchools] of Object.entries(schoolsByLevel)) {
      if (levelSchools.length > 0) {
        response += `${level} Schools:\n`;
        response += levelSchools.slice(0, 4).map(s => 
          `- ${s.name} (${s.suburb}, ${s.type})`
        ).join("\n");
        response += "\n\n";
      }
    }
    
    return response;
  }
  
  // Fee-based queries
  if (isQuestionAbout.fees) {
    // Sort schools by fees
    const schoolsWithFees = schools.filter(s => s.fees !== null).sort((a, b) => {
      return (a.fees || 0) - (b.fees || 0);
    });
    
    if (schoolsWithFees.length === 0) {
      return "I don't have specific fee information for the schools in your query. In general, public schools in Melbourne have minimal fees (usually under $1,000 per year), while private and Catholic schools have annual fees ranging from $5,000 to $40,000 depending on the school's prestige and facilities.";
    }
    
    const feeInfo = schoolsWithFees.slice(0, 6).map(school => {
      return `- ${school.name} (${school.type}, ${school.educationLevel}): ${school.fees ? `$${school.fees.toLocaleString()} per year` : 'Fee information not available'}`;
    }).join("\n");
    
    return `Here's fee information for some relevant schools, sorted from lower to higher fees:\n\n${feeInfo}\n\nPublic schools generally have minimal fees compared to private schools. Fee assistance and scholarships may be available at many schools.`;
  }
  
  // Academic performance queries
  if (isQuestionAbout.academic) {
    const schoolsWithATAR = schools.filter(s => s.atarAverage !== null).sort((a, b) => {
      return (b.atarAverage || 0) - (a.atarAverage || 0);
    });
    
    if (schoolsWithATAR.length === 0) {
      return "I don't have specific academic performance data for the schools in your query. Academic results vary by school and year. Many schools publish their VCE results and ATAR scores on their websites.";
    }
    
    const academicInfo = schoolsWithATAR.slice(0, 5).map(school => {
      return `- ${school.name} (${school.type}): ${school.atarAverage ? `ATAR Average: ${school.atarAverage}` : 'Academic data not available'}`;
    }).join("\n");
    
    return `Here are some schools with their average ATAR scores:\n\n${academicInfo}\n\nKeep in mind that academic results are just one factor to consider when choosing a school. Programs, teaching quality, and school culture are also important.`;
  }
  
  // Program-related queries
  if (isQuestionAbout.programs) {
    let programHighlights = "";
    
    // Find schools with notable programs
    for (const school of schools.slice(0, 5)) {
      if (school.programs && school.programs.length > 0) {
        programHighlights += `- ${school.name} offers: ${school.programs.join(', ')}\n`;
      }
    }
    
    if (!programHighlights) {
      // Default message if no program info
      programHighlights = schools.slice(0, 5).map(school => 
        `- ${school.name} (${school.type}, ${school.educationLevel})`
      ).join("\n");
      
      return `Here are some schools that might match your program interests:\n\n${programHighlights}\n\nFor specific program details, I recommend visiting the schools' websites or contacting them directly.`;
    }
    
    return `Here are some schools with their program offerings:\n\n${programHighlights}\n\nMany schools offer additional programs not listed here. You may want to check their websites for the most up-to-date information.`;
  }
  
  // Facilities-related queries
  if (isQuestionAbout.facilities) {
    let facilityHighlights = "";
    
    // Find schools with notable facilities
    for (const school of schools.slice(0, 5)) {
      if (school.facilities && school.facilities.length > 0) {
        facilityHighlights += `- ${school.name} has: ${school.facilities.join(', ')}\n`;
      }
    }
    
    if (!facilityHighlights) {
      // Default message if no facility info
      facilityHighlights = schools.slice(0, 5).map(school => 
        `- ${school.name} (${school.type}, ${school.educationLevel})`
      ).join("\n");
      
      return `Here are some schools that might match your interests:\n\n${facilityHighlights}\n\nFor specific information about facilities, I recommend visiting the schools' websites or contacting them directly.`;
    }
    
    return `Here are some schools with their facility information:\n\n${facilityHighlights}\n\nMany schools have additional facilities not listed in our database. School tours are a great way to see facilities firsthand.`;
  }
  
  // Default response for other queries
  const schoolList = schools.slice(0, 6).map(school => {
    const details = [];
    if (school.type) details.push(school.type);
    if (school.educationLevel) details.push(school.educationLevel);
    const detailsText = details.length > 0 ? `(${details.join(", ")})` : "";
    
    return `- ${school.name} ${detailsText} in ${school.suburb}`;
  }).join("\n");
  
  return `Here are some Melbourne schools that might match your interests:\n\n${schoolList}\n\nI can provide more specific information if you have questions about location, fees, facilities, or academic programs. You can also try asking about schools in a particular suburb or of a specific type.`;
}

// Initialize the OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Common system prompt that will be used for all interactions
const SYSTEM_PROMPT = `You are SchoolBot, a helpful assistant for the Melbourne Schools Information website. 
Your purpose is to help parents and students find the right schools in Melbourne, Australia.

You have access to a database of schools with the following information:
- Name, type (Public, Private, Catholic), and education level (Primary, Secondary, Combined)
- Location (suburb, postcode, address)
- Facilities and programs offered
- Academic performance metrics (for Secondary schools)
- Fees (mostly for Private and Catholic schools)
- Contact information

You should:
- Provide friendly, concise responses about Melbourne schools
- Help users compare schools based on various factors
- Suggest schools that match specific criteria (location, programs, fees, etc.)
- Answer questions about the education system in Victoria, Australia
- Be honest when you don't have enough information

You should NOT:
- Make up information about schools that isn't in your database
- Provide personal opinions on which school is "best" - focus on facts
- Discuss sensitive topics beyond educational considerations
- Provide information about schools outside of Melbourne and surrounding areas

Keep your answers relevant to education in Melbourne and focus on being helpful to parents making school choices.`;

// The maximum number of schools to include in the AI context
const MAX_SCHOOLS_IN_CONTEXT = 20;

/**
 * Processes a user's query about schools using the OpenAI API
 * 
 * @param query The user's question about schools
 * @param filterSchoolIds Optional array of school IDs to limit the context to specific schools
 * @returns AI-generated response based on the available school data
 */
export async function processSchoolBotQuery(
  query: string,
  filterSchoolIds?: number[]
): Promise<string> {
  try {
    // Get relevant schools to include in the context
    let relevantSchools: School[] = [];
    
    if (filterSchoolIds && filterSchoolIds.length > 0) {
      // If specific schools are requested, get those
      for (const id of filterSchoolIds) {
        const school = await storage.getSchoolById(id);
        if (school) relevantSchools.push(school);
      }
    } else {
      // Check if the query contains a suburb or school type to filter results
      const queryLower = query.toLowerCase();
      
      // Check for keywords related to fees
      const hasFeeQuery = queryLower.includes("fee") || 
                          queryLower.includes("cost") || 
                          queryLower.includes("afford") ||
                          queryLower.includes("expensive") ||
                          queryLower.includes("cheap");
      
      // Check for keywords related to academic performance
      const hasAcademicQuery = queryLower.includes("academic") || 
                               queryLower.includes("atar") || 
                               queryLower.includes("score") ||
                               queryLower.includes("performance") ||
                               queryLower.includes("results");
      
      // Check for program-related keywords
      const programKeywords = [
        "stem", "science", "math", "music", "art", "sport", 
        "language", "coding", "technology", "drama", "dance"
      ];
      
      const hasProgramQuery = programKeywords.some(keyword => 
        queryLower.includes(keyword)
      );
      
      // Get all schools and filter based on query context
      const allSchools = await storage.getAllSchools();
      
      // Start with basic text matching
      relevantSchools = allSchools.filter(school => {
        const schoolNameMatch = school.name.toLowerCase().includes(queryLower);
        const suburbMatch = school.suburb.toLowerCase().includes(queryLower);
        const typeMatch = queryLower.includes(school.type.toLowerCase());
        const levelMatch = queryLower.includes(school.educationLevel.toLowerCase());
        
        // More specific matching based on facilities and programs
        const facilityMatch = school.facilities ? school.facilities.some(facility => 
          queryLower.includes(facility.toLowerCase())
        ) : false;
        
        const programMatch = school.programs ? school.programs.some(program => 
          queryLower.includes(program.toLowerCase())
        ) : false;
        
        // Match on fees if the query is about costs
        const feeMatch = hasFeeQuery && school.fees !== null;
        
        // Match on academic performance if the query is about academics
        const academicMatch = hasAcademicQuery && school.atarAverage !== null;
        
        // More specific program matching for program-related queries
        const detailedProgramMatch = hasProgramQuery && school.programs ? 
          school.programs.some(program => 
            programKeywords.some(keyword => 
              program.toLowerCase().includes(keyword)
            )
          ) : false;
        
        return schoolNameMatch || suburbMatch || typeMatch || levelMatch || 
               facilityMatch || programMatch || feeMatch || 
               academicMatch || detailedProgramMatch;
      });
      
      // If no schools matched, get a diverse sample
      if (relevantSchools.length === 0) {
        // Get a mix of public, private, and catholic schools
        const publicSchools = allSchools
          .filter(s => s.type === "Public")
          .slice(0, 8);
        
        const privateSchools = allSchools
          .filter(s => s.type === "Private")
          .slice(0, 6);
        
        const catholicSchools = allSchools
          .filter(s => s.type === "Catholic")
          .slice(0, 6);
        
        relevantSchools = [...publicSchools, ...privateSchools, ...catholicSchools];
      }
      
      // Limit the number of schools to avoid hitting token limits
      relevantSchools = relevantSchools.slice(0, MAX_SCHOOLS_IN_CONTEXT);
    }
    
    // Format school data for the AI
    const schoolContext = relevantSchools.map(school => {
      return `
School: ${school.name}
Type: ${school.type}
Education Level: ${school.educationLevel}
Location: ${school.suburb}, ${school.postcode}, ${school.address}
Year Levels: ${school.yearLevels}
Student Count: ${school.studentCount}
${school.atarAverage ? `ATAR Average: ${school.atarAverage}` : ''}
${school.fees ? `Annual Fees: $${school.fees}` : 'Fees: Not applicable (Public School)'}
Facilities: ${school.facilities ? school.facilities.join(', ') : 'None listed'}
Programs: ${school.programs ? school.programs.join(', ') : 'None listed'}
Website: ${school.website}
Description: ${school.description}
`;
    }).join('\n');
    
    // Build the full prompt including system instructions, context, and user query
    const contextPrompt = `
Here are details about ${relevantSchools.length} schools in Melbourne that may be relevant to the user's query:

${schoolContext}

Based on this information, please provide a helpful response to the user's question. If the information provided isn't sufficient to fully answer the query, you can mention this and suggest what additional details might help.
`;
    
    // Only try to call OpenAI if we haven't had rate limit issues
    try {
      // Make the API call to OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: contextPrompt },
          { role: "user", content: query }
        ],
        temperature: 0.7,
        max_tokens: 600,
      });
      
      // Extract and return the AI's response
      return response.choices[0].message.content || 
        "I'm sorry, I couldn't process your request. Please try asking in a different way.";
    } catch (error: any) {
      // Check if this is an OpenAI API error
      if (error?.status === 429 || error?.error?.code === 'insufficient_quota') {
        // Log the rate limit or quota error
        console.error("OpenAI API quota exceeded or rate limited:", 
          error?.error?.message || error?.message || "Unknown error");
        
        // Use our fallback response generator instead of OpenAI
        return generateFallbackResponse(query, relevantSchools);
      }
      
      // Re-throw other errors to be caught by the main try/catch
      throw error;
    }
    
  } catch (error) {
    console.error("Error processing SchoolBot query:", error);
    return "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
}