import { storage } from '../storage';
import { InsertSchool } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Second batch of priority suburb schools to import
const PRIORITY_SCHOOLS_BATCH2: InsertSchool[] = [
  {
    name: "Balaclava Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Balaclava",
    postcode: "3183",
    address: "18 Camden Street, Balaclava",
    yearLevels: "P-6",
    latitude: "-37.8693",
    longitude: "145.0033",
    studentCount: 220,
    description: "Balaclava Primary School is a vibrant community school providing quality education focused on literacy, numeracy, and social responsibility.",
    website: "https://www.balaclavaps.vic.edu.au",
    phone: "(03) 9525 1050",
    email: "balaclava.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Playground", "Sports Courts"],
    programs: ["Visual Arts", "Music", "Physical Education", "Languages"],
    founded: 1895,
    principal: "Sarah Jones",
    featured: false
  },
  {
    name: "Brunswick West Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Brunswick West",
    postcode: "3055",
    address: "South Daly Street, Brunswick West",
    yearLevels: "P-6",
    latitude: "-37.7656",
    longitude: "144.9428",
    studentCount: 310,
    description: "Brunswick West Primary School provides an engaging curriculum in a supportive learning environment that fosters creativity, critical thinking, and community engagement.",
    website: "https://www.brunswickwestps.vic.edu.au",
    phone: "(03) 9387 6886",
    email: "brunswick.west.ps@education.vic.gov.au",
    facilities: ["Library", "Music Room", "Arts Space", "Sports Courts"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1908,
    principal: "David Williams",
    featured: false
  },
  {
    name: "Princes Hill Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Carlton North",
    postcode: "3054",
    address: "Pigdon Street, Carlton North",
    yearLevels: "P-6",
    latitude: "-37.7843",
    longitude: "144.9686",
    studentCount: 520,
    description: "Princes Hill Primary School is known for its innovative approach to education, strong community connections, and creative learning programs.",
    website: "https://www.princeshill.vic.edu.au",
    phone: "(03) 9389 5300",
    email: "princes.hill.ps@education.vic.gov.au",
    facilities: ["Library", "Art Space", "Performance Space", "Outdoor Learning Areas"],
    programs: ["Visual Arts", "Performing Arts", "STEM", "Environmental Education"],
    founded: 1889,
    principal: "Esme Capp",
    featured: false
  },
  {
    name: "Clifton Hill Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Clifton Hill",
    postcode: "3068",
    address: "185 Gold Street, Clifton Hill",
    yearLevels: "P-6",
    latitude: "-37.7861",
    longitude: "144.9956",
    studentCount: 550,
    description: "Clifton Hill Primary School is a vibrant inner-city school with a rich history, offering a comprehensive curriculum that nurtures academic excellence and personal growth.",
    website: "https://www.cliftonhillps.vic.edu.au",
    phone: "(03) 9489 8333",
    email: "clifton.hill.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Music Room", "Sports Courts"],
    programs: ["Visual Arts", "Music", "Physical Education", "Languages"],
    founded: 1874,
    principal: "Megan Smith",
    featured: false
  },
  {
    name: "Fairfield Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Fairfield",
    postcode: "3078",
    address: "Wingrove Street, Fairfield",
    yearLevels: "P-6",
    latitude: "-37.7773",
    longitude: "145.0212",
    studentCount: 590,
    description: "Fairfield Primary School provides an engaging educational experience with strong community connections and a focus on student wellbeing and academic achievement.",
    website: "https://www.fairfieldps.vic.edu.au",
    phone: "(03) 9489 1152",
    email: "fairfield.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Music Room", "Sports Facilities"],
    programs: ["Visual Arts", "Music", "Italian Language", "Physical Education"],
    founded: 1885,
    principal: "Paul Wallace",
    featured: false
  },
  {
    name: "Hawthorn East Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Hawthorn East",
    postcode: "3123",
    address: "4 Havelock Road, Hawthorn East",
    yearLevels: "P-6",
    latitude: "-37.8280",
    longitude: "145.0526",
    studentCount: 420,
    description: "Hawthorn East Primary School provides a supportive and challenging learning environment that nurtures academic excellence, creativity, and personal development.",
    website: "https://www.hawthorneaps.vic.edu.au",
    phone: "(03) 9813 2884",
    email: "hawthorn.east.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Music Room", "Sports Courts"],
    programs: ["Visual Arts", "Music", "STEM", "Physical Education"],
    founded: 1922,
    principal: "Andrew Gilbert",
    featured: false
  },
  {
    name: "Kew East Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Kew East",
    postcode: "3102",
    address: "1481 Burke Road, Kew East",
    yearLevels: "P-6",
    latitude: "-37.7983",
    longitude: "145.0624",
    studentCount: 480,
    description: "Kew East Primary School offers a rich educational experience with a focus on developing well-rounded students through academic, creative, and physical programs.",
    website: "https://www.keweastps.vic.edu.au",
    phone: "(03) 9859 4984",
    email: "kew.east.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Music Room", "Sports Courts"],
    programs: ["Visual Arts", "Music", "Physical Education", "Languages"],
    founded: 1923,
    principal: "Stuart Palmer",
    featured: false
  },
  {
    name: "Middle Park Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Middle Park",
    postcode: "3206",
    address: "Richardson Street, Middle Park",
    yearLevels: "P-6",
    latitude: "-37.8513",
    longitude: "144.9620",
    studentCount: 420,
    description: "Middle Park Primary School provides a nurturing and stimulating environment where students are encouraged to achieve their personal best in all areas.",
    website: "https://www.middleparkps.vic.edu.au",
    phone: "(03) 9690 6419",
    email: "middle.park.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Music Room", "Sports Courts"],
    programs: ["Visual Arts", "Music", "Physical Education", "Languages"],
    founded: 1887,
    principal: "Rebecca Cooke",
    featured: false
  },
  {
    name: "Prahran High School",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Prahran",
    postcode: "3181",
    address: "216 High Street, Prahran",
    yearLevels: "7-12",
    latitude: "-37.8515",
    longitude: "144.9905",
    studentCount: 650,
    atarAverage: 75,
    description: "Prahran High School is a vertical school designed to deliver innovative education in a contemporary urban setting, with a focus on creativity and academic excellence.",
    website: "https://www.prahranhighschool.vic.edu.au",
    phone: "(03) 9113 1000",
    email: "prahran.hs@education.vic.gov.au",
    facilities: ["Learning Commons", "Science Labs", "Art Studios", "Performance Spaces"],
    programs: ["VCE", "STEM", "Performing Arts", "Visual Arts"],
    founded: 2019,
    principal: "Nathan Chisholm",
    featured: true
  },
  {
    name: "Ripponlea Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Ripponlea",
    postcode: "3185",
    address: "25 Carrington Grove, Ripponlea",
    yearLevels: "P-6",
    latitude: "-37.8711",
    longitude: "144.9957",
    studentCount: 245,
    description: "Ripponlea Primary School provides a supportive community environment where students develop academic skills, creativity, and a love of learning.",
    website: "https://www.ripponleaps.vic.edu.au",
    phone: "(03) 9527 5728",
    email: "ripponlea.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Music Room", "Sports Courts"],
    programs: ["Visual Arts", "Music", "Languages", "Physical Education"],
    founded: 1922,
    principal: "Emma Rodocanachi",
    featured: false
  }
];

/**
 * Imports a second batch of priority schools into the database
 */
async function importPrioritySuburbsBatch2() {
  console.log(`Starting import of ${PRIORITY_SCHOOLS_BATCH2.length} schools from priority suburbs (batch 2)...`);
  
  let importCount = 0;
  let errorCount = 0;
  
  for (const school of PRIORITY_SCHOOLS_BATCH2) {
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
  importPrioritySuburbsBatch2()
    .then(({ importCount }) => {
      console.log(`Successfully imported ${importCount} schools.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Failed to import priority suburbs schools (batch 2):', err);
      process.exit(1);
    });
}

export default importPrioritySuburbsBatch2;