const { expect } = require('chai');
const request = require('supertest');
const {Book, Author, Genre, Reader} =require('../src/models/index');
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
  let author;
  let genre;

  before(async () => {
    try {
      await Book.sequelize.sync();
      await Author.sequelize.sync();
      await Genre.sequelize.sync();
      await Reader.sequelize.sync();
    } catch (err) {
        console.log(err);
    }
  });

  beforeEach(async ()=> {
    await Book.destroy({ where: {} });
    await Author.destroy({ where: {} });
    await Reader.destroy({ where: {} });
    await Genre.destroy({ where: {} });

    reader = await Reader.create({
      name: 'Elizabeth Bennet',
      email: 'future_ms_darcy@gmail.com',
      password: 'Password1'
    }) 
    author = await Author.create({
      author: 'J.G. Ballard'
    })
    genre = await Genre.create({
      genre: 'Fiction'
    })
  });

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const newBook = {
            title: 'book1',
            ISBN: '978-3-16-148410-0',
            ReaderId: reader.id,
            AuthorId: author.id,
            GenreId: genre.id
        };
        await testCreateItem('book','/books', newBook);
      }); 

      it('returns a 400 if no title is provided', async () => {
        const newBook = {
            title: null,
            ISBN: '978-3-16-148410-0',
            ReaderId: reader.id,
            AuthorId: author.id,
            GenreId: genre.id
        };
        await testCreateItem('book','/books', newBook);
      });

      it('returns a 400 if empty title is provided', async () => {
        const newBook = {
            title: '',
            ISBN: '978-3-16-148410-0',
            ReaderId: reader.id,
            AuthorId: author.id,
            GenreId: genre.id
        };
        await testCreateItem('book','/books', newBook);
      });

      it('returns a 400 if no author is provided', async () => {
        const newBook = {
            title: 'book1',
            ISBN: '978-3-16-148410-0',
            ReaderId: reader.id,
            AuthorId: null,
            GenreId: genre.id
        };
        await testCreateItem('book','/books', newBook);
      });

      it('returns a 400 if incorrect author is provided', async () => {
        const newBook = {
            title: 'book1',
            ISBN: '978-3-16-148410-0',
            ReaderId: reader.id,
            AuthorId: '',
            GenreId: genre.id
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
            ISBN: '978-3-16-148410-0',
            ReaderId: reader.id,
            AuthorId: author.id,
            GenreId: genre.id
        }),
        Book.create({
            title: 'book2',
            ISBN: '978-3-16-148410-2',
            ReaderId: reader.id,
            AuthorId: author.id,
            GenreId: genre.id
        }),
        Book.create({
            title: 'book3',
            ISBN: '978-3-16-148410-3',
            ReaderId: reader.id,
            AuthorId: author.id,
            GenreId: genre.id
        }),
      ]);
    });

    describe('GET/books', () => {
      it('gets all book records', async () => {
         await testListAllItems('book', '/books')      
      });
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
          const update = {GenreId: 2};
          await testUpdateItem('book', '/books', book.id, update);
        });

        it('updates book author by id', async () => {
          const book = books[0];
          const update = {AuthorId: 2};
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
          const update = {AuthorId: null};
          await testUpdateItem('book', '/books', book.id, update);
        });
  
        it('returns a 400 if incorrect author is provided', async () => {
          const book = books[0];
          const update = {AuthorId: ''};
          await testUpdateItem('book', '/books', book.id, update);
        });
  

    }); 

    describe('DELETE /books/:bookId', () => {
        it('deletes book by Id', async () => {
            const book = books[0];
            await testDeleteItem('book', '/books', book.id);
        }); 

        it('returns a 404 if the book does not exist', async () => {
          await testDeleteItem('book', '/books', '444444444');
        });
    });
  });
});