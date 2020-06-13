const { expect } = require('chai');
const request = require('supertest');
const {Reader, Book} =require('../src/models/index');
const app = require('../src/app');

const {
  testCreateItem,
  testListAllItems,
  testGetItemById,
  testUpdateItem,
  testDeleteItem
} = require('./testHelpers');

describe('/books', () => {
  let reader;
  
  before(async () => {
    try {
      await Reader.sequelize.sync();
      await Book.sequelize.sync();
    } catch (err) {
        console.log(err);
    }
  });

  beforeEach(async () => {
      try{
        await Reader.destroy({where: {} });
        await Book.destroy({ where: {} });  
        reader = await Reader.create({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'password1'
        });
      } catch (err) {
        console.log(err);
      } 
  });

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const newBook = {
            title: 'book1',
            author: 'Author1',
            genre: 'fiction',
            ISBN: '978-3-16-148410-0',
            readerId: reader.id
        };
        await testCreateItem('book','/books', newBook);
      }); 

      it('returns a 400 if no title is provided', async () => {
        const newBook = {
            title: null,
            author: 'Author1',
            genre: 'fiction',
            ISBN: '978-3-16-148410-0',
            readerId: reader.id
        };
        await testCreateItem('book','/books', newBook);
      });

      it('returns a 400 if empty title is provided', async () => {
        const newBook = {
            title: '',
            author: 'Author1',
            genre: 'fiction',
            ISBN: '978-3-16-148410-0',
            readerId: reader.id
        };
        await testCreateItem('book','/books', newBook);
      });

      it('returns a 400 if no author is provided', async () => {
        const newBook = {
            title: 'book1',
            author: null,
            genre: 'fiction',
            ISBN: '978-3-16-148410-0',
            readerId: reader.id
        };
        await testCreateItem('book','/books', newBook);
      });

      it('returns a 400 if empty title is provided', async () => {
        const newBook = {
            title: 'book1',
            author: '',
            genre: 'fiction',
            ISBN: '978-3-16-148410-0',
            readerId: reader.id
        };
        await testCreateItem('book','/books', newBook);
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async ()=> {
      await Book.destroy({ where: {} });
      
      books = await Promise.all([
        Book.create({
            title: 'book1',
            author: 'Author1',
            genre: 'fiction',
            ISBN: '978-3-16-148410-0'
        }),
        Book.create({
            title: 'book2',
            author: 'Author2',
            genre: 'crime',
            ISBN: '978-3-16-148410-2',
            readerId: reader.id
        }),
        Book.create({
            title: 'book3',
            author: 'Author2',
            genre: 'science',
            ISBN: '978-3-16-148410-3'
        }),
      ]);
    });

    describe('GET/books', () => {
      it('gets all book records', async () => {
         await testListAllItems('book', '/books')      });
    });

    describe('GET /books/:bookId', () => {
        it('gets book record by id', async () => {
          const book = books[0];
          await testGetItemById('book', '/books', book.id);
        });
        it('returns a 404 if book does not exist', async () => {
          await testGetItemById('book', '/books', '444444444');
        });
    });

    describe('PATCH /books/:bookId', () => {
        it('updates book title by id', async () => {
          const book = books[0];
          const update = {title: 'book1Updated'};
          await testUpdateItem('book', '/books', book.id, update);
        });

        it('updates book genre by id', async () => {
          const book = books[0];
          const update = {genre: 'updated'};
          await testUpdateItem('book', '/books', book.id, update);
        });

        it('updates book author by id', async () => {
          const book = books[0];
          const update = {author: 'updated'};
          await testUpdateItem('book', '/books', book.id, update);
        });
                
        it('returns a 404 if book could not be found', async () => {
          const update = {genre: 'updated'};
          await testUpdateItem('book', '/books', '444444444', update);
        });

        it('returns a 400 if no title is provided', async () => {
          const book = books[0];
          const update = {title: null};
          await testUpdateItem('book', '/books', book.id, update);
        });
  
        it('returns a 400 if empty title is provided', async () => {
          const book = books[0];
          const update = {title: ''};
          await testUpdateItem('book', '/books', book.id, update);
        });

        it('returns a 400 if no author is provided', async () => {
          const book = books[0];
          const update = {author: null};
          await testUpdateItem('book', '/books', book.id, update);
        });
  
        it('returns a 400 if empty author is provided', async () => {
          const book = books[0];
          const update = {author: ''};
          await testUpdateItem('book', '/books', book.id, update);
        });
  

    }); 

    describe('DELETE /books/:bookId', () => {
        it('deletes book by Id', async () => {
            const book = books[0];
            await testDeleteItem('book', '/books', book.id);
        }); 

        it('returns a 404 if the book does not exist', async () => {
          await testDeleteItem('book', '/books', '444444444');});
    });
  });
});