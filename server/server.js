const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path')

// Initialize Express
const app = express();
;

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/employee', require('./routes/employee.route'));
app.use('/api/employer', require('./routes/employer.route'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
    connectDB()
});