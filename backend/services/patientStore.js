const patients = [
  { id: 1, name: 'Alice', status: 'stable', lastChecked: new Date(), vitals: { heartRate: 72 } },
  { id: 2, name: 'Bob', status: 'monitored', lastChecked: new Date(), vitals: { heartRate: 88 } }
];

function getAllPatients() {
  return patients;
}

function getPatientById(id) {
  return patients.find(patient => patient.id === id);
}

function createPatient(data) {
  const newPatient = {
    id: patients.length > 0 ? Math.max(...patients.map(patient => patient.id)) + 1 : 1,
    ...data,
    lastChecked: new Date()
  };

  patients.push(newPatient);
  return newPatient;
}

function updatePatient(id, data) {
  const patient = getPatientById(id);

  if (!patient) {
    return null;
  }

  if (data.name) patient.name = data.name;
  if (data.status) patient.status = data.status;
  if (data.vitals) patient.vitals = data.vitals;
  patient.lastChecked = new Date();

  return patient;
}

function deletePatient(id) {
  const index = patients.findIndex(patient => patient.id === id);

  if (index < 0) {
    return null;
  }

  const deleted = patients.splice(index, 1);
  return deleted[0];
}

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};