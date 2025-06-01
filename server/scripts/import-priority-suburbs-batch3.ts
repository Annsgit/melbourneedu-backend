import { storage } from '../storage';
import { InsertSchool } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Third batch of priority suburb schools to import
const PRIORITY_SCHOOLS_BATCH3: InsertSchool[] = [
  {
    name: "Kooyong Tennis Academy and School",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Kooyong",
    postcode: "3144",
    address: "489 Glenferrie Road, Kooyong",
    yearLevels: "7-12",
    latitude: "-37.8544",
    longitude: "145.0253",
    studentCount: 240,
    atarAverage: 82,
    description: "Kooyong Tennis Academy and School combines academic excellence with elite tennis coaching, offering a unique educational experience for aspiring tennis players.",
    website: "https://www.kooyongtennisacademy.edu.au",
    phone: "(03) 9822 3333",
    email: "info@kooyongtennisacademy.edu.au",
    facilities: ["Tennis Courts", "Gymnasium", "Learning Center", "Science Lab"],
    programs: ["VCE", "Tennis Excellence", "Sports Science", "Academic Extension"],
    founded: 1982,
    principal: "David Thompson",
    featured: false
  },
  {
    name: "St Kilda East College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "St Kilda East",
    postcode: "3183",
    address: "40 Alma Road, St Kilda East",
    yearLevels: "7-12",
    latitude: "-37.8639",
    longitude: "144.9931",
    studentCount: 750,
    atarAverage: 77,
    description: "St Kilda East College provides a comprehensive secondary education with a focus on creative arts, technology, and academic excellence.",
    website: "https://www.stkildaeastcollege.vic.edu.au",
    phone: "(03) 9525 7500",
    email: "st.kilda.east.co@education.vic.gov.au",
    facilities: ["Creative Arts Center", "Technology Hub", "Science Labs", "Sports Courts"],
    programs: ["VCE", "Visual Arts", "Performing Arts", "Technology"],
    founded: 1965,
    principal: "Jennifer King",
    featured: false
  },
  {
    name: "St Kilda West Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "St Kilda West",
    postcode: "3182",
    address: "43 Park Street, St Kilda West",
    yearLevels: "P-6",
    latitude: "-37.8626",
    longitude: "144.9735",
    studentCount: 280,
    description: "St Kilda West Primary School offers a child-centered approach to education in a vibrant bayside location, with a focus on creativity, critical thinking, and community.",
    website: "https://www.stkildawestps.vic.edu.au",
    phone: "(03) 9534 3993",
    email: "st.kilda.west.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Playground", "Sports Courts"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1908,
    principal: "Emma Green",
    featured: false
  },
  {
    name: "Travancore School",
    type: "Public",
    educationLevel: "Combined",
    suburb: "Travancore",
    postcode: "3032",
    address: "Flemington Road, Travancore",
    yearLevels: "K-12",
    latitude: "-37.7855",
    longitude: "144.9382",
    studentCount: 120,
    description: "Travancore School is a specialized government school providing educational services to students with mental health conditions, in partnership with Royal Children's Hospital.",
    website: "https://www.travancoresch.vic.edu.au",
    phone: "(03) 9345 6053",
    email: "travancore.sch@education.vic.gov.au",
    facilities: ["Therapeutic Spaces", "Learning Commons", "Art Room", "Sensory Garden"],
    programs: ["Individual Learning Plans", "Mental Health Support", "Arts Therapy", "Transition Programs"],
    founded: 1964,
    principal: "Therese Allen",
    featured: false
  },
  {
    name: "Windsor Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Windsor",
    postcode: "3181",
    address: "33 Windsor Street, Windsor",
    yearLevels: "P-6",
    latitude: "-37.8563",
    longitude: "144.9921",
    studentCount: 310,
    description: "Windsor Primary School provides a nurturing learning environment with a focus on academic excellence, creativity, and community engagement.",
    website: "https://www.windsorps.vic.edu.au",
    phone: "(03) 9510 1082",
    email: "windsor.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Garden"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1887,
    principal: "Lisa Gale",
    featured: false
  },
  {
    name: "Ashburton Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Ashburton",
    postcode: "3147",
    address: "8 Fakenham Road, Ashburton",
    yearLevels: "P-6",
    latitude: "-37.8687",
    longitude: "145.0843",
    studentCount: 550,
    description: "Ashburton Primary School provides a comprehensive education with a focus on student wellbeing, academic achievement, and community engagement.",
    website: "https://www.ashburtonps.vic.edu.au",
    phone: "(03) 9885 2560",
    email: "ashburton.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Performing Arts Space", "Sports Courts"],
    programs: ["Visual Arts", "Music", "Physical Education", "Languages"],
    founded: 1928,
    principal: "Catherine Mercuri",
    featured: false
  },
  {
    name: "Ashwood High School",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Ashwood",
    postcode: "3147",
    address: "50 Vannam Drive, Ashwood",
    yearLevels: "7-12",
    latitude: "-37.8733",
    longitude: "145.1005",
    studentCount: 580,
    atarAverage: 75,
    description: "Ashwood High School provides a supportive and challenging learning environment that focuses on academic excellence, student wellbeing, and global citizenship.",
    website: "https://www.ashwood.vic.edu.au",
    phone: "(03) 9807 1333",
    email: "ashwood.hs@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Science Labs", "Sports Complex", "Library"],
    programs: ["VCE", "STEM", "Accelerated Learning", "Arts"],
    founded: 1958,
    principal: "Brett Moore",
    featured: false
  },
  {
    name: "Balwyn North Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Balwyn North",
    postcode: "3104",
    address: "2 Marwal Avenue, Balwyn North",
    yearLevels: "P-6",
    latitude: "-37.7912",
    longitude: "145.0838",
    studentCount: 680,
    description: "Balwyn North Primary School provides a comprehensive education with a focus on academic excellence, personal development, and community engagement.",
    website: "https://www.balwynnorthps.vic.edu.au",
    phone: "(03) 9859 5124",
    email: "balwyn.north.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Music Room", "Sports Courts"],
    programs: ["Visual Arts", "Music", "Languages", "Physical Education"],
    founded: 1940,
    principal: "Nicole Richards",
    featured: false
  },
  {
    name: "Bayswater Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Bayswater",
    postcode: "3153",
    address: "Orchard Road, Bayswater",
    yearLevels: "P-6",
    latitude: "-37.8423",
    longitude: "145.2686",
    studentCount: 320,
    description: "Bayswater Primary School provides a nurturing environment where students are encouraged to develop their potential through a balanced and challenging curriculum.",
    website: "https://www.bayswaterps.vic.edu.au",
    phone: "(03) 9729 2614",
    email: "bayswater.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Playground"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1960,
    principal: "Paul Seach",
    featured: false
  },
  {
    name: "Bayswater North Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Bayswater North",
    postcode: "3153",
    address: "15 Kidderminster Drive, Bayswater North",
    yearLevels: "P-6",
    latitude: "-37.8271",
    longitude: "145.2857",
    studentCount: 340,
    description: "Bayswater North Primary School fosters a supportive learning community where students are encouraged to reach their full potential through a comprehensive curriculum.",
    website: "https://www.bayswaterps.vic.edu.au",
    phone: "(03) 9720 6186",
    email: "bayswater.north.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Playground"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1975,
    principal: "Cathy Jones",
    featured: false
  }
];

/**
 * Imports a third batch of priority schools into the database
 */
async function importPrioritySuburbsBatch3() {
  console.log(`Starting import of ${PRIORITY_SCHOOLS_BATCH3.length} schools from priority suburbs (batch 3)...`);
  
  let importCount = 0;
  let errorCount = 0;
  
  for (const school of PRIORITY_SCHOOLS_BATCH3) {
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
  importPrioritySuburbsBatch3()
    .then(({ importCount }) => {
      console.log(`Successfully imported ${importCount} schools.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Failed to import priority suburbs schools (batch 3):', err);
      process.exit(1);
    });
}

export default importPrioritySuburbsBatch3;