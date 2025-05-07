const express = require('express');
const router = express.Router();
const {
  getAllAircraft,
  getAircraftById,
  createAircraft,
  updateAircraft,
  deleteAircraft
} = require('../controllers/aircraft.controller');

router.get('/', getAllAircraft);

router.get('/:id', getAircraftById);

router.post('/', createAircraft);

router.put('/:id', updateAircraft);

router.delete('/:id', deleteAircraft);

module.exports = router;