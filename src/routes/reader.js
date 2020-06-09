const express = require('express');

const router = express.Router();
const readerController = require('../controllers/reader');
const bookController = require('../controllers/book')

router
  .route('/')
  .get(readerController.getReaders)
  .post(readerController.createReader);

router
  .route('/:readerId')
  .get(readerController.getReaderById)
  .patch(readerController.updateReader)
  .delete(readerController.deleteReader);


module.exports = router;
