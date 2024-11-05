import assert from 'assert';
import { extractSigns } from './analyzer.js';
import { validateData } from './validator.js';

// Test data validation
console.log('Testing data validation...');
const validRecord = {
  timestamp: '2023-11-14T10:00:00Z',
  patient_id: 'P12345',
  temperature: '37.5',
  heart_rate: '72'
};

const invalidRecord = {
  timestamp: 'invalid',
  patient_id: '123'
};

assert.strictEqual(validateData(validRecord), true, 'Valid record should pass validation');
assert.strictEqual(validateData(invalidRecord), false, 'Invalid record should fail validation');

// Test sign extraction
console.log('Testing sign extraction...');
const testRecords = [
  { temperature: '37.0', heart_rate: '70' },
  { temperature: '37.5', heart_rate: '72' },
  { temperature: '38.0', heart_rate: '75' }
];

const results = extractSigns(testRecords);
assert(results.vitalSigns.temperature, 'Should extract temperature statistics');
assert(results.vitalSigns.heart_rate, 'Should extract heart rate statistics');

console.log('All tests passed!');
