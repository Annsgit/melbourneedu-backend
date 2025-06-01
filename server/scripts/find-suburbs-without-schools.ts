import { db } from '../db';
import { schools } from '@shared/schema';
import { sql } from 'drizzle-orm';
import { storage } from '../storage';
import { getAllMelbourneSuburbs } from '../../client/src/lib/melbourneSuburbs';

/**
 * This script identifies suburbs in Melbourne that don't have schools in our database yet.
 * It helps prioritize which suburbs we should add schools for next.
 */
async function findSuburbsWithoutSchools() {
  try {
    // Get all current suburbs with schools in our database
    const schoolSuburbsQuery = await db.select({
      suburb: schools.suburb
    })
    .from(schools)
    .groupBy(schools.suburb);
    
    const schoolSuburbs = schoolSuburbsQuery.map(s => s.suburb.toLowerCase());
    console.log(`Found ${schoolSuburbs.length} suburbs with schools in the database.`);
    
    // Get all suburbs from the database
    const allSuburbs = await storage.getAllSuburbs();
    console.log(`Found ${allSuburbs.length} suburbs in the suburbs table.`);
    
    // Get comprehensive list of Melbourne suburbs
    const melbourneSuburbs = getAllMelbourneSuburbs();
    console.log(`Found ${melbourneSuburbs.length} suburbs in the comprehensive Melbourne list.`);
    
    // Find suburbs without schools in our database
    const suburbsWithoutSchools = melbourneSuburbs.filter(
      suburb => !schoolSuburbs.includes(suburb.name.toLowerCase())
    );
    
    console.log(`Found ${suburbsWithoutSchools.length} suburbs without schools.`);
    
    // Sort by importance (using region as a proxy for importance)
    const priorityRegions = [
      'Inner Melbourne',
      'Eastern Melbourne',
      'Western Melbourne',
      'Northern Melbourne',
      'Southern Melbourne',
      'Bayside'
    ];
    
    // Prioritize suburbs by region
    const prioritizedSuburbs = suburbsWithoutSchools.sort((a, b) => {
      const aIndex = priorityRegions.indexOf(a.region || '');
      const bIndex = priorityRegions.indexOf(b.region || '');
      
      if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      return aIndex - bIndex;
    });
    
    // Print the top 20 priority suburbs
    console.log('\nTop 20 priority suburbs without schools:');
    prioritizedSuburbs.slice(0, 20).forEach((suburb, i) => {
      console.log(`${i+1}. ${suburb.name} (${suburb.postcode}) - ${suburb.region || 'Unknown'}`);
    });
    
    return {
      totalSuburbs: melbourneSuburbs.length,
      suburbsWithSchools: schoolSuburbs.length,
      suburbsWithoutSchools: suburbsWithoutSchools.length,
      prioritySuburbs: prioritizedSuburbs.slice(0, 20).map(s => s.name)
    };
  } catch (error) {
    console.error('Error finding suburbs without schools:', error);
    throw error;
  }
}

// Run the function if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  findSuburbsWithoutSchools()
    .then(result => {
      console.log('Completed analysis.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Failed to complete analysis:', err);
      process.exit(1);
    });
}

export default findSuburbsWithoutSchools;