import { storage } from '../storage';

/**
 * Analyzes suburb coverage with schools in the database
 */
async function analyzeSchoolCoverage() {
  try {
    // Get all suburbs
    const suburbs = await storage.getAllSuburbs();
    console.log(`Total suburbs in the database: ${suburbs.length}`);
    
    // Get all schools
    const schools = await storage.getAllSchools();
    console.log(`Total schools in the database: ${schools.length}`);
    
    // Create a map of suburb names to school counts
    const suburbCoverage = new Map<string, number>();
    
    // Initialize with zero schools for each suburb
    suburbs.forEach(suburb => {
      suburbCoverage.set(suburb.name, 0);
    });
    
    // Count schools for each suburb
    schools.forEach(school => {
      const suburb = school.suburb;
      if (suburb) {
        const currentCount = suburbCoverage.get(suburb) || 0;
        suburbCoverage.set(suburb, currentCount + 1);
      }
    });
    
    // Get suburbs with schools
    const entriesArray = Array.from(suburbCoverage.entries());
    const suburbsWithSchools = entriesArray
      .filter(entry => entry[1] > 0)
      .map(entry => ({ name: entry[0], count: entry[1] }));
    
    // Get suburbs without schools
    const suburbsWithoutSchools = entriesArray
      .filter(entry => entry[1] === 0)
      .map(entry => entry[0]);
    
    // Calculate coverage percentage
    const coveragePercentage = (suburbsWithSchools.length / suburbs.length) * 100;
    
    console.log(`\nSuburbs with schools: ${suburbsWithSchools.length} (${coveragePercentage.toFixed(2)}%)`);
    console.log('Suburb coverage:');
    suburbsWithSchools
      .sort((a, b) => b.count - a.count)
      .forEach(({ name, count }) => {
        console.log(`  ${name}: ${count} schools`);
      });
    
    console.log(`\nSuburbs without schools: ${suburbsWithoutSchools.length}`);
    console.log(suburbsWithoutSchools.join(', '));
    
    // Return the results
    return {
      totalSuburbs: suburbs.length,
      totalSchools: schools.length,
      suburbsWithSchools: suburbsWithSchools.length,
      coveragePercentage,
      suburbsWithoutSchools
    };
  } catch (error) {
    console.error('Error analyzing school coverage:', error);
    throw error;
  }
}

// Execute the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeSchoolCoverage()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Unhandled error:', err);
      process.exit(1);
    });
}

export default analyzeSchoolCoverage;