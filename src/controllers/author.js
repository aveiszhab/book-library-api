const {Reader, Book, Author} = require('../models');
const {
    listAllItems,
    deleteItem,
    updateItem,
    getItemById,
    createItem
} = require('./helpers')

const createAuthor = (req,res) => createItem(res, 'author', req.body);

const listAllAuthors = (_, res) => listAllItems(res, 'author');

const findAuthor = (req, res) => getItemById(res, 'author', req.params.authorId)

const updateAuthor = (req,res) => updateItem(res, 'author', req.params.authorId, req.body);

const deleteAuthor = (req, res) => deleteItem(res, 'author', req.params.authorId);

module.exports = {
    createAuthor,
    listAllAuthors,
    findAuthor,
    updateAuthor,
    deleteAuthor
}