const express = require('express');

const router = express.Router();
const genreController = require('../controllers/genre');

router
  .route('/')
  .post(genreController.createGenre)
  .get(genreController.listAllGenres);

router
  .route('/:genreId')
  .get(genreController.findGenre)
  .patch(genreController.updateGenre)
  .delete(genreController.deleteGenre);

module.exports = router;