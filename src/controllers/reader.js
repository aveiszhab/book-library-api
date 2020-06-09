const { Reader } = require('../models');
const {
  listAllItems,
  deleteItem,
  updateItem,
  getItemById,
  createItem
} = require('./helpers')

const getReaders = (_, res) => listAllItems(res, 'reader')

const createReader = (req, res) => createItem(res, 'reader', req.body)

const updateReader = (req, res) => updateItem(res, 'reader', req.params.readerId, req.body)
  
const getReaderById = (req, res) => getItemById (res, 'reader', req.params.readerId)

const deleteReader = (req, res) => deleteItem(res, 'reader', req.params.readerId)

module.exports = {
  getReaders,
  getReaderById,
  createReader,
  updateReader,
  deleteReader
}