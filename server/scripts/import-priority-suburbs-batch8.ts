import { storage } from '../storage';
import { InsertSchool } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Eighth batch of priority suburb schools to import - focusing on Mornington Peninsula
const PRIORITY_SCHOOLS_BATCH8: InsertSchool[] = [
  {
    name: "Mornington Secondary College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Mornington",
    postcode: "3931",
    address: "Nepean Highway, Mornington",
    yearLevels: "7-12",
    latitude: "-38.2238",
    longitude: "145.0509",
    studentCount: 1050,
    atarAverage: 72,
    description: "Mornington Secondary College provides a comprehensive education with a focus on academic achievement, personal development, and community engagement in a coastal setting.",
    website: "https://www.mornsc.vic.edu.au",
    phone: "(03) 5970 0200",
    email: "mornington.sc@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Sports Fields", "Science Labs", "Technology Wing"],
    programs: ["VCE", "VCAL", "Sports Academy", "Arts"],
    founded: 1957,
    principal: "Linda Stanton",
    featured: false
  },
  {
    name: "Mornington Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Mornington",
    postcode: "3931",
    address: "Vale Street, Mornington",
    yearLevels: "P-6",
    latitude: "-38.2178",
    longitude: "145.0380",
    studentCount: 590,
    description: "Mornington Primary School provides a supportive learning environment with a focus on literacy, numeracy, and building confident, resilient learners.",
    website: "https://www.morningtonps.vic.edu.au",
    phone: "(03) 5975 4011",
    email: "mornington.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Playground"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1878,
    principal: "Susan Mattingley",
    featured: false
  },
  {
    name: "Peninsula Grammar",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Mount Eliza",
    postcode: "3930",
    address: "20 Wooralla Drive, Mount Eliza",
    yearLevels: "ELC-12",
    latitude: "-38.1836",
    longitude: "145.0968",
    studentCount: 1400,
    atarAverage: 85,
    description: "Peninsula Grammar is an independent co-educational school offering a comprehensive education from early learning to Year 12 with a focus on academic excellence and character development.",
    website: "https://www.peninsulagrammar.vic.edu.au",
    phone: "(03) 9788 7777",
    email: "info@peninsulagrammar.vic.edu.au",
    facilities: ["Performing Arts Centre", "Aquatic Centre", "Sports Fields", "Science Centre"],
    programs: ["VCE", "IB", "Sports Academy", "Music Academy"],
    founded: 1961,
    principal: "Stuart Johnston",
    fees: "32500",
    featured: true
  },
  {
    name: "Mount Eliza Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Mount Eliza",
    postcode: "3930",
    address: "Wooralla Drive, Mount Eliza",
    yearLevels: "P-6",
    latitude: "-38.1906",
    longitude: "145.0932",
    studentCount: 620,
    description: "Mount Eliza Primary School provides a comprehensive education with a focus on developing curious, creative, and critical thinkers in a supportive coastal environment.",
    website: "https://www.mtelizaps.vic.edu.au",
    phone: "(03) 9787 1385",
    email: "mount.eliza.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Outdoor Learning Areas"],
    programs: ["Visual Arts", "Music", "Physical Education", "Languages"],
    founded: 1929,
    principal: "Kim Wheeler",
    featured: false
  },
  {
    name: "Padua College",
    type: "Catholic",
    educationLevel: "Secondary",
    suburb: "Mornington",
    postcode: "3931",
    address: "Oakbank Road, Mornington",
    yearLevels: "7-12",
    latitude: "-38.2343",
    longitude: "145.0693",
    studentCount: 1700,
    atarAverage: 78,
    description: "Padua College is a Catholic co-educational secondary college providing education across three campuses on the Mornington Peninsula with a focus on faith, learning, and community.",
    website: "https://www.padua.vic.edu.au",
    phone: "(03) 5976 0100",
    email: "info@padua.vic.edu.au",
    facilities: ["Chapel", "Performing Arts Centre", "Sports Complex", "Technology Wing"],
    programs: ["VCE", "VCAL", "Religious Education", "Arts Academy"],
    founded: 1898,
    principal: "Anthony Banks",
    fees: "11500",
    featured: false
  },
  {
    name: "Rosebud Secondary College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Rosebud",
    postcode: "3939",
    address: "Eastbourne Road, Rosebud",
    yearLevels: "7-12",
    latitude: "-38.3652",
    longitude: "144.9033",
    studentCount: 980,
    atarAverage: 69,
    description: "Rosebud Secondary College provides a comprehensive education with a focus on academic achievement, student wellbeing, and community engagement on the southern Mornington Peninsula.",
    website: "https://www.rsc.vic.edu.au",
    phone: "(03) 5986 8595",
    email: "rosebud.sc@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Sports Complex", "Science Labs", "Technology Wing"],
    programs: ["VCE", "VCAL", "Marine Science", "Arts"],
    founded: 1954,
    principal: "Lisa Holt",
    featured: false
  },
  {
    name: "Dromana College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Dromana",
    postcode: "3936",
    address: "110 Harrisons Road, Dromana",
    yearLevels: "7-12",
    latitude: "-38.3331",
    longitude: "144.9655",
    studentCount: 920,
    atarAverage: 71,
    description: "Dromana College provides a comprehensive education with a focus on academic excellence, student wellbeing, and community engagement in a coastal setting.",
    website: "https://www.dsc.vic.edu.au",
    phone: "(03) 5987 2805",
    email: "dromana.sc@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Sports Complex", "Science Labs", "Technology Wing"],
    programs: ["VCE", "VCAL", "Arts", "STEM"],
    founded: 1988,
    principal: "Alan Marr",
    featured: false
  },
  {
    name: "Sorrento Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Sorrento",
    postcode: "3943",
    address: "32 Kerferd Avenue, Sorrento",
    yearLevels: "P-6",
    latitude: "-38.3406",
    longitude: "144.7413",
    studentCount: 230,
    description: "Sorrento Primary School provides a supportive learning environment focused on academic excellence and student wellbeing in a unique coastal location at the tip of the Mornington Peninsula.",
    website: "https://www.sorrentops.vic.edu.au",
    phone: "(03) 5984 2130",
    email: "sorrento.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Outdoor Learning Areas"],
    programs: ["Visual Arts", "Music", "Physical Education", "Marine Studies"],
    founded: 1891,
    principal: "Megan Stuart",
    featured: false
  },
  {
    name: "Red Hill Consolidated School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Red Hill",
    postcode: "3937",
    address: "Flinders Road, Red Hill",
    yearLevels: "P-6",
    latitude: "-38.3831",
    longitude: "144.9943",
    studentCount: 360,
    description: "Red Hill Consolidated School provides a comprehensive education with a focus on developing the whole child in the rural setting of the Mornington Peninsula hinterland.",
    website: "https://www.redhillcs.vic.edu.au",
    phone: "(03) 5989 2321",
    email: "red.hill.cs@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Environmental Centre"],
    programs: ["Visual Arts", "Music", "Environmental Education", "Kitchen Garden"],
    founded: 1872,
    principal: "Carolyn Crowley",
    featured: false
  },
  {
    name: "Flinders College",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Tyabb",
    postcode: "3913",
    address: "155 Tyabb-Tooradin Road, Tyabb",
    yearLevels: "P-12",
    latitude: "-38.2519",
    longitude: "145.1877",
    studentCount: 760,
    atarAverage: 76,
    description: "Flinders College (formerly Flinders Christian Community College) is an independent Christian school providing a comprehensive education from Prep to Year 12 in a supportive faith-based environment.",
    website: "https://www.flinders.vic.edu.au",
    phone: "(03) 5973 2000",
    email: "enquiries@flinders.vic.edu.au",
    facilities: ["Performing Arts Centre", "Sports Fields", "Library", "Technology Centre"],
    programs: ["VCE", "Christian Studies", "Outdoor Education", "Arts"],
    founded: 1988,
    principal: "Jill Healey",
    fees: "12800",
    featured: false
  }
];

/**
 * Imports an eighth batch of priority schools into the database
 */
async function importPrioritySuburbsBatch8() {
  console.log(`Starting import of ${PRIORITY_SCHOOLS_BATCH8.length} schools from priority suburbs (batch 8)...`);
  
  let importCount = 0;
  let errorCount = 0;
  
  for (const school of PRIORITY_SCHOOLS_BATCH8) {
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
  importPrioritySuburbsBatch8()
    .then(({ importCount }) => {
      console.log(`Successfully imported ${importCount} schools.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Failed to import priority suburbs schools (batch 8):', err);
      process.exit(1);
    });
}

export default importPrioritySuburbsBatch8;