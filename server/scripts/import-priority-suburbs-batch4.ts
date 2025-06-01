import { storage } from '../storage';
import { InsertSchool } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Fourth batch of priority suburb schools to import - focusing on Eastern Melbourne
const PRIORITY_SCHOOLS_BATCH4: InsertSchool[] = [
  {
    name: "Blackburn North Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Blackburn North",
    postcode: "3130",
    address: "27-35 David Street, Blackburn North",
    yearLevels: "P-6",
    latitude: "-37.8120",
    longitude: "145.1612",
    studentCount: 330,
    description: "Blackburn North Primary School provides a nurturing learning environment that fosters academic excellence, resilience, and a love of learning.",
    website: "https://www.blackburnnorthps.vic.edu.au",
    phone: "(03) 9878 2110",
    email: "blackburn.north.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Playground"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1965,
    principal: "David Burton",
    featured: false
  },
  {
    name: "Blackburn South Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Blackburn South",
    postcode: "3130",
    address: "649 Holland Road, Blackburn South",
    yearLevels: "P-6",
    latitude: "-37.8426",
    longitude: "145.1498",
    studentCount: 350,
    description: "Blackburn South Primary School provides a comprehensive education with a focus on student wellbeing, academic achievement, and community engagement.",
    website: "https://www.blackburnsps.vic.edu.au",
    phone: "(03) 9877 1107",
    email: "blackburn.south.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Science Room", "Sports Courts"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1950,
    principal: "Emma Sharp",
    featured: false
  },
  {
    name: "Boronia K-12 College",
    type: "Public",
    educationLevel: "Combined",
    suburb: "Boronia",
    postcode: "3155",
    address: "Park Crescent, Boronia",
    yearLevels: "K-12",
    latitude: "-37.8614",
    longitude: "145.2844",
    studentCount: 720,
    atarAverage: 69,
    description: "Boronia K-12 College provides a continuous learning journey from kindergarten to year 12, with a focus on personalized learning and student wellbeing.",
    website: "https://www.boroniak12.vic.edu.au",
    phone: "(03) 9760 4900",
    email: "boronia.k12@education.vic.gov.au",
    facilities: ["Learning Resource Centre", "Performing Arts Centre", "Science Labs", "Sports Courts"],
    programs: ["VCE", "VCAL", "Arts", "Technology"],
    founded: 2012,
    principal: "Matthew Scammell",
    featured: false
  },
  {
    name: "Box Hill North Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Box Hill North",
    postcode: "3129",
    address: "Elizabeth Street, Box Hill North",
    yearLevels: "P-6",
    latitude: "-37.8058",
    longitude: "145.1214",
    studentCount: 410,
    description: "Box Hill North Primary School provides a comprehensive education with a focus on literacy, numeracy, and developing confident, resilient learners.",
    website: "https://www.bhnps.vic.edu.au",
    phone: "(03) 9897 5683",
    email: "box.hill.north.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Playground"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1955,
    principal: "Jessica Morgan",
    featured: false
  },
  {
    name: "Roberts McCubbin Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Box Hill South",
    postcode: "3128",
    address: "16 Livingstone Close, Box Hill South",
    yearLevels: "P-6",
    latitude: "-37.8350",
    longitude: "145.1214",
    studentCount: 380,
    description: "Roberts McCubbin Primary School provides a supportive and stimulating learning environment that nurtures the academic, social, and emotional development of all students.",
    website: "https://www.robertsmccubbin.vic.edu.au",
    phone: "(03) 9898 7704",
    email: "roberts.mccubbin.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Playground"],
    programs: ["Visual Arts", "Music", "Physical Education", "Languages"],
    founded: 1958,
    principal: "Meredith Thornton",
    featured: false
  },
  {
    name: "Bulleen Heights School",
    type: "Public",
    educationLevel: "Combined",
    suburb: "Bulleen",
    postcode: "3105",
    address: "175 Pleasant Road, Bulleen",
    yearLevels: "P-12",
    latitude: "-37.7692",
    longitude: "145.0877",
    studentCount: 260,
    description: "Bulleen Heights School is a specialist school catering for students with autism spectrum disorder, providing individualized learning programs and support services.",
    website: "https://www.bulleenheights.vic.edu.au",
    phone: "(03) 9850 7122",
    email: "bulleen.heights.sch@education.vic.gov.au",
    facilities: ["Sensory Rooms", "Life Skills Center", "Art Room", "Playground"],
    programs: ["Individualized Learning", "Life Skills", "Communication", "Social Skills"],
    founded: 1989,
    principal: "Susan Merjan",
    featured: false
  },
  {
    name: "Burwood East Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Burwood East",
    postcode: "3151",
    address: "Corner of Blackburn and Highbury Roads, Burwood East",
    yearLevels: "P-6",
    latitude: "-37.8546",
    longitude: "145.1505",
    studentCount: 320,
    description: "Burwood East Primary School offers a supportive learning environment with a focus on academic excellence, student wellbeing, and community engagement.",
    website: "https://www.burwoodeastps.vic.edu.au",
    phone: "(03) 9802 8618",
    email: "burwood.east.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Playground"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1954,
    principal: "Darren McDonald",
    featured: false
  },
  {
    name: "Chirnside Park Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Chirnside Park",
    postcode: "3116",
    address: "68 Kimberley Drive, Chirnside Park",
    yearLevels: "P-6",
    latitude: "-37.7567",
    longitude: "145.3167",
    studentCount: 360,
    description: "Chirnside Park Primary School provides a supportive learning environment that develops confident, responsible learners who strive for excellence.",
    website: "https://www.chirnsideparkps.vic.edu.au",
    phone: "(03) 9727 3293",
    email: "chirnside.park.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Playground"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1979,
    principal: "John Goodman",
    featured: false
  },
  {
    name: "Croydon Hills Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Croydon",
    postcode: "3136",
    address: "19 Swinton Avenue, Croydon Hills",
    yearLevels: "P-6",
    latitude: "-37.7731",
    longitude: "145.2886",
    studentCount: 650,
    description: "Croydon Hills Primary School provides a comprehensive education with a focus on developing students' academic, social, and emotional capabilities.",
    website: "https://www.croydonhps.vic.edu.au",
    phone: "(03) 9725 1851",
    email: "croydon.hills.ps@education.vic.gov.au",
    facilities: ["Library", "Performing Arts Space", "Sports Courts", "STEM Center"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1988,
    principal: "Christian Holdsworth",
    featured: false
  },
  {
    name: "Croydon Secondary College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Croydon",
    postcode: "3136",
    address: "Croydon Road, Croydon",
    yearLevels: "7-12",
    latitude: "-37.7967",
    longitude: "145.2859",
    studentCount: 750,
    atarAverage: 72,
    description: "Croydon Secondary College provides a supportive learning environment that values diversity and prepares students for success in further education and beyond.",
    website: "https://www.croydonsc.vic.edu.au",
    phone: "(03) 9725 6544",
    email: "croydon.sc@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Sports Complex", "Technology Center", "Science Labs"],
    programs: ["VCE", "VCAL", "STEM", "Arts"],
    founded: 1957,
    principal: "Bronwyn Harcourt",
    featured: false
  }
];

/**
 * Imports a fourth batch of priority schools into the database
 */
async function importPrioritySuburbsBatch4() {
  console.log(`Starting import of ${PRIORITY_SCHOOLS_BATCH4.length} schools from priority suburbs (batch 4)...`);
  
  let importCount = 0;
  let errorCount = 0;
  
  for (const school of PRIORITY_SCHOOLS_BATCH4) {
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
  importPrioritySuburbsBatch4()
    .then(({ importCount }) => {
      console.log(`Successfully imported ${importCount} schools.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Failed to import priority suburbs schools (batch 4):', err);
      process.exit(1);
    });
}

export default importPrioritySuburbsBatch4;