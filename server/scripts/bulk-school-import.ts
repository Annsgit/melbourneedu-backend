import { storage } from '../storage';
import type { InsertSchool } from '@shared/schema';
import { SCHOOL_TYPES, EDUCATION_LEVELS } from '@shared/schema';
import fs from 'fs';
import path from 'path';

interface SchoolImportResult {
  success: boolean;
  count: number;
  errors: number;
  errorDetails?: string[];
}

/**
 * Imports schools from a JSON file
 * @param filePath Path to the JSON file containing school data
 */
export async function importSchoolsFromJSON(filePath: string): Promise<SchoolImportResult> {
  try {
    // Read the file
    const data = fs.readFileSync(filePath, 'utf8');
    const schools = JSON.parse(data) as Partial<InsertSchool>[];
    
    // Import the schools
    return await importSchools(schools);
  } catch (error) {
    console.error('Error importing schools from JSON:', error);
    return {
      success: false,
      count: 0,
      errors: 1,
      errorDetails: [error instanceof Error ? error.message : String(error)]
    };
  }
}

/**
 * Imports a list of schools into the database
 * @param schoolsData Array of school data objects
 */
export async function importSchools(schoolsData: Partial<InsertSchool>[]): Promise<SchoolImportResult> {
  console.log(`Starting import of ${schoolsData.length} schools...`);
  let importCount = 0;
  let errorCount = 0;
  const errorDetails: string[] = [];
  
  for (const schoolData of schoolsData) {
    try {
      if (!schoolData.name || !schoolData.type || !schoolData.educationLevel) {
        const errorMsg = `Skipping school with missing required fields: ${schoolData.name || 'Unnamed'}`;
        console.error(errorMsg);
        errorDetails.push(errorMsg);
        errorCount++;
        continue;
      }
      
      // Validate school type
      if (!SCHOOL_TYPES.includes(schoolData.type as any)) {
        const errorMsg = `Invalid school type for ${schoolData.name}: ${schoolData.type}`;
        console.error(errorMsg);
        errorDetails.push(errorMsg);
        errorCount++;
        continue;
      }
      
      // Validate education level
      if (!EDUCATION_LEVELS.includes(schoolData.educationLevel as any)) {
        const errorMsg = `Invalid education level for ${schoolData.name}: ${schoolData.educationLevel}`;
        console.error(errorMsg);
        errorDetails.push(errorMsg);
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
      const errorMsg = `Error importing school ${schoolData.name}: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg);
      errorDetails.push(errorMsg);
      errorCount++;
    }
  }
  
  console.log(`Import complete. Successfully imported ${importCount} schools with ${errorCount} errors.`);
  return { 
    success: true, 
    count: importCount, 
    errors: errorCount,
    errorDetails: errorDetails.length > 0 ? errorDetails : undefined
  };
}

/**
 * Generate a template JSON file that can be filled with school data
 * @param outputPath Path where the template should be saved
 * @param count Number of template entries to generate
 */
export function generateSchoolTemplate(outputPath: string, count: number = 10): void {
  const template: Partial<InsertSchool>[] = Array.from({ length: count }, (_, i) => ({
    name: `School Name ${i+1}`,
    type: "Public", // Public, Private, Catholic
    educationLevel: "Secondary", // Primary, Secondary, Combined
    suburb: "Suburb Name",
    postcode: "3000",
    address: "123 School Street",
    yearLevels: "P-6", // or "7-12", "P-12"
    latitude: "-37.8136",
    longitude: "144.9631",
    studentCount: 500,
    atarAverage: null, // Only for secondary schools
    description: "School description goes here.",
    website: "https://www.school-website.edu.au",
    phone: "(03) 1234 5678",
    email: "school@example.edu.au",
    facilities: ["Library", "Sports Ground", "Science Lab"],
    programs: ["Program 1", "Program 2", "Program 3"],
    founded: 1980,
    principal: "Principal Name",
    featured: false
  }));
  
  fs.writeFileSync(outputPath, JSON.stringify(template, null, 2));
  console.log(`Template generated at ${outputPath}`);
}

// If script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check if generating template
  if (process.argv.includes('--generate-template')) {
    const outputPath = process.argv[3] || './school-template.json';
    const count = parseInt(process.argv[4] || '10');
    generateSchoolTemplate(outputPath, count);
  }
  // Check if importing from JSON
  else if (process.argv.includes('--import')) {
    const filePath = process.argv[3];
    if (!filePath) {
      console.error('Please provide a file path: ts-node bulk-school-import.ts --import <file-path>');
      process.exit(1);
    }
    
    importSchoolsFromJSON(filePath)
      .then(result => {
        console.log(result);
        process.exit(result.success ? 0 : 1);
      })
      .catch(err => {
        console.error('Import failed:', err);
        process.exit(1);
      });
  } else {
    console.log('Usage:');
    console.log('  Generate template: ts-node bulk-school-import.ts --generate-template [output-path] [count]');
    console.log('  Import from JSON: ts-node bulk-school-import.ts --import <file-path>');
  }
}