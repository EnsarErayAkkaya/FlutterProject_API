const express = require('express');
const multer  = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const {
    getAssignmentAnswers,
    getAssignmentAnswer,
    createAssignmentAnswer,
    updateAssignmentAnswer,
    deleteAssignmentAnswer,
    checkAssignmentAnswer,
    downloadAssignmentAnswer
} = require('../controllers/assignmentAnswers');

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

router.post('/', upload.single('file'), createAssignmentAnswer);
router.put('/:id', upload.single('file'), updateAssignmentAnswer);
router.put('/checkAssignmentAnswer/:id', checkAssignmentAnswer);
router.delete('/:id', deleteAssignmentAnswer);
router.get('/:id', getAssignmentAnswer);
router.get(getAssignmentAnswers);
router.get('/download/:filename', downloadAssignmentAnswer);

module.exports = router;
