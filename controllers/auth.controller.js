const User = require('../models/user.model');
const { Penumpang } = require('../models/index.model');

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, name, nomor_identitas, nomor_telepon, kewarganegaraan, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    let newUser;
    
    // If registering as a passenger, create a passenger record first
    if (!role || role === 'passenger') {
      if (!name || !kewarganegaraan) {
        return res.status(400).json({ 
          message: 'Passenger registration requires name and nationality' 
        });
      }

      // Create passenger record
      const newPassenger = new Penumpang({
        nama_penumpang: name,
        nomor_identitas,
        nomor_telepon,
        email,
        kewarganegaraan
      });

      const savedPassenger = await newPassenger.save();

      // Create user linked to passenger
      newUser = new User({
        username,
        email,
        password, // Store plaintext password - not recommended for production!
        role: 'passenger',
        penumpang_id: savedPassenger._id
      });
    } else if (role === 'admin') {
      // Create admin user
      newUser = new User({
        username,
        email,
        password, // Store plaintext password - not recommended for production!
        role: 'admin'
      });
    }

    const savedUser = await newUser.save();

    // Send response with user info (without password)
    const userResponse = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role
    };

    if (savedUser.role === 'passenger') {
      userResponse.penumpang_id = savedUser.penumpang_id;
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password - simple string comparison
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Send response with user info (without password)
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        penumpang_id: user.penumpang_id
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout - simple function, no session management needed
const logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
  register,
  login,
  logout
};