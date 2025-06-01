import { storage } from '../storage';
import type { InsertSchool } from '@shared/schema';
import { SCHOOL_TYPES, EDUCATION_LEVELS } from '@shared/schema';
import fs from 'fs';
import path from 'path';

/**
 * This script imports a comprehensive dataset of Melbourne schools
 * Data is based on information from the Victorian Government School Database
 * and My School database.
 */

// Sample dataset of Melbourne schools
// In a real implementation, this data would be more comprehensive and come from an official source
const schoolsData: Partial<InsertSchool>[] = [
  // Eastern Region Schools
  {
    name: "Balwyn Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Balwyn",
    postcode: "3103",
    address: "230 Balwyn Road, Balwyn",
    yearLevels: "P-6",
    latitude: "-37.8108",
    longitude: "145.0839",
    studentCount: 650,
    atarAverage: null,
    description: "Balwyn Primary School is a Victorian government school providing comprehensive primary education with a focus on literacy, numeracy, and community values.",
    website: "https://www.balwynps.vic.edu.au",
    phone: "(03) 9836 7121",
    email: "balwyn.ps@education.vic.gov.au",
    facilities: ["Library", "Sports Grounds", "Art Room", "Music Room"],
    programs: ["Literacy Support", "Mathematics Extension", "Visual Arts", "Performing Arts"],
    founded: 1912,
    principal: "Jenny Sutherland",
    featured: false
  },
  {
    name: "Camberwell High School",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Camberwell",
    postcode: "3124",
    address: "100 Prospect Hill Road, Camberwell",
    yearLevels: "7-12",
    latitude: "-37.8356",
    longitude: "145.0783",
    studentCount: 1200,
    atarAverage: 79,
    description: "Camberwell High School has a proud tradition of academic excellence and provides diverse curricular and co-curricular opportunities to foster student growth.",
    website: "https://www.camhigh.vic.edu.au",
    phone: "(03) 9836 0555",
    email: "camberwell.hs@education.vic.gov.au",
    facilities: ["Science Centre", "Performing Arts Centre", "Sports Complex", "Library"],
    programs: ["VCE", "STEM", "Languages", "Arts"],
    founded: 1941,
    principal: "Jill Laughlin",
    featured: true
  },
  {
    name: "Kew Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Kew",
    postcode: "3101",
    address: "20 Peel Street, Kew",
    yearLevels: "P-6",
    latitude: "-37.8049",
    longitude: "145.0285",
    studentCount: 520,
    atarAverage: null,
    description: "Kew Primary School offers a supportive learning environment that values diversity and encourages students to become independent thinkers and lifelong learners.",
    website: "https://www.kewps.vic.edu.au",
    phone: "(03) 9853 8325",
    email: "kew.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Music Room", "Outdoor Play Areas"],
    programs: ["STEM", "Visual Arts", "Music", "Physical Education"],
    founded: 1870,
    principal: "Julie Roberts",
    featured: false
  },

  // Inner City Region Schools
  {
    name: "Carlton Gardens Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Carlton",
    postcode: "3053",
    address: "215 Rathdowne Street, Carlton",
    yearLevels: "P-6",
    latitude: "-37.8036",
    longitude: "144.9689",
    studentCount: 450,
    atarAverage: null,
    description: "Carlton Gardens Primary School is located in the heart of Melbourne and provides a welcoming environment for students from diverse cultural backgrounds.",
    website: "https://www.carltongardens.vic.edu.au",
    phone: "(03) 9663 6502",
    email: "carlton.gardens.ps@education.vic.gov.au",
    facilities: ["Library", "STEM Lab", "Art Room", "Playground"],
    programs: ["International Baccalaureate PYP", "Languages", "Arts", "Technology"],
    founded: 1884,
    principal: "Tina McDougall",
    featured: false
  },
  {
    name: "Melbourne Girls' College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Richmond",
    postcode: "3121",
    address: "Yarra Boulevard, Richmond",
    yearLevels: "7-12",
    latitude: "-37.8204",
    longitude: "145.0097",
    studentCount: 1400,
    atarAverage: 82,
    description: "Melbourne Girls' College is a leading government secondary school for girls with a strong focus on academic excellence, leadership, and sustainability.",
    website: "https://www.mgc.vic.edu.au",
    phone: "(03) 9428 8955",
    email: "melbourne.girls.co@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Sports Centre", "Science Labs", "Library"],
    programs: ["VCE", "STEM", "Arts", "Sports Excellence"],
    founded: 1994,
    principal: "Karen Money",
    featured: true
  },

  // Northern Region Schools
  {
    name: "Brunswick East Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Brunswick",
    postcode: "3057",
    address: "195-197 Stewart Street, Brunswick East",
    yearLevels: "P-6",
    latitude: "-37.7714",
    longitude: "144.9800",
    studentCount: 400,
    atarAverage: null,
    description: "Brunswick East Primary School is a vibrant inner-city school with a focus on sustainability, community engagement, and comprehensive education.",
    website: "https://www.brunswickeastps.vic.edu.au",
    phone: "(03) 9387 3361",
    email: "brunswick.east.ps@education.vic.gov.au",
    facilities: ["Library", "Garden", "Art Room", "Music Room"],
    programs: ["Italian Language", "Sustainability", "Arts", "Music"],
    founded: 1893,
    principal: "Janet Di Pilla",
    featured: false
  },
  {
    name: "Northcote High School",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Northcote",
    postcode: "3070",
    address: "19 St Georges Road, Northcote",
    yearLevels: "7-12",
    latitude: "-37.7712",
    longitude: "144.9970",
    studentCount: 1600,
    atarAverage: 80,
    description: "Northcote High School is a comprehensive co-educational secondary school with a rich history of providing quality education in Melbourne's inner north.",
    website: "https://www.nhs.vic.edu.au",
    phone: "(03) 9488 2300",
    email: "northcote.hs@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Science Centre", "Sports Grounds", "Library"],
    programs: ["VCE", "SEAL", "Languages", "Music"],
    founded: 1926,
    principal: "Sue Harrap",
    featured: true
  },

  // Western Region Schools
  {
    name: "Footscray Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Footscray",
    postcode: "3011",
    address: "Geelong Road, Footscray",
    yearLevels: "P-6",
    latitude: "-37.7995",
    longitude: "144.8925",
    studentCount: 380,
    atarAverage: null,
    description: "Footscray Primary School provides a multicultural learning environment with a strong focus on bilingual education and community engagement.",
    website: "https://www.footscrayps.vic.edu.au",
    phone: "(03) 9687 1910",
    email: "footscray.ps@education.vic.gov.au",
    facilities: ["Library", "Language Lab", "Art Room", "Playground"],
    programs: ["Bilingual Vietnamese", "STEM", "Arts", "Physical Education"],
    founded: 1877,
    principal: "Jen Briggs",
    featured: false
  },
  {
    name: "Williamstown High School",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Williamstown",
    postcode: "3016",
    address: "76 Pasco Street, Williamstown",
    yearLevels: "7-12",
    latitude: "-37.8599",
    longitude: "144.8945",
    studentCount: 1500,
    atarAverage: 78,
    description: "Williamstown High School is a dual-campus secondary school offering a diverse curriculum with a strong focus on sports, arts, and academic excellence.",
    website: "https://www.willihigh.vic.edu.au",
    phone: "(03) 9397 1899",
    email: "williamstown.hs@education.vic.gov.au",
    facilities: ["Sports Complex", "Marine Education Centre", "Performing Arts Centre", "Library"],
    programs: ["VCE", "Marine Studies", "Sports Excellence", "Arts"],
    founded: 1914,
    principal: "Gino Catalano",
    featured: true
  },

  // South-Eastern Region Schools
  {
    name: "Brighton Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Brighton",
    postcode: "3186",
    address: "59 Wilson Street, Brighton",
    yearLevels: "P-6",
    latitude: "-37.9045",
    longitude: "144.9966",
    studentCount: 750,
    atarAverage: null,
    description: "Brighton Primary School is one of the oldest primary schools in Victoria, offering comprehensive education with a focus on student wellbeing and academic excellence.",
    website: "https://www.brightonps.vic.edu.au",
    phone: "(03) 9592 0177",
    email: "brighton.ps@education.vic.gov.au",
    facilities: ["Library", "STEM Lab", "Art Room", "Sports Grounds"],
    programs: ["STEM", "Language", "Arts", "Sports"],
    founded: 1875,
    principal: "James Barclay",
    featured: false
  },
  {
    name: "McKinnon Secondary College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "McKinnon",
    postcode: "3204",
    address: "McKinnon Road, McKinnon",
    yearLevels: "7-12",
    latitude: "-37.9083",
    longitude: "145.0428",
    studentCount: 2200,
    atarAverage: 85,
    description: "McKinnon Secondary College is a high-performing public school known for its academic excellence and comprehensive extracurricular programs.",
    website: "https://www.mckinnonsc.vic.edu.au",
    phone: "(03) 8520 9000",
    email: "mckinnon.sc@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Science Centre", "Sports Complex", "Library"],
    programs: ["VCE", "SEAL", "STEM", "Music Excellence"],
    founded: 1954,
    principal: "Pitsa Binnion",
    featured: true
  },

  // Catholic Schools across regions
  {
    name: "St Mary's Primary School",
    type: "Catholic",
    educationLevel: "Primary",
    suburb: "Malvern East",
    postcode: "3145",
    address: "91 Manning Road, Malvern East",
    yearLevels: "P-6",
    latitude: "-37.8726",
    longitude: "145.0664",
    studentCount: 420,
    atarAverage: null,
    description: "St Mary's is a Catholic primary school providing education in the Catholic tradition with a focus on faith development and academic excellence.",
    website: "https://www.smmalverneast.catholic.edu.au",
    phone: "(03) 9571 1358",
    email: "principal@smmalverneast.catholic.edu.au",
    facilities: ["Chapel", "Library", "STEM Lab", "Playground"],
    programs: ["Religious Education", "Literacy", "Numeracy", "Arts"],
    founded: 1923,
    principal: "Anne O'Brien",
    featured: false
  },
  {
    name: "Simonds Catholic College",
    type: "Catholic",
    educationLevel: "Secondary",
    suburb: "West Melbourne",
    postcode: "3003",
    address: "273 Victoria Street, West Melbourne",
    yearLevels: "7-12",
    latitude: "-37.8063",
    longitude: "144.9495",
    studentCount: 700,
    atarAverage: 75,
    description: "Simonds Catholic College is a Catholic secondary school for boys that provides education in the Edmund Rice tradition with a focus on faith, excellence, and community.",
    website: "https://www.sccmelb.catholic.edu.au",
    phone: "(03) 9321 9200",
    email: "info@sccmelb.catholic.edu.au",
    facilities: ["Chapel", "Sports Courts", "Science Labs", "Library"],
    programs: ["VCE", "VCAL", "Religious Education", "Sports"],
    founded: 1996,
    principal: "Peter Riordan",
    featured: false
  },

  // Private Schools across regions
  {
    name: "Scotch College",
    type: "Private",
    educationLevel: "Secondary",
    suburb: "Hawthorn",
    postcode: "3122",
    address: "1 Morrison Street, Hawthorn",
    yearLevels: "P-12",
    latitude: "-37.8250",
    longitude: "145.0231",
    studentCount: 1800,
    atarAverage: 90,
    description: "Scotch College is one of Australia's oldest and most prestigious independent schools for boys, offering a comprehensive education with a focus on excellence and character development.",
    website: "https://www.scotch.vic.edu.au",
    phone: "(03) 9810 4321",
    email: "admissions@scotch.vic.edu.au",
    facilities: ["Aquatic Centre", "Performing Arts Centre", "Science Labs", "Sports Fields"],
    programs: ["IB", "VCE", "Music", "Sports"],
    founded: 1851,
    principal: "Tom Batty",
    featured: true
  },
  {
    name: "Wesley College",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Melbourne",
    postcode: "3004",
    address: "577 St Kilda Road, Melbourne",
    yearLevels: "P-12",
    latitude: "-37.8381",
    longitude: "144.9768",
    studentCount: 3200,
    atarAverage: 88,
    description: "Wesley College is a leading co-educational, open-entry independent school with multiple campuses across Melbourne offering both IB and VCE programs.",
    website: "https://www.wesleycollege.edu.au",
    phone: "(03) 8102 6888",
    email: "admissions@wesleycollege.edu.au",
    facilities: ["Arts Centre", "Aquatic Centre", "Sports Complex", "Science Centre"],
    programs: ["IB", "VCE", "Music", "Sports Excellence"],
    founded: 1866,
    principal: "Nicholas Evans",
    featured: true
  }
];

async function importSchools(): Promise<{ success: true; count: number; errors: number }> {
  console.log('Starting import of Melbourne schools...');
  let importCount = 0;
  let errorCount = 0;
  
  for (const schoolData of schoolsData) {
    try {
      if (!schoolData.name || !schoolData.type || !schoolData.educationLevel) {
        console.error(`Skipping school with missing required fields: ${schoolData.name || 'Unnamed'}`);
        errorCount++;
        continue;
      }
      
      // Validate school type
      if (!SCHOOL_TYPES.includes(schoolData.type as any)) {
        console.error(`Invalid school type for ${schoolData.name}: ${schoolData.type}`);
        errorCount++;
        continue;
      }
      
      // Validate education level
      if (!EDUCATION_LEVELS.includes(schoolData.educationLevel as any)) {
        console.error(`Invalid education level for ${schoolData.name}: ${schoolData.educationLevel}`);
        errorCount++;
        continue;
      }
      
      // Check if school already exists to avoid duplicates
      const existingSchools = await storage.searchSchools(schoolData.name);
      const exists = existingSchools.some(s => 
        s.name === schoolData.name && 
        s.suburb === schoolData.suburb
      );
      
      if (exists) {
        console.log(`School already exists, skipping: ${schoolData.name}`);
        continue;
      }
      
      // Create the school
      await storage.createSchool(schoolData as any);
      console.log(`Successfully imported school: ${schoolData.name}`);
      importCount++;
    } catch (error) {
      console.error(`Error importing school ${schoolData.name}:`, error);
      errorCount++;
    }
  }
  
  console.log(`Import complete. Successfully imported ${importCount} schools with ${errorCount} errors.`);
  return { success: true as const, count: importCount, errors: errorCount };
}

// Define the return type for consistency
type ImportResult = 
  | { success: true; count: number; errors: number } 
  | { success: false; error: string };

// Function to run the import
export async function importMelbourneSchools(): Promise<ImportResult> {
  try {
    const result = await importSchools();
    return result;
  } catch (error) {
    console.error('Failed to import schools:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// For ES modules, we can't use require.main === module
// This code will only run if this file is directly executed
if (import.meta.url === `file://${process.argv[1]}`) {
  importMelbourneSchools()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Import failed:', err);
      process.exit(1);
    });
}