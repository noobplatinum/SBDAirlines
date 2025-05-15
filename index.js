const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth.route');
const airlineRoutes = require('./routes/airline.route');
const aircraftRoutes = require('./routes/aircraft.route');
const terminalRoutes = require('./routes/terminal.route');
const gateRoutes = require('./routes/gate.route');
const passengerRoutes = require('./routes/passenger.route');
const flightRoutes = require('./routes/flight.route');
const ticketRoutes = require('./routes/ticket.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/airlines', airlineRoutes);
app.use('/api/aircraft', aircraftRoutes);
app.use('/api/terminals', terminalRoutes);
app.use('/api/gates', gateRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/', (req, res) => {
  res.send('Airport Management API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});