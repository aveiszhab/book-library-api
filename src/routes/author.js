const express = require('express');

const router = express.Router();
const authorController = require('../controllers/author');

router
  .route('/')
  .post(authorController.createAuthor)
  .get(authorController.listAllAuthors);

router
  .route('/:authorId')
  .get(authorController.findAuthor)
  .patch(authorController.updateAuthor)
  .delete(authorController.deleteAuthor);

  module.exports = router;
