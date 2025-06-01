import { importSchoolsFromJSON } from './bulk-school-import';
import path from 'path';
import { fileURLToPath } from 'url';

async function main() {
  try {
    // Get the directory path in ESM compatible way
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Path to the JSON file with school data
    const filePath = path.resolve(__dirname, '../data/melbourne-schools-missing-suburbs.json');
    
    console.log(`Importing schools from ${filePath}...`);
    
    // Import the schools
    const result = await importSchoolsFromJSON(filePath);
    
    if (result.success) {
      console.log(`Successfully imported ${result.count} schools with ${result.errors} errors.`);
      if (result.errorDetails && result.errorDetails.length > 0) {
        console.log('Error details:');
        result.errorDetails.forEach((error, i) => {
          console.log(`${i + 1}. ${error}`);
        });
      }
    } else {
      console.error('Failed to import schools:', result.errorDetails);
    }
  } catch (error) {
    console.error('Error executing the import script:', error);
  }
}

// Execute the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Unhandled error:', err);
      process.exit(1);
    });
}

export default main;