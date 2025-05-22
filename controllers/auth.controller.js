const User = require('../models/user.model');
const { Penumpang } = require('../models/index.model');

const register = async (req, res) => {
  try {
    const { username, email, password, name, nomor_identitas, nomor_telepon, kewarganegaraan, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create passenger record
    const passengerName = name || username;
    const nationality = kewarganegaraan || 'Not Specified';
    
    try {
      // Create passenger record
      const newPassenger = new Penumpang({
        nama_penumpang: passengerName,
        nomor_identitas: nomor_identitas || '',
        nomor_telepon: nomor_telepon || '',
        email,
        kewarganegaraan: nationality
      });
      
      const savedPassenger = await newPassenger.save();
      console.log("Passenger created successfully:", savedPassenger._id);
      
      // Create user with reference to passenger
      const userRole = !role || role === 'passenger' ? 'passenger' : 'admin';
      const newUser = new User({
        username,
        email,
        password,
        role: userRole,
        penumpang_id: savedPassenger._id
      });
      
      const savedUser = await newUser.save();
      console.log("User created successfully:", savedUser._id);
      
      // Prepare response
      const userResponse = {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        penumpang_id: savedUser.penumpang_id
      };
      
      res.status(201).json({
        message: 'User registered successfully',
        user: userResponse
      });
    } catch (error) {
      console.error("Error during registration:", error);
      
      // Check if passenger was created but user wasn't
      const passenger = await Penumpang.findOne({ email });
      if (passenger) {
        // Clean up the created passenger to avoid orphaned records
        await Penumpang.findByIdAndDelete(passenger._id);
        console.log("Cleaned up orphaned passenger record:", passenger._id);
      }
      
      throw error;
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Include penumpang details in response
    let userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      penumpang_id: user.penumpang_id
    };

    // Get passenger details if penumpang_id exists
    if (user.penumpang_id) {
      try {
        const passengerDetails = await Penumpang.findById(user.penumpang_id);
        if (passengerDetails) {
          userData.passenger_details = passengerDetails;
        }
      } catch (err) {
        console.log("Could not fetch passenger details:", err);
      }
    }
    
    res.status(200).json({
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a function to create passenger record for users who don't have one
const createPassengerForUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, nomor_identitas, nomor_telepon, kewarganegaraan } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has a passenger ID
    if (user.penumpang_id) {
      return res.status(400).json({ 
        message: 'User already has a passenger ID',
        penumpang_id: user.penumpang_id
      });
    }

    // Create new passenger
    const passengerName = name || user.username;
    const nationality = kewarganegaraan || 'Not Specified';
    
    const newPassenger = new Penumpang({
      nama_penumpang: passengerName,
      nomor_identitas,
      nomor_telepon,
      email: user.email,
      kewarganegaraan: nationality
    });

    const savedPassenger = await newPassenger.save();

    // Update user with new passenger ID
    user.penumpang_id = savedPassenger._id;
    await user.save();

    res.status(201).json({
      message: 'Passenger record created successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        penumpang_id: user.penumpang_id
      },
      passenger: savedPassenger
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

// Migrate existing users to have passenger IDs
const migrateUsers = async (req, res) => {
  try {
    // Find all users without penumpang_id
    const users = await User.find({
      $or: [
        { penumpang_id: { $exists: false } },
        { penumpang_id: null }
      ]
    });

    const results = [];

    for (const user of users) {
      // Create passenger for this user
      const newPassenger = new Penumpang({
        nama_penumpang: user.username,
        email: user.email,
        kewarganegaraan: 'Not Specified'
      });

      const savedPassenger = await newPassenger.save();

      // Update user with passenger ID
      user.penumpang_id = savedPassenger._id;
      await user.save();

      results.push({
        username: user.username,
        penumpang_id: savedPassenger._id
      });
    }

    res.status(200).json({
      message: `Migrated ${results.length} users to have passenger IDs`,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  createPassengerForUser,
  migrateUsers
};