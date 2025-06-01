import { storage } from '../storage';
import { InsertSchool } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Sixth batch of priority suburb schools to import - focusing on Southeastern Melbourne
const PRIORITY_SCHOOLS_BATCH6: InsertSchool[] = [
  {
    name: "Berwick Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Berwick",
    postcode: "3806",
    address: "35 Mansfield Street, Berwick",
    yearLevels: "P-6",
    latitude: "-38.0361",
    longitude: "145.3426",
    studentCount: 580,
    description: "Berwick Primary School provides a comprehensive education with a focus on developing students as well-rounded individuals in a supportive learning environment.",
    website: "https://www.berwickprimaryschool.vic.edu.au",
    phone: "(03) 9707 1510",
    email: "berwick.ps@education.vic.gov.au",
    facilities: ["Library", "Art Room", "Sports Courts", "STEM Center"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1869,
    principal: "Jessica Leonard",
    featured: false
  },
  {
    name: "Berwick Lodge Primary School",
    type: "Public",
    educationLevel: "Primary",
    suburb: "Berwick",
    postcode: "3806",
    address: "Mansfield Street, Berwick",
    yearLevels: "P-6",
    latitude: "-38.0343",
    longitude: "145.3452",
    studentCount: 710,
    description: "Berwick Lodge Primary School provides a supportive learning environment that focuses on student wellbeing and academic achievement through personalized learning approaches.",
    website: "https://www.berwicklodge.vic.edu.au",
    phone: "(03) 9707 1766",
    email: "berwick.lodge.ps@education.vic.gov.au",
    facilities: ["Library", "Performing Arts Space", "STEM Center", "Sports Courts"],
    programs: ["Visual Arts", "Music", "Physical Education", "STEM"],
    founded: 1990,
    principal: "Henry Grossek",
    featured: false
  },
  {
    name: "Beaconhills College",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Berwick",
    postcode: "3806",
    address: "92 Kangan Drive, Berwick",
    yearLevels: "ELC-12",
    latitude: "-38.0553",
    longitude: "145.3429",
    studentCount: 1700,
    atarAverage: 80,
    description: "Beaconhills College is an independent co-educational school with a Christian ethos, offering a comprehensive education from early learning to Year 12 across two campuses.",
    website: "https://www.beaconhills.vic.edu.au",
    phone: "(03) 5945 0200",
    email: "enquiries@beaconhills.vic.edu.au",
    facilities: ["Performing Arts Centre", "Sports Complex", "Science Labs", "Technology Centre"],
    programs: ["VCE", "Global Programs", "Performing Arts", "Sports Academy"],
    founded: 1982,
    principal: "Tony Sheumack",
    fees: "17200",
    featured: false
  },
  {
    name: "Nossal High School",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Berwick",
    postcode: "3806",
    address: "100 Clyde Road, Berwick",
    yearLevels: "9-12",
    latitude: "-38.0387",
    longitude: "145.3416",
    studentCount: 830,
    atarAverage: 94,
    description: "Nossal High School is a selective entry co-educational school for academically gifted students, focusing on excellence in teaching and learning.",
    website: "https://www.nossal.vic.edu.au",
    phone: "(03) 8762 4600",
    email: "nossal.hs@education.vic.gov.au",
    facilities: ["Science Labs", "Library", "Lecture Theatre", "Sports Facilities"],
    programs: ["VCE", "Advanced Mathematics", "Science Academy", "Languages"],
    founded: 2010,
    principal: "Roger Page",
    featured: true
  },
  {
    name: "Haileybury College",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Keysborough",
    postcode: "3173",
    address: "855 Springvale Road, Keysborough",
    yearLevels: "ELC-12",
    latitude: "-38.0060",
    longitude: "145.1581",
    studentCount: 4000,
    atarAverage: 90,
    description: "Haileybury is one of the largest independent schools in Australia, offering a parallel education model with separate boys and girls classes on the same campus.",
    website: "https://www.haileybury.com.au",
    phone: "(03) 9904 6000",
    email: "admissions@haileybury.vic.edu.au",
    facilities: ["Aquatic Centre", "Performing Arts Centre", "Science & Technology Centre", "Sports Complex"],
    programs: ["IB", "VCE", "Sports Academy", "Music Academy"],
    founded: 1892,
    principal: "Derek Scott",
    fees: "32500",
    featured: true
  },
  {
    name: "St Leonard's College",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Brighton East",
    postcode: "3187",
    address: "163 South Road, Brighton East",
    yearLevels: "ELC-12",
    latitude: "-37.9100",
    longitude: "144.9992",
    studentCount: 1700,
    atarAverage: 88,
    description: "St Leonard's College is an independent, co-educational school offering both the IB and VCE, with a focus on academic excellence and holistic education.",
    website: "https://www.stleonards.vic.edu.au",
    phone: "(03) 9909 9300",
    email: "admissions@stleonards.vic.edu.au",
    facilities: ["Performing Arts Centre", "Sports Centre", "Visual Arts Centre", "Science Labs"],
    programs: ["IB", "VCE", "Music", "STEM"],
    founded: 1914,
    principal: "Stuart Davis",
    fees: "31900",
    featured: false
  },
  {
    name: "Brighton Secondary College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Brighton East",
    postcode: "3187",
    address: "120 Marriage Road, Brighton East",
    yearLevels: "7-12",
    latitude: "-37.9142",
    longitude: "145.0018",
    studentCount: 1200,
    atarAverage: 78,
    description: "Brighton Secondary College provides a comprehensive education with a focus on academic excellence, student wellbeing, and global citizenship.",
    website: "https://www.brightonsc.vic.edu.au",
    phone: "(03) 9592 7488",
    email: "brighton.sc@education.vic.gov.au",
    facilities: ["Library", "Sports Centre", "Science Labs", "Performing Arts Space"],
    programs: ["VCE", "STEM", "Arts", "Sports"],
    founded: 1955,
    principal: "Richard Minack",
    featured: false
  },
  {
    name: "Mentone Girls' Grammar School",
    type: "Private",
    educationLevel: "Combined",
    suburb: "Mentone",
    postcode: "3194",
    address: "11 Mentone Parade, Mentone",
    yearLevels: "ELC-12",
    latitude: "-38.0034",
    longitude: "145.0652",
    studentCount: 800,
    atarAverage: 86,
    description: "Mentone Girls' Grammar School is a leading independent school for girls offering a comprehensive education from early learning to Year 12 in a supportive environment.",
    website: "https://www.mentonegirls.vic.edu.au",
    phone: "(03) 9581 1200",
    email: "info@mentonegirls.vic.edu.au",
    facilities: ["Aquatic Centre", "Performing Arts Centre", "STEM Centre", "Sports Facilities"],
    programs: ["VCE", "Enterprise Academy", "STEM", "Performing Arts"],
    founded: 1899,
    principal: "Natalie Charles",
    fees: "29800",
    featured: false
  },
  {
    name: "Cheltenham Secondary College",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Cheltenham",
    postcode: "3192",
    address: "Bernard Street, Cheltenham",
    yearLevels: "7-12",
    latitude: "-37.9617",
    longitude: "145.0696",
    studentCount: 1100,
    atarAverage: 75,
    description: "Cheltenham Secondary College offers a comprehensive education with a focus on academic achievement, student wellbeing, and community engagement.",
    website: "https://www.cheltenhamsc.vic.edu.au",
    phone: "(03) 9555 5955",
    email: "cheltenham.sc@education.vic.gov.au",
    facilities: ["Performing Arts Centre", "Sports Complex", "Science Labs", "Library"],
    programs: ["VCE", "VCAL", "STEM", "Arts"],
    founded: 1959,
    principal: "Wayne Saunders",
    featured: false
  },
  {
    name: "Frankston High School",
    type: "Public",
    educationLevel: "Secondary",
    suburb: "Frankston",
    postcode: "3199",
    address: "Foot Street, Frankston",
    yearLevels: "7-12",
    latitude: "-38.1558",
    longitude: "145.1271",
    studentCount: 1900,
    atarAverage: 76,
    description: "Frankston High School is a dual campus school known for its academic excellence, sports programs, and supportive learning environment.",
    website: "https://www.fhs.vic.edu.au",
    phone: "(03) 9783 7955",
    email: "frankston.hs@education.vic.gov.au",
    facilities: ["Sports Complex", "Performing Arts Centre", "Science Centre", "Library"],
    programs: ["VCE", "SEAL Program", "Sports Academy", "Music"],
    founded: 1924,
    principal: "John Albiston",
    featured: false
  }
];

/**
 * Imports a sixth batch of priority schools into the database
 */
async function importPrioritySuburbsBatch6() {
  console.log(`Starting import of ${PRIORITY_SCHOOLS_BATCH6.length} schools from priority suburbs (batch 6)...`);
  
  let importCount = 0;
  let errorCount = 0;
  
  for (const school of PRIORITY_SCHOOLS_BATCH6) {
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
  importPrioritySuburbsBatch6()
    .then(({ importCount }) => {
      console.log(`Successfully imported ${importCount} schools.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Failed to import priority suburbs schools (batch 6):', err);
      process.exit(1);
    });
}

export default importPrioritySuburbsBatch6;