const { Pesawat } = require('../models/index.model');

const getAllAircraft = async (req, res) => {
  try {
    const aircraft = await Pesawat.find().populate('maskapai_id');
    res.status(200).json(aircraft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAircraftById = async (req, res) => {
  try {
    const aircraft = await Pesawat.findById(req.params.id).populate('maskapai_id');
    if (!aircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }
    res.status(200).json(aircraft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAircraft = async (req, res) => {
  try {
    const newAircraft = new Pesawat(req.body);
    const savedAircraft = await newAircraft.save();
    res.status(201).json(savedAircraft);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAircraft = async (req, res) => {
  try {
    const updatedAircraft = await Pesawat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedAircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }
    
    res.status(200).json(updatedAircraft);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAircraft = async (req, res) => {
  try {
    const deletedAircraft = await Pesawat.findByIdAndDelete(req.params.id);
    
    if (!deletedAircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }
    
    res.status(200).json({ message: 'Aircraft deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAircraft,
  getAircraftById,
  createAircraft,
  updateAircraft,
  deleteAircraft
};