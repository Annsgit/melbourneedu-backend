import { storage } from '../storage';
import { InsertSchool } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Priority suburb schools to import
const PRIORITY_SCHOOLS: InsertSchool[] = [
  {
    name: "Abbotsford Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Abbotsford",
    postcode: "3067",
    address: "24 Lithgow Street, Abbotsford",
    yearLevels: "P-6",
    latitude: "-37.8010",
    longitude: "144.9940",
    studentCount: 180,
    description: "Abbotsford Primary School is a Victorian government primary school with a diverse, multicultural community and bilingual English-Chinese program.",
    website: "https://www.abbotsfordps.vic.edu.au",
    phone: "(03) 9428 5977",
    email: "abbotsford.ps@education.vic.gov.au",
    facilities: ["Library", "Basketball Court", "Playground", "Garden"],
    programs: ["Bilingual Chinese Program", "Visual Arts", "Music", "Physical Education"],
    founded: 1877,
    principal: "Stanley Wang",
    featured: false
  },
  {
    name: "Collingwood College",
    type: "Public",
    educationLevel: "Combined",
    suburb: "Abbotsford",
    postcode: "3067",
    address: "McCutcheon Way, Abbotsford",
    yearLevels: "P-12",
    latitude: "-37.8029",
    longitude: "144.9922",
    studentCount: 650,
    atarAverage: 70,
    description: "Collingwood College is a P-12 school that offers a vibrant and inclusive learning environment with a focus on personalized learning and student agency.",
    website: "https://www.collingwood.vic.edu.au",
    phone: "(03) 9417 6681",
    email: "collingwood.co@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Library", "Sports Fields", "Science Labs"],
    programs: ["Steiner Program", "Contemporary Program", "VCE", "VCAL"],
    founded: 1882,
    principal: "Sam Luck",
    featured: false
  },
  {
    name: "Alphington Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Alphington",
    postcode: "3078",
    address: "Yarralea Street, Alphington",
    yearLevels: "P-6",
    latitude: "-37.7797",
    longitude: "145.0304",
    studentCount: 330,
    description: "Alphington Primary School provides a comprehensive education with a focus on student wellbeing, academic excellence, and community engagement.",
    website: "https://www.alphingtonps.vic.edu.au",
    phone: "(03) 9499 1902",
    email: "alphington.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Oval", "Garden"],
    programs: ["Visual Arts", "Music", "Environmental Sustainability", "STEM"],
    founded: 1915,
    principal: "Melissa Mackenzie",
    featured: false
  },
  {
    name: "Lauriston Girls' School",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Armadale",
    postcode: "3143",
    address: "38 Huntingtower Road, Armadale",
    yearLevels: "K-12",
    latitude: "-37.8573",
    longitude: "145.0223",
    studentCount: 950,
    atarAverage: 91,
    description: "Lauriston Girls' School is a leading independent school for girls that combines academic excellence with character development and global perspective.",
    website: "https://www.lauriston.vic.edu.au",
    phone: "(03) 9864 7555",
    email: "admissions@lauriston.vic.edu.au",
    facilities: ["Aquatic Center", "Performing Arts Centre", "Science Labs", "Sports Fields"],
    programs: ["IB", "VCE", "STEM", "Leadership"],
    founded: 1901,
    principal: "Susan Just",
    featured: true
  },
  {
    name: "Ascot Vale Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Ascot Vale",
    postcode: "3032",
    address: "36 Bank Street, Ascot Vale",
    yearLevels: "P-6",
    latitude: "-37.7764",
    longitude: "144.9158",
    studentCount: 440,
    description: "Ascot Vale Primary School offers a supportive learning environment with a focus on literacy, numeracy, and developing confident, engaged learners.",
    website: "https://www.ascotvaps.vic.edu.au",
    phone: "(03) 9370 6507",
    email: "ascot.vale.ps@education.vic.gov.au",
    facilities: ["Library", "Sports Courts", "Playground", "Art Room"],
    programs: ["Visual Arts", "Music", "Physical Education", "Languages"],
    founded: 1885,
    principal: "Sue Osborne",
    featured: false
  },
  {
    name: "St Mary's Primary School",
    type: "Catholic",
    educationLevel: "Primary",
    suburb: "Ascot Vale",
    postcode: "3032",
    address: "168 Ascot Vale Road, Ascot Vale",
    yearLevels: "P-6",
    latitude: "-37.7786",
    longitude: "144.9200",
    studentCount: 320,
    description: "St Mary's Primary School is a Catholic school committed to providing a nurturing environment where each child's spiritual, academic, and personal growth is supported.",
    website: "https://www.smascotvale.catholic.edu.au",
    phone: "(03) 9370 6335",
    email: "principal@smascotvale.catholic.edu.au",
    facilities: ["Library", "Hall", "Playground", "Digital Learning Space"],
    programs: ["Religious Education", "Literacy", "Numeracy", "Performing Arts"],
    founded: 1912,
    principal: "Anthony Matthews",
    featured: false
  },
  {
    name: "St Michael's Grammar School",
    type: "Private",
    educationLevel: "Combined",
    suburb: "St Kilda",
    postcode: "3182",
    address: "25 Chapel Street, St Kilda",
    yearLevels: "K-12",
    latitude: "-37.8593",
    longitude: "144.9811",
    studentCount: 1300,
    atarAverage: 85,
    description: "St Michael's Grammar School is a co-educational, independent school with a balanced approach to learning that nurtures academic achievement, personal wellbeing, and social responsibility.",
    website: "https://www.stmichaels.vic.edu.au",
    phone: "(03) 8530 3200",
    email: "enrol@stmichaels.vic.edu.au",
    facilities: ["Swimming Pool", "Gymnasium", "Performing Arts Centre", "Library"],
    programs: ["IB", "VCE", "Performing Arts", "Sports"],
    founded: 1895,
    principal: "Terrie Jones",
    featured: true
  },
  {
    name: "Port Melbourne Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Port Melbourne",
    postcode: "3207",
    address: "415 Graham Street, Port Melbourne",
    yearLevels: "P-6",
    latitude: "-37.8297",
    longitude: "144.9244",
    studentCount: 850,
    description: "Port Melbourne Primary School provides a comprehensive education in a supportive environment that encourages student engagement, resilience, and academic growth.",
    website: "https://www.portmelps.vic.edu.au",
    phone: "(03) 9646 1001",
    email: "port.melbourne.ps@education.vic.gov.au",
    facilities: ["Sports Courts", "Library", "Art Room", "Digital Learning Spaces"],
    programs: ["Visual Arts", "Physical Education", "Languages", "STEM"],
    founded: 1889,
    principal: "Peter Martin",
    featured: false
  },
  {
    name: "South Melbourne Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "South Melbourne",
    postcode: "3205",
    address: "129 Ferrars Street, South Melbourne",
    yearLevels: "P-6",
    latitude: "-37.8335",
    longitude: "144.9565",
    studentCount: 450,
    description: "South Melbourne Primary School is Victoria's first vertical government school, designed to deliver innovative education in a contemporary urban setting.",
    website: "https://www.southmelbourneps.vic.edu.au",
    phone: "(03) 9935 9399",
    email: "south.melbourne.ps@education.vic.gov.au",
    facilities: ["Rooftop Playground", "Library", "Multipurpose Sports Court", "Art Space"],
    programs: ["Visual Arts", "Physical Education", "STEM", "Community Programs"],
    founded: 2018,
    principal: "Noel Creece",
    featured: true
  },
  {
    name: "Brunswick East Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Brunswick East",
    postcode: "3057",
    address: "195A Stewart Street, Brunswick East",
    yearLevels: "P-6",
    latitude: "-37.7701",
    longitude: "144.9783",
    studentCount: 425,
    description: "Brunswick East Primary School is a vibrant community school with a focus on sustainability, creativity, and developing engaged, independent learners.",
    website: "https://www.brunswickeastps.vic.edu.au",
    phone: "(03) 9387 3361",
    email: "brunswick.east.ps@education.vic.gov.au",
    facilities: ["Garden", "Library", "Sports Courts", "Art Room"],
    programs: ["Sustainability", "Visual Arts", "Music", "Physical Education"],
    founded: 1893,
    principal: "Janet Di Pilla",
    featured: false
  }
];

/**
 * Imports a set of priority schools into the database
 */
async function importPrioritySuburbsSchools() {
  console.log(`Starting import of ${PRIORITY_SCHOOLS.length} schools from priority suburbs...`);
  
  let importCount = 0;
  let errorCount = 0;
  
  for (const school of PRIORITY_SCHOOLS) {
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
  importPrioritySuburbsSchools()
    .then(({ importCount }) => {
      console.log(`Successfully imported ${importCount} schools.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Failed to import priority suburbs schools:', err);
      process.exit(1);
    });
}

export default importPrioritySuburbsSchools;