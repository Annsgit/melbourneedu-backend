import fs from 'fs';
import path from 'path';
import { storage } from '../storage';
import { InsertSuburb } from '@shared/schema';

export async function importAllMelbourneSuburbs() {
  try {
    // Read the Melbourne suburbs JSON file
    const melbourneSuburbsPath = path.join(__dirname, '..', 'data', 'melbourne-suburbs.json');
    
    if (!fs.existsSync(melbourneSuburbsPath)) {
      return {
        success: false,
        message: "Melbourne suburbs data file not found",
        error: "Data file not found"
      };
    }
    
    const suburbsData = JSON.parse(fs.readFileSync(melbourneSuburbsPath, 'utf8'));
    
    // Get existing suburbs to avoid duplicates
    const existingSuburbs = await storage.getAllSuburbs();
    const existingSuburbNames = new Set(existingSuburbs.map(s => s.name.toLowerCase()));
    
    // Filter out suburbs that already exist
    const newSuburbs = suburbsData.filter((suburb: {name: string, postcode: string, region: string}) => 
      !existingSuburbNames.has(suburb.name.toLowerCase())
    );
    
    // Insert the new suburbs
    const importedSuburbs = [];
    for (const suburb of newSuburbs as {name: string, postcode: string, region: string}[]) {
      try {
        const newSuburb = await storage.createSuburb({
          name: suburb.name,
          postcode: suburb.postcode,
          region: suburb.region
        } as InsertSuburb);
        importedSuburbs.push(newSuburb);
      } catch (error) {
        console.error(`Error importing suburb ${suburb.name}:`, error);
      }
    }
    
    return {
      success: true,
      message: `Successfully imported ${importedSuburbs.length} new Melbourne suburbs`,
      count: importedSuburbs.length,
      alreadyExisting: suburbsData.length - newSuburbs.length,
      totalSuburbs: existingSuburbs.length + importedSuburbs.length
    };
  } catch (error) {
    console.error("Error importing all Melbourne suburbs:", error);
    return {
      success: false,
      message: "Failed to import all Melbourne suburbs",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}