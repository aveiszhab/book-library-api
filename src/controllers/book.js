const { Reader, Book } = require('../models');
const {
  listAllItems,
  deleteItem,
  updateItem,
  getItemById,
  createItem
} = require('./helpers')

const createBook = (req,res) => createItem(res, 'book', req.body);

const listAllBooks = (_, res) => listAllItems(res, 'book');

const findBook = (req, res) => getItemById(res, 'book', req.params.bookId)

const updateBook = (req,res) => updateItem(res, 'book', req.params.bookId, req.body);

const deleteBook = (req, res) => deleteItem(res, 'book', req.params.bookId);

module.exports = {
    createBook,
    listAllBooks,
    findBook,
    updateBook,
    deleteBook
}