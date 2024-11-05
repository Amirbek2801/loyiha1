export function validateData(record) {
  // Check if record has required fields
  const requiredFields = ['timestamp', 'patient_id'];
  if (!requiredFields.every(field => record.hasOwnProperty(field))) {
    return false;
  }

  // Validate timestamp
  if (!isValidTimestamp(record.timestamp)) {
    return false;
  }

  // Validate patient_id format
  if (!isValidPatientId(record.patient_id)) {
    return false;
  }

  // Validate numeric fields
  const numericFields = Object.entries(record).filter(([_, value]) => 
    !isNaN(parseFloat(value)) && isFinite(value)
  );

  if (numericFields.length === 0) {
    return false;
  }

  return true;
}

function isValidTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date instanceof Date && !isNaN(date);
}

function isValidPatientId(id) {
  // Assuming patient ID is alphanumeric and at least 4 characters
  return /^[A-Za-z0-9]{4,}$/.test(id);
}
