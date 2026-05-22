const express = require('express');
const router = express.Router();
const { validatePatient } = require('../models/patient');

// In-memory patient store (for demo)
let patients = [
  { id: 1, name: 'Alice', status: 'stable', lastChecked: new Date(), vitals: { heartRate: 72 } },
  { id: 2, name: 'Bob', status: 'monitored', lastChecked: new Date(), vitals: { heartRate: 88 } }
];

// GET all patients
router.get('/', (req, res) => {
  res.json(patients);
});

// GET single patient by ID
router.get('/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json(patient);
});

// POST new patient
router.post('/', (req, res) => {
  const errors = validatePatient(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const newPatient = {
    id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
    ...req.body,
    lastChecked: new Date()
  };
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// PUT update patient
router.put('/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  
  const errors = validatePatient({ name: req.body.name || patient.name, status: req.body.status || patient.status, vitals: req.body.vitals || patient.vitals });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  if (req.body.name) patient.name = req.body.name;
  if (req.body.status) patient.status = req.body.status;
  if (req.body.vitals) patient.vitals = req.body.vitals;
  patient.lastChecked = new Date();
  
  res.json(patient);
});

// DELETE patient
router.delete('/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === parseInt(req.params.id));
  if (index < 0) return res.status(404).json({ error: 'Patient not found' });
  
  const deleted = patients.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;
