const express = require('express');
const router = express.Router();

// In-memory patient store (for demo)
let patients = [
  { id: 1, name: 'Alice', status: 'stable', lastChecked: new Date() },
  { id: 2, name: 'Bob', status: 'monitored', lastChecked: new Date() }
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
  const { name, status } = req.body;
  if (!name || !status) {
    return res.status(400).json({ error: 'Name and status required' });
  }
  const newPatient = {
    id: Math.max(...patients.map(p => p.id)) + 1,
    name,
    status,
    lastChecked: new Date()
  };
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// PUT update patient
router.put('/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  
  if (req.body.name) patient.name = req.body.name;
  if (req.body.status) patient.status = req.body.status;
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
