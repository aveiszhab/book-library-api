const { Reader, Book } =require('../models');

const createBook = (req,res) => {
  const readerId = parseInt(req.params.id,10);

  Reader.findByPk(readerId)
  .then(reader => {
    if(!reader)
      res.status(404).json({error: 'The Reader could not be found'})
    else
      Book.create(req.body)
  .then(book => book.setReader(readerId))
  .then(bookLinkedToReader => res.status(201).json(bookLinkedToReader))
  });
};

const listBooksByReader = (req, res) => {
  const readerId = parseInt(req.params.id,10);

  Reader.findByPk(readerId, {raw: true})
  .then(reader => {
    if(!reader)
      res.status(404).json({error: 'The Reader could not be found.'})
    else
      Book.findAll({where: {readerId: readerId}})
  .then(books => {
    res.status(200).json(books)    
    });
  });
};

const listAllBooks = (_, res) => {
  Book.findAll().then(books => {
      res.status(200).json(books);
  });
};

const findBook = (req, res) => {
  const bookId = parseInt(req.params.bookId, 10);
  Book.findByPk(bookId)
  .then(book => {
    if(!book)
      res.status(404).json({error: 'The book could not be found.'});
    else
      res.status(200).json(book)
  });
};

const updateBook = (req,res) => {
  const bookId = parseInt(req.params.bookId, 10);
  Book.update(req.body, {where: {id: bookId}})
  .then(([updatedBook]) => {
    if(!updatedBook)
      res.status(404).json({error: 'The book could not be found.'});
    else 
      res.status(200).json(updatedBook);
  });
};

const deleteBook = (req, res) => {
  const bookId = parseInt(req.params.bookId, 10);
  Book.destroy({where: { id : bookId}})
  .then(deletedBook =>{
    if(!deletedBook)
      res.status(404).json({error: 'The book could not be found.'});
    else
      res.status(204).json(deletedBook)
  });
};

module.exports = {
    createBook,
    listBooksByReader,
    listAllBooks,
    findBook,
    updateBook,
    deleteBook
}