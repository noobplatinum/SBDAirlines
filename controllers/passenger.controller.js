const { Penumpang } = require('../models/index.model');

const getAllPassengers = async (req, res) => {
  try {
    const passengers = await Penumpang.find();
    res.status(200).json(passengers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPassengerById = async (req, res) => {
  try {
    const passenger = await Penumpang.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.status(200).json(passenger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPassenger = async (req, res) => {
  try {
    const newPassenger = new Penumpang(req.body);
    const savedPassenger = await newPassenger.save();
    res.status(201).json(savedPassenger);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePassenger = async (req, res) => {
  try {
    const updatedPassenger = await Penumpang.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedPassenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    
    res.status(200).json(updatedPassenger);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePassenger = async (req, res) => {
  try {
    const deletedPassenger = await Penumpang.findByIdAndDelete(req.params.id);
    
    if (!deletedPassenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    
    res.status(200).json({ message: 'Passenger deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger
};