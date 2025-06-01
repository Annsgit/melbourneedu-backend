import { storage } from '../storage';
import { InsertSchool } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Seventh batch of priority suburb schools to import - focusing on Northeastern Melbourne
const PRIORITY_SCHOOLS_BATCH7: InsertSchool[] = [
  {
    name: "Eltham High School",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Eltham",
    postcode: "3095",
    address: "30-60 Withers Way, Eltham",
    yearLevels: "7-12",
    latitude: "-37.7036",
    longitude: "145.1472",
    studentCount: 1350,
    atarAverage: 78,
    description: "Eltham High School is known for its progressive educational approach, strong focus on the arts, and commitment to building independent and creative thinkers.",
    website: "https://www.elthamhs.vic.edu.au",
    phone: "(03) 9430 5111",
    email: "eltham.hs@education.vic.gov.au",
    facilities: ["Performance Centre", "Sports Stadium", "Visual Arts Centre", "Music Centre"],
    programs: ["VCE", "Arts Excellence", "Instrumental Music", "Sports Academy"],
    founded: 1926,
    principal: "Vincent Sicari",
    featured: false
  },
  {
    name: "Eltham Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Eltham",
    postcode: "3095",
    address: "Dalton Street, Eltham",
    yearLevels: "P-6",
    latitude: "-37.7131",
    longitude: "145.1457",
    studentCount: 410,
    description: "Eltham Primary School provides a supportive learning environment focused on developing literacy, numeracy, and critical thinking skills in a leafy green setting.",
    website: "https://www.elthamps.vic.edu.au",
    phone: "(03) 9439 9374",
    email: "eltham.ps@education.vic.gov.au",
    facilities: ["Library", "Sports Courts", "Art Room", "Outdoor Learning Areas"],
    programs: ["Visual Arts", "Music", "Physical Education", "Environmental Education"],
    founded: 1855,
    principal: "David Mckenzie",
    featured: false
  },
  {
    name: "Catholic Ladies' College",
    type: "Catholic",
    educationLevel: "Secondary",
    suburb: "Eltham",
    postcode: "3095",
    address: "19 Diamond Street, Eltham",
    yearLevels: "7-12",
    latitude: "-37.7176",
    longitude: "145.1445",
    studentCount: 870,
    atarAverage: 81,
    description: "Catholic Ladies' College is a girls' secondary school offering a comprehensive education in the Catholic tradition with a focus on academic excellence and social justice.",
    website: "https://www.clc.vic.edu.au",
    phone: "(03) 9439 4077",
    email: "principal@clc.vic.edu.au",
    facilities: ["Performing Arts Centre", "Library", "Science Centre", "Chapel"],
    programs: ["VCE", "Religious Education", "Arts", "STEM"],
    founded: 1902,
    principal: "Stephanie Evans",
    fees: "12800",
    featured: false
  },
  {
    name: "Plenty Valley Christian College",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Doreen",
    postcode: "3754",
    address: "840 Yan Yean Road, Doreen",
    yearLevels: "P-12",
    latitude: "-37.6039",
    longitude: "145.1342",
    studentCount: 840,
    atarAverage: 75,
    description: "Plenty Valley Christian College provides a Christ-centred education with a focus on academic excellence, character development, and community service.",
    website: "https://www.pvcc.vic.edu.au",
    phone: "(03) 9717 7400",
    email: "office@pvcc.vic.edu.au",
    facilities: ["Performing Arts Centre", "Sports Fields", "Science Labs", "Chapel"],
    programs: ["VCE", "Christian Studies", "Performing Arts", "Sports"],
    founded: 1981,
    principal: "John Metcalfe",
    fees: "9800",
    featured: false
  },
  {
    name: "Ivanhoe Grammar School",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Ivanhoe",
    postcode: "3079",
    address: "The Ridgeway, Ivanhoe",
    yearLevels: "ELC-12",
    latitude: "-37.7683",
    longitude: "145.0452",
    studentCount: 2000,
    atarAverage: 89,
    description: "Ivanhoe Grammar School is a prestigious independent co-educational school with a focus on academic excellence, international mindedness, and holistic education.",
    website: "https://www.ivanhoe.com.au",
    phone: "(03) 9490 1877",
    email: "enquiries@ivanhoe.com.au",
    facilities: ["Performing Arts Centre", "Aquatic Centre", "Sports Fields", "Science Centre"],
    programs: ["IB", "VCE", "Sports Academy", "Instrumental Music"],
    founded: 1915,
    principal: "Gerard Foley",
    fees: "34500",
    featured: true
  },
  {
    name: "Viewbank College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Viewbank",
    postcode: "3084",
    address: "Warren Road, Viewbank",
    yearLevels: "7-12",
    latitude: "-37.7415",
    longitude: "145.0981",
    studentCount: 1250,
    atarAverage: 77,
    description: "Viewbank College provides a comprehensive education with a focus on academic excellence, student wellbeing, and preparation for future pathways.",
    website: "https://www.viewbank.vic.edu.au",
    phone: "(03) 9458 2811",
    email: "viewbank.sc@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Sports Stadium", "Science Centre", "Technology Wing"],
    programs: ["VCE", "VCAL", "STEM", "Performing Arts"],
    founded: 1994,
    principal: "Sharon Grimes",
    featured: false
  },
  {
    name: "Greenhills Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Greensborough",
    postcode: "3088",
    address: "36 Greensborough Highway, Greensborough",
    yearLevels: "P-6",
    latitude: "-37.7019",
    longitude: "145.1006",
    studentCount: 380,
    description: "Greenhills Primary School provides a supportive learning environment with a focus on literacy, numeracy, and developing well-rounded individuals.",
    website: "https://www.greenhillsps.vic.edu.au",
    phone: "(03) 9435 4181",
    email: "greenhills.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Playground"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1962,
    principal: "Janine Hough",
    featured: false
  },
  {
    name: "St Helena Secondary College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Eltham North",
    postcode: "3095",
    address: "Wallowa Road, Eltham North",
    yearLevels: "7-12",
    latitude: "-37.7011",
    longitude: "145.1394",
    studentCount: 1650,
    atarAverage: 73,
    description: "St Helena Secondary College offers a comprehensive education with diverse programs to cater to students' varying interests, abilities, and career aspirations.",
    website: "https://www.sthelena.vic.edu.au",
    phone: "(03) 9438 8500",
    email: "st.helena.sc@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Sports Stadium", "Technology Centre", "Science Labs"],
    programs: ["VCE", "VCAL", "Arts", "Technology"],
    founded: 1984,
    principal: "Karen Terry",
    featured: false
  },
  {
    name: "Diamond Valley College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Diamond Creek",
    postcode: "3089",
    address: "165-179 Main Hurstbridge Road, Diamond Creek",
    yearLevels: "7-12",
    latitude: "-37.6726",
    longitude: "145.1593",
    studentCount: 750,
    atarAverage: 69,
    description: "Diamond Valley College offers a supportive learning environment with a focus on academic achievement, student wellbeing, and community engagement.",
    website: "https://www.dvallcoll.vic.edu.au",
    phone: "(03) 9438 1411",
    email: "diamond.valley.co@education.vic.gov.au",
    facilities: ["Performing Arts Space", "Sports Courts", "Science Labs", "Library"],
    programs: ["VCE", "VCAL", "Sports", "Technology"],
    founded: 1989,
    principal: "Allison Bennett",
    featured: false
  },
  {
    name: "Montmorency South Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Montmorency",
    postcode: "3094",
    address: "Cockerell Street, Montmorency",
    yearLevels: "P-6",
    latitude: "-37.7183",
    longitude: "145.1214",
    studentCount: 450,
    description: "Montmorency South Primary School provides a supportive learning environment with a focus on student wellbeing, academic achievement, and community engagement.",
    website: "https://www.montsouthps.vic.edu.au",
    phone: "(03) 9439 6201",
    email: "montmorency.south.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "Playground"],
    programs: ["Visual Arts", "Music", "Physical Education", "Japanese Language"],
    founded: 1959,
    principal: "Leanne Sheean",
    featured: false
  }
];

/**
 * Imports a seventh batch of priority schools into the database
 */
async function importPrioritySuburbsBatch7() {
  console.log(`Starting import of ${PRIORITY_SCHOOLS_BATCH7.length} schools from priority suburbs (batch 7)...`);
  
  let importCount = 0;
  let errorCount = 0;
  
  for (const school of PRIORITY_SCHOOLS_BATCH7) {
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
  importPrioritySuburbsBatch7()
    .then(({ importCount }) => {
      console.log(`Successfully imported ${importCount} schools.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Failed to import priority suburbs schools (batch 7):', err);
      process.exit(1);
    });
}

export default importPrioritySuburbsBatch7;