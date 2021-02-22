const express = require('express');
const multer  = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const {
    getAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    addFile
} = require('../controllers/assignments');

const router = express.Router();

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({storage}); 

router.post('/' , createAssignment);
router.post('/addFile', upload.single('file') , addFile);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);
router.get('/:id', getAssignment);
router.get('/', getAssignments);

module.exports = router;
