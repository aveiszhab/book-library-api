const express = require('express');

const router = express.Router();
const bookController = require('../controllers/book');

router
  .route('/')
  .get(bookController.listAllBooks);

router
  .route('/:bookId')
  .get(bookController.findBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;