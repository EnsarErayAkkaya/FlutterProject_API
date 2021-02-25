const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

exports.connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  const conn = mongoose.connection;

  conn.on('error', console.error.bind(console, "Error connecting to db"));
  
  conn.once('open', function () {
    console.log('here');
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    // all set!
  })

  console.log(`MongoDB Connected: ${conn.host}`);
};
exports.getGFS = () => {
  console.log('get gfs');
  return gfs;
};
