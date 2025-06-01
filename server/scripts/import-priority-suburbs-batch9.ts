import { storage } from '../storage';
import { InsertSchool } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Ninth batch of priority suburb schools to import - focusing on Geelong Region
const PRIORITY_SCHOOLS_BATCH9: InsertSchool[] = [
  {
    name: "Geelong High School",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "East Geelong",
    postcode: "3219",
    address: "Ryrie Street, East Geelong",
    yearLevels: "7-12",
    latitude: "-38.1531",
    longitude: "144.3720",
    studentCount: 1050,
    atarAverage: 72,
    description: "Geelong High School is one of Victoria's oldest secondary schools, providing comprehensive education with a focus on academic excellence, student wellbeing, and community engagement.",
    website: "https://www.geelonghigh.vic.edu.au",
    phone: "(03) 5225 4100",
    email: "geelong.hs@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Sports Complex", "Science Labs", "Technology Centre"],
    programs: ["VCE", "VCAL", "STEM", "Arts"],
    founded: 1910,
    principal: "Glenn Davey",
    featured: false
  },
  {
    name: "Belmont High School",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Belmont",
    postcode: "3216",
    address: "Reynolds Road, Belmont",
    yearLevels: "7-12",
    latitude: "-38.1807",
    longitude: "144.3433",
    studentCount: 1200,
    atarAverage: 75,
    description: "Belmont High School provides a comprehensive education with a focus on academic achievement, student wellbeing, and developing well-rounded individuals.",
    website: "https://www.bhs.vic.edu.au",
    phone: "(03) 5243 5355",
    email: "belmont.hs@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Sports Fields", "Science Labs", "Technology Centre"],
    programs: ["VCE", "VCAL", "Arts", "STEM"],
    founded: 1955,
    principal: "Sandra Eglezos",
    featured: false
  },
  {
    name: "Geelong Grammar School",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Corio",
    postcode: "3214",
    address: "50 Biddlecombe Avenue, Corio",
    yearLevels: "ELC-12",
    latitude: "-38.0867",
    longitude: "144.3822",
    studentCount: 1500,
    atarAverage: 88,
    description: "Geelong Grammar School is one of Australia's most prestigious independent schools offering boarding and day programs, with a focus on academic excellence, character development, and wellbeing.",
    website: "https://www.ggs.vic.edu.au",
    phone: "(03) 5273 9200",
    email: "info@ggs.vic.edu.au",
    facilities: ["Chapel", "Performing Arts Centre", "Aquatic Centre", "Equestrian Centre"],
    programs: ["IB", "VCE", "Positive Education", "Outdoor Education"],
    founded: 1855,
    principal: "Rebecca Cody",
    fees: "42500",
    featured: true
  },
  {
    name: "The Geelong College",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Newtown",
    postcode: "3220",
    address: "Talbot Street, Newtown",
    yearLevels: "ELC-12",
    latitude: "-38.1525",
    longitude: "144.3410",
    studentCount: 1300,
    atarAverage: 85,
    description: "The Geelong College is an independent co-educational day and boarding school with a focus on academic excellence, character development, and preparing students for life beyond school.",
    website: "https://www.geelongcollege.vic.edu.au",
    phone: "(03) 5226 3111",
    email: "admissions@geelongcollege.vic.edu.au",
    facilities: ["Performing Arts Centre", "Aquatic Centre", "Sports Fields", "Science Centre"],
    programs: ["VCE", "Music", "Sport", "Outdoor Education"],
    founded: 1861,
    principal: "Peter Miller",
    fees: "36800",
    featured: true
  },
  {
    name: "Sacred Heart College",
    type: "Catholic",
    educationLevel: "Secondary",
    suburb: "Newtown",
    postcode: "3220",
    address: "Retreat Road, Newtown",
    yearLevels: "7-12",
    latitude: "-38.1562",
    longitude: "144.3377",
    studentCount: 1450,
    atarAverage: 80,
    description: "Sacred Heart College provides Catholic education for girls with a focus on academic excellence, faith formation, and developing confident, compassionate young women.",
    website: "https://www.shcgeelong.catholic.edu.au",
    phone: "(03) 5221 4211",
    email: "info@shcgeelong.catholic.edu.au",
    facilities: ["Chapel", "Performing Arts Centre", "Sports Complex", "Library"],
    programs: ["VCE", "VCAL", "Religious Education", "Arts"],
    founded: 1860,
    principal: "Anna Negro",
    fees: "11200",
    featured: false
  },
  {
    name: "St Joseph's College",
    type: "Catholic",
    educationLevel: "Secondary",
    suburb: "Newtown",
    postcode: "3220",
    address: "135 Aphrasia Street, Newtown",
    yearLevels: "7-12",
    latitude: "-38.1488",
    longitude: "144.3371",
    studentCount: 1750,
    atarAverage: 78,
    description: "St Joseph's College is a Catholic boys' school in the Edmund Rice tradition, focused on academic excellence, faith formation, and developing well-rounded young men.",
    website: "https://www.sjc.vic.edu.au",
    phone: "(03) 5226 8100",
    email: "info@sjc.vic.edu.au",
    facilities: ["Chapel", "Sports Complex", "Technology Centre", "Science Labs"],
    programs: ["VCE", "VCAL", "Religious Education", "Sports Academy"],
    founded: 1935,
    principal: "Paul Tobias",
    fees: "10800",
    featured: false
  },
  {
    name: "Geelong College of the Arts and Technology",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Geelong",
    postcode: "3220",
    address: "Fenwick Street, Geelong",
    yearLevels: "11-12",
    latitude: "-38.1497",
    longitude: "144.3625",
    studentCount: 650,
    atarAverage: 68,
    description: "Geelong College of the Arts and Technology (formerly Geelong South Tech) specializes in senior secondary education with a focus on creative arts, design, and technology pathways.",
    website: "https://www.gcat.vic.edu.au",
    phone: "(03) 5225 1000",
    email: "geelong.south.sc@education.vic.gov.au",
    facilities: ["Design Studios", "Technology Workshops", "Performance Spaces", "Media Labs"],
    programs: ["VCE", "VCAL", "Arts", "Design"],
    founded: 1997,
    principal: "Bronwyn Jennings",
    featured: false
  },
  {
    name: "Newtown Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Newtown",
    postcode: "3220",
    address: "36 Aberdeen Street, Newtown",
    yearLevels: "P-6",
    latitude: "-38.1468",
    longitude: "144.3421",
    studentCount: 480,
    description: "Newtown Primary School provides a comprehensive education with a focus on literacy, numeracy, and developing confident, capable learners in a supportive community environment.",
    website: "https://www.newtownps.vic.edu.au",
    phone: "(03) 5221 2962",
    email: "newtown.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Outdoor Learning Areas"],
    programs: ["Visual Arts", "Music", "Physical Education", "Languages"],
    founded: 1856,
    principal: "Jayne Prendergast",
    featured: false
  },
  {
    name: "Kardinia International College",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Bell Post Hill",
    postcode: "3215",
    address: "29 Kardinia Drive, Bell Post Hill",
    yearLevels: "P-12",
    latitude: "-38.1197",
    longitude: "144.3308",
    studentCount: 1900,
    atarAverage: 84,
    description: "Kardinia International College is an independent co-educational school offering the International Baccalaureate programme across all year levels with a focus on global citizenship.",
    website: "https://www.kardinia.vic.edu.au",
    phone: "(03) 5278 9999",
    email: "principal@kardinia.vic.edu.au",
    facilities: ["Performing Arts Centre", "Aquatic Centre", "Technology Centre", "International Centre"],
    programs: ["IB", "Languages", "Music", "Sports Academy"],
    founded: 1996,
    principal: "Catherine Lockhart",
    fees: "17900",
    featured: false
  },
  {
    name: "Christian College Geelong",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Highton",
    postcode: "3216",
    address: "18 Burdekin Road, Highton",
    yearLevels: "P-12",
    latitude: "-38.1851",
    longitude: "144.3185",
    studentCount: 2100,
    atarAverage: 80,
    description: "Christian College Geelong is an independent Christian school with multiple campuses offering comprehensive education from Prep to Year 12 in a supportive faith-based environment.",
    website: "https://www.ccg.vic.edu.au",
    phone: "(03) 5241 1899",
    email: "enquiries@ccg.vic.edu.au",
    facilities: ["Performing Arts Centre", "Sports Complex", "Technology Centre", "Chapel"],
    programs: ["VCE", "Christian Studies", "Outdoor Education", "Arts"],
    founded: 1980,
    principal: "Glen McKeeman",
    fees: "15600",
    featured: false
  }
];

/**
 * Imports a ninth batch of priority schools into the database
 */
async function importPrioritySuburbsBatch9() {
  console.log(`Starting import of ${PRIORITY_SCHOOLS_BATCH9.length} schools from priority suburbs (batch 9)...`);
  
  let importCount = 0;
  let errorCount = 0;
  
  for (const school of PRIORITY_SCHOOLS_BATCH9) {
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
  importPrioritySuburbsBatch9()
    .then(({ importCount }) => {
      console.log(`Successfully imported ${importCount} schools.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Failed to import priority suburbs schools (batch 9):', err);
      process.exit(1);
    });
}

export default importPrioritySuburbsBatch9;