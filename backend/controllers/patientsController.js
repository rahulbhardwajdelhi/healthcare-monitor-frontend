const { validatePatient } = require('../models/patient');
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require('../services/patientStore');

function listPatients(req, res) {
  res.json(getAllPatients());
}

function getPatient(req, res) {
  const patientId = parseInt(req.params.id, 10);
  const patient = getPatientById(patientId);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  res.json(patient);
}

function addPatient(req, res) {
  const errors = validatePatient(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const newPatient = createPatient(req.body);
  res.status(201).json(newPatient);
}

function editPatient(req, res) {
  const patientId = parseInt(req.params.id, 10);
  const existingPatient = getPatientById(patientId);

  if (!existingPatient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const errors = validatePatient({
    name: req.body.name || existingPatient.name,
    status: req.body.status || existingPatient.status,
    vitals: req.body.vitals || existingPatient.vitals,
  });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const updatedPatient = updatePatient(patientId, req.body);
  res.json(updatedPatient);
}

function removePatient(req, res) {
  const patientId = parseInt(req.params.id, 10);
  const deletedPatient = deletePatient(patientId);

  if (!deletedPatient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  res.json(deletedPatient);
}

module.exports = {
  listPatients,
  getPatient,
  addPatient,
  editPatient,
  removePatient,
};