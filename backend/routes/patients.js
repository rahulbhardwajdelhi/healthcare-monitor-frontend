const express = require('express');
const router = express.Router();
const {
  listPatients,
  getPatient,
  addPatient,
  editPatient,
  removePatient,
} = require('../controllers/patientsController');

// GET all patients
router.get('/', listPatients);

// GET single patient by ID
router.get('/:id', getPatient);

// POST new patient
router.post('/', addPatient);

// PUT update patient
router.put('/:id', editPatient);

// DELETE patient
router.delete('/:id', removePatient);

module.exports = router;
