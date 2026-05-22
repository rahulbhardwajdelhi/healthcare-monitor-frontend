// Patient model validation
function validatePatient(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!data.status || !['stable', 'monitored', 'critical', 'discharged'].includes(data.status)) {
    errors.push('Status must be one of: stable, monitored, critical, discharged');
  }

  if (data.vitals) {
    if (data.vitals.heartRate && (typeof data.vitals.heartRate !== 'number' || data.vitals.heartRate < 0)) {
      errors.push('Heart rate must be a non-negative number');
    }
    if (data.vitals.bloodPressure && typeof data.vitals.bloodPressure !== 'string') {
      errors.push('Blood pressure must be a string (e.g., "120/80")');
    }
    if (data.vitals.temperature && (typeof data.vitals.temperature !== 'number' || data.vitals.temperature < 35 || data.vitals.temperature > 42)) {
      errors.push('Temperature must be a number between 35 and 42');
    }
  }

  return errors;
}

module.exports = { validatePatient };
