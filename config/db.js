const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  const conn = mongoose.connection;

  conn.on('error', console.error.bind(console, "Error connecting to db"));

  let gfs;

  conn.then('open', function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    // all set!
  })

  console.log(`MongoDB Connected: ${conn.host}`);
  return gfs;
};

module.exports = connectDB;
