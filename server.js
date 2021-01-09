const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files coming here!!!
const university = require('./routes/university');
const faculty = require('./routes/faculty');
const department = require('./routes/department');

const app = express();

// Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

// Mount routers here !!!
app.use('/api/v1/university', university);
app.use('/api/v1/faculty', faculty);
app.use('/api/v1/department', department);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});