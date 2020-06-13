const {Reader, Book, Author, Genre} = require('../models');
const {
    listAllItems,
    deleteItem,
    updateItem,
    getItemById,
    createItem
} = require('./helpers')

const createGenre = (req,res) => createItem(res, 'genre', req.body);

const listAllGenres = (_, res) => listAllItems(res, 'genre');

const findGenre = (req, res) => getItemById(res, 'genre', req.params.genreId)

const updateGenre = (req,res) => updateItem(res, 'genre', req.params.genreId, req.body);

const deleteGenre = (req, res) => deleteItem(res, 'genre', req.params.genreId);

module.exports = {
    createGenre,
    listAllGenres,
    findGenre,
    updateGenre,
    deleteGenre
}