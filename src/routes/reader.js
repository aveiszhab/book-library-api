const express = require('express');

const router = express.Router();
const readerController = require('../controllers/reader');
const bookController = require('../controllers/book')

router
  .route('/')
  .get(readerController.getReaders)
  .post(readerController.createReader);

router
  .route('/:id')
  .get(readerController.getReaderById)
  .patch(readerController.updateReader)
  .delete(readerController.deleteReader);

router
  .route('/:id/books')
  .post(bookController.createBook)
  .get(bookController.listBooksByReader);

module.exports = router;
