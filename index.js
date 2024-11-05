import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { mean, standardDeviation } from 'simple-statistics';
import { extractSigns } from './analyzer.js';
import { validateData } from './validator.js';

async function analyzeMedicalData(filePath) {
  const records = [];
  
  const parser = createReadStream(filePath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true
    }));

  for await (const record of parser) {
    if (validateData(record)) {
      records.push(record);
    }
  }

  return extractSigns(records);
}

// Example usage
const filePath = './data/medical_records.csv';
try {
  const results = await analyzeMedicalData(filePath);
  console.log('Analysis Results:', results);
} catch (error) {
  console.error('Error analyzing medical data:', error.message);
}
