import { storage } from '../storage';
import { InsertSchool } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Fifth batch of priority suburb schools to import - focusing on Western Melbourne
const PRIORITY_SCHOOLS_BATCH5: InsertSchool[] = [
  {
    name: "Williamstown High School",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Williamstown",
    postcode: "3016",
    address: "Bayview Street, Williamstown",
    yearLevels: "7-12",
    latitude: "-37.8598",
    longitude: "144.8961",
    studentCount: 1450,
    atarAverage: 78,
    description: "Williamstown High School is a co-educational secondary college with a strong academic record and vibrant maritime and environmental programs, taking advantage of its bayside location.",
    website: "https://www.willihigh.vic.edu.au",
    phone: "(03) 9397 1899",
    email: "williamstown.hs@education.vic.gov.au",
    facilities: ["Maritime Centre", "Performing Arts Centre", "Sports Complex", "Science Labs"],
    programs: ["VCE", "Marine Studies", "Sports Excellence", "Performing Arts"],
    founded: 1915,
    principal: "Gino Catalano",
    featured: true
  },
  {
    name: "Footscray Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Footscray",
    postcode: "3011",
    address: "Geelong Road, Footscray",
    yearLevels: "P-6",
    latitude: "-37.7988",
    longitude: "144.8967",
    studentCount: 420,
    description: "Footscray Primary School provides a multicultural learning environment with a focus on language acquisition, community engagement, and inclusive education practices.",
    website: "https://www.footscrayps.vic.edu.au",
    phone: "(03) 9687 1910",
    email: "footscray.ps@education.vic.gov.au",
    facilities: ["Library", "Language Centre", "Sports Courts", "Community Garden"],
    programs: ["Vietnamese Bilingual", "Italian", "Visual Arts", "STEM"],
    founded: 1862,
    principal: "Jenny Boras",
    featured: false
  },
  {
    name: "Sunshine College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Sunshine",
    postcode: "3020",
    address: "Graham Street, Sunshine",
    yearLevels: "7-12",
    latitude: "-37.7841",
    longitude: "144.8319",
    studentCount: 1100,
    atarAverage: 69,
    description: "Sunshine College is a multi-campus secondary college offering diverse learning opportunities in Melbourne's western suburbs with a strong focus on vocational pathways.",
    website: "https://www.sunshine.vic.edu.au",
    phone: "(03) 8311 5200",
    email: "sunshine.sc@education.vic.gov.au",
    facilities: ["Trade Training Centre", "Sports Complex", "Performing Arts", "STEM Centre"],
    programs: ["VCE", "VCAL", "VET", "STEAM"],
    founded: 1955,
    principal: "Tim Blunt",
    featured: false
  },
  {
    name: "Caroline Chisholm Catholic College",
    type: "Catholic",
    educationLevel: "Secondary",
    suburb: "Braybrook",
    postcode: "3019",
    address: "204 Churchill Avenue, Braybrook",
    yearLevels: "7-12",
    latitude: "-37.7832",
    longitude: "144.8558",
    studentCount: 1600,
    atarAverage: 75,
    description: "Caroline Chisholm Catholic College provides Catholic education in the western suburbs of Melbourne with separate campuses for boys and girls in years 7-10 before combining for senior years.",
    website: "https://www.cccc.vic.edu.au",
    phone: "(03) 9296 5311",
    email: "principal@cccc.vic.edu.au",
    facilities: ["Performing Arts Centre", "Sports Complex", "Technology Wing", "Chapel"],
    programs: ["VCE", "VCAL", "Religious Education", "STEM"],
    founded: 1997,
    principal: "Robert Brennan",
    fees: "7200",
    featured: false
  },
  {
    name: "Altona P-9 College",
    type: "Public",
    educationLevel: "Combined",
    suburb: "Altona",
    postcode: "3018",
    address: "Millers Road, Altona",
    yearLevels: "P-9",
    latitude: "-37.8708",
    longitude: "144.8301",
    studentCount: 810,
    description: "Altona P-9 College provides a seamless education journey from primary to secondary years with a focus on personalized learning and community partnerships.",
    website: "https://www.altonap9college.vic.edu.au",
    phone: "(03) 9250 8050",
    email: "altona.p9@education.vic.gov.au",
    facilities: ["Library", "STEM Centre", "Sports Courts", "Performing Arts Space"],
    programs: ["Inquiry Learning", "STEM", "Arts", "Physical Education"],
    founded: 2011,
    principal: "Sarah Jayne Pettit",
    featured: false
  },
  {
    name: "Hoppers Crossing Secondary College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Hoppers Crossing",
    postcode: "3029",
    address: "Fraser Street, Hoppers Crossing",
    yearLevels: "7-12",
    latitude: "-37.8832",
    longitude: "144.6996",
    studentCount: 1250,
    atarAverage: 70,
    description: "Hoppers Crossing Secondary College provides comprehensive education with a focus on academic achievement, student wellbeing, and community engagement.",
    website: "https://www.hopcross.vic.edu.au",
    phone: "(03) 9974 7777",
    email: "hoppers.crossing.sc@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Sports Complex", "Science Labs", "Technology Wing"],
    programs: ["VCE", "VCAL", "STEM", "Sports Academy"],
    founded: 1983,
    principal: "Keith Halge",
    featured: false
  },
  {
    name: "Al-Taqwa College",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Truganina",
    postcode: "3029",
    address: "201 Sayers Road, Truganina",
    yearLevels: "P-12",
    latitude: "-37.8246",
    longitude: "144.7333",
    studentCount: 2200,
    atarAverage: 72,
    description: "Al-Taqwa College is one of the largest Islamic schools in Victoria, providing a comprehensive education that combines academic excellence with Islamic values and principles.",
    website: "https://www.al-taqwa.vic.edu.au",
    phone: "(03) 9269 5000",
    email: "adminoffice@wicv.net",
    facilities: ["Mosque", "Sports Complex", "Science Labs", "Library"],
    programs: ["Islamic Studies", "Quran", "VCE", "STEM"],
    founded: 1986,
    principal: "Omar Hallak",
    fees: "3600",
    featured: false
  },
  {
    name: "Point Cook Senior Secondary College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Point Cook",
    postcode: "3030",
    address: "Cnr Boardwalk Boulevard and Bergamot Drive, Point Cook",
    yearLevels: "10-12",
    latitude: "-37.8874",
    longitude: "144.7500",
    studentCount: 1100,
    atarAverage: 76,
    description: "Point Cook Senior Secondary College focuses exclusively on senior secondary education with extensive VCE subject offerings and specialized facilities.",
    website: "https://www.pointcooksenior.vic.edu.au",
    phone: "(03) 9395 9271",
    email: "point.cook.senior.sc@education.vic.gov.au",
    facilities: ["Lecture Theatre", "Library", "Science Labs", "Arts Centre"],
    programs: ["VCE", "VCAL", "University Acceleration", "STEM"],
    founded: 2008,
    principal: "Christopher Mooney",
    featured: false
  },
  {
    name: "Werribee Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Werribee",
    postcode: "3030",
    address: "Deutgam Street, Werribee",
    yearLevels: "P-6",
    latitude: "-37.8995",
    longitude: "144.6713",
    studentCount: 580,
    description: "Werribee Primary School is one of the oldest schools in Melbourne's west, providing a comprehensive primary education with a strong community focus.",
    website: "https://www.werribeeps.vic.edu.au",
    phone: "(03) 9742 6659",
    email: "werribee.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Playground"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1855,
    principal: "David Quinn",
    featured: false
  },
  {
    name: "Bacchus Marsh Grammar",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Bacchus Marsh",
    postcode: "3340",
    address: "South Maddingley Road, Bacchus Marsh",
    yearLevels: "P-12",
    latitude: "-37.6901",
    longitude: "144.4528",
    studentCount: 2100,
    atarAverage: 82,
    description: "Bacchus Marsh Grammar is an independent co-educational school offering a comprehensive education from Prep to Year 12 with expansive grounds and facilities.",
    website: "https://www.bmg.vic.edu.au",
    phone: "(03) 5366 4800",
    email: "school@bmg.vic.edu.au",
    facilities: ["Performing Arts Centre", "Aquatic Centre", "Sports Fields", "Science Centre"],
    programs: ["VCE", "Agriculture", "Performing Arts", "STEM"],
    founded: 1988,
    principal: "Andrew Neal",
    fees: "12500",
    featured: true
  }
];

/**
 * Imports a fifth batch of priority schools into the database
 */
async function importPrioritySuburbsBatch5() {
  console.log(`Starting import of ${PRIORITY_SCHOOLS_BATCH5.length} schools from priority suburbs (batch 5)...`);
  
  let importCount = 0;
  let errorCount = 0;
  
  for (const school of PRIORITY_SCHOOLS_BATCH5) {
    try {
      // Check if school already exists
      const existingSchools = await storage.searchSchools(school.name);
      const schoolExists = existingSchools.some(s => 
        s.name.toLowerCase() === school.name.toLowerCase() && 
        s.suburb.toLowerCase() === school.suburb.toLowerCase()
      );
      
      if (schoolExists) {
        console.log(`School already exists, skipping: ${school.name}`);
        continue;
      }
      
      // Insert the school
      await storage.createSchool(school);
      importCount++;
      console.log(`Imported: ${school.name} (${school.suburb})`);
    } catch (error) {
      console.error(`Error importing ${school.name}: ${error instanceof Error ? error.message : String(error)}`);
      errorCount++;
    }
  }
  
  console.log(`Import complete. Successfully imported ${importCount} schools with ${errorCount} errors.`);
  return { importCount, errorCount };
}

// Run the function if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importPrioritySuburbsBatch5()
    .then(({ importCount }) => {
      console.log(`Successfully imported ${importCount} schools.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Failed to import priority suburbs schools (batch 5):', err);
      process.exit(1);
    });
}

export default importPrioritySuburbsBatch5;