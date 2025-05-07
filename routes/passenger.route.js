const express = require('express');
const router = express.Router();
const {
  getAllPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger
} = require('../controllers/passenger.controller');

router.get('/', getAllPassengers);

router.get('/:id', getPassengerById);

router.post('/', createPassenger);

router.put('/:id', updatePassenger);

router.delete('/:id', deletePassenger);

module.exports = router;