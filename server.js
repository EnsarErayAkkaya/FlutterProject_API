const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files coming here!!!
//const test = require('./routes/test');
const subject = require('./routes/subject');
const teacher = require('./routes/teacher');
const student = require('./routes/student');
const connection = require('./routes/connection');
const assignment = require('./routes/assignment');
const assignmentAnswer = require('./routes/assignmentAnswer');


const app = express();

// Body parser
app.use(express.json());

// Mount routers here !!!
//app.use('/api/v1/TEST', TEST);
app.use('/api/v1/subjects', subject);
app.use('/api/v1/teachers', teacher);
app.use('/api/v1/students', student);
app.use('/api/v1/connections', connection);
app.use('/api/v1/assignments', assignment);
app.use('/api/v1/assignmentAnswers', assignmentAnswer);


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