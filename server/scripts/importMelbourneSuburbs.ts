import { importSuburbsFromABS } from '../utils/importSuburbs';

async function main() {
  console.log('Starting Melbourne suburbs import from ABS...');
  try {
    const result = await importSuburbsFromABS();
    
    if (result.success) {
      console.log(`✓ ${result.message}`);
      process.exit(0);
    } else {
      console.error(`✗ ${result.message}`);
      console.error(`Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error during suburb import:');
    console.error(error);
    process.exit(1);
  }
}

main();