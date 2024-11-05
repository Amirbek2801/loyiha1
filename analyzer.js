export function extractSigns(records) {
  const signs = {
    vitalSigns: {},
    anomalies: [],
    patterns: {}
  };

  // Extract vital signs statistics
  const extractNumericValue = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  // Process each record for vital signs
  records.forEach(record => {
    Object.entries(record).forEach(([key, value]) => {
      const numericValue = extractNumericValue(value);
      if (numericValue !== null) {
        if (!signs.vitalSigns[key]) {
          signs.vitalSigns[key] = [];
        }
        signs.vitalSigns[key].push(numericValue);
      }
    });
  });

  // Calculate statistics for vital signs
  Object.entries(signs.vitalSigns).forEach(([key, values]) => {
    signs.vitalSigns[key] = {
      mean: mean(values),
      standardDeviation: standardDeviation(values),
      min: Math.min(...values),
      max: Math.max(...values)
    };
  });

  // Detect anomalies (values outside 2 standard deviations)
  records.forEach((record, index) => {
    Object.entries(record).forEach(([key, value]) => {
      const numericValue = extractNumericValue(value);
      if (numericValue !== null && signs.vitalSigns[key]) {
        const stats = signs.vitalSigns[key];
        const zScore = Math.abs((numericValue - stats.mean) / stats.standardDeviation);
        if (zScore > 2) {
          signs.anomalies.push({
            recordIndex: index,
            field: key,
            value: numericValue,
            zScore
          });
        }
      }
    });
  });

  // Detect patterns in sequential readings
  Object.entries(signs.vitalSigns).forEach(([key, stats]) => {
    const trend = detectTrend(records.map(r => extractNumericValue(r[key])).filter(v => v !== null));
    signs.patterns[key] = trend;
  });

  return signs;
}

function detectTrend(values) {
  if (values.length < 2) return 'insufficient data';
  
  let increasing = 0;
  let decreasing = 0;
  
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i-1]) increasing++;
    if (values[i] < values[i-1]) decreasing++;
  }
  
  const total = increasing + decreasing;
  if (increasing / total > 0.6) return 'increasing';
  if (decreasing / total > 0.6) return 'decreasing';
  return 'stable';
}
