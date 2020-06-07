const { expect } = require('chai');
const request = require('supertest');
const {Reader, Book} =require('../src/models/index');
const app = require('../src/app');

describe('/books', () => {
  let reader
  
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
    describe('POST /readers/:readerId/book', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app)
        .post(`/readers/${reader.id}/books`)
        .send({
            title: 'book1',
            author: 'Author1',
            genre: 'fiction',
            ISBN: '978-3-16-148410-0'
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('book1');
        expect(response.body.author).to.equal('Author1');
        expect(response.body.genre).to.equal('fiction');
        expect(response.body.ISBN).to.equal('978-3-16-148410-0');
        expect(response.body.title).to.equal(newBookRecord.title);
        expect(response.body.author).to.equal(newBookRecord.author);
        expect(response.body.genre).to.equal(newBookRecord.genre);
        expect(response.body.ISBN).to.equal(newBookRecord.ISBN);
      }); 
      it('returns a 404 and does not create book if the Reader does not exist', async () => {
        const response = await request(app)
        .post('/readers/444444/books')
        .send({
            title: 'book1',
            author: 'Author1',
            genre: 'fiction',
            ISBN: '978-3-16-148410-0'
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
        });

        expect(response.status).to.equal(404);
        expect(newBookRecord).to.equal(null);
        expect(response.body.error).to.equal('The Reader could not be found')
      });  
    });
     
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async ()=> {
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
            ISBN: '978-3-16-148410-2'
        }),
        Book.create({
            title: 'book3',
            author: 'Author2',
            genre: 'science',
            ISBN: '978-3-16-148410-3'
        }),
      ]);
      setReadersRecord = books.map(bookLinkedToReader => 
        bookLinkedToReader.setReader(reader));

        await Promise.all(setReadersRecord)
    });

    describe('GET /readers/:readerId/books', () => {
      it('gets a list of books by reader id', async () => {
          const response = await request(app)
          .get(`/readers/${reader.id}/books`);

          expect(response.status).to.equal(200);
          expect(response.body.length).to.equal(3);

          response.body.forEach((book) => {
            const expected = books.find((a) => a.id === book.id);
                     
            expect(book.title).to.equal(expected.title);
            expect(book.author).to.equal(expected.author);
            expect(book.genre).to.equal(expected.genre);
            expect(book.ISBN).to.equal(expected.ISBN);
            expect(book.readerId).to.equal(expected.readerId);
          });
      });
      it('it returns a 404 if the reader does not exist', async () => {
          const response = await request(app)
          .get('/readers/44444/books');

          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The Reader could not be found.')
      });
    });

    describe('GET/books', () => {
      it('gets all book records', async () => {
          const response = await request(app)
          .get('/books');

          expect(response.status).to.equal(200);
          expect(response.body.length).to.equal(3);

          response.body.forEach((book) => {
            const expected = books.find((a) => a.id === book.id);

            expect(book.title).to.equal(expected.title);
            expect(book.author).to.equal(expected.author);
            expect(book.genre).to.equal(expected.genre);
            expect(book.ISBN).to.equal(expected.ISBN);
            expect(book.readerId).to.equal(expected.readerId);
          });
      });
    });

    describe('GET /books/:bookId', () => {
        it('gets book record by id', async () => {
            const book = books[0];
            const response = await request(app)
            .get(`/books/${book.id}`)

            expect(response.status).to.equal(200);
            expect(response.body.title).to.equal(book.title);
            expect(response.body.author).to.equal(book.author);
            expect(response.body.genre).to.equal(book.genre);
            expect(response.body.ISBN).to.equal(book.ISBN);
            expect(response.body.readerId).to.equal(book.readerId);
        });
        it('returns a 404 if book does not exist', async () => {
            const response = await request(app)
            .get('/books/44444')

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The book could not be found.');
        });
    });

    describe('PATCH /books/:bookId', () => {
        it('updates book title by id', async () => {
          const book = books[0];

          const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({title: 'book1Updated'})

          expect(response.status).to.equal(200);

          const updatedBook = await Book.findByPk(book.id);
          expect('book1Updated').to.equal(updatedBook.title);
        });

        it('updates book genre by id', async () => {
            const book = books[0];
  
            const response = await request(app)
            .patch(`/books/${book.id}`)
            .send({genre: 'updated'})
  
            expect(response.status).to.equal(200);
  
            const updatedBook = await Book.findByPk(book.id);
            expect('updated').to.equal(updatedBook.genre);
          });

          it('updates book author by id', async () => {
            const book = books[0];
  
            const response = await request(app)
            .patch(`/books/${book.id}`)
            .send({author: 'updated'})
  
            expect(response.status).to.equal(200);
  
            const updatedBook = await Book.findByPk(book.id);
            expect('updated').to.equal(updatedBook.author);
          });
        
        
        it('returns a 404 if book could not be found', async () => {
          const response = await request(app)
          .patch('/books/44444')
          .send({title: 'book1Updated'})

          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The book could not be found.')
        });
    }); 

    describe('DELETE /books/:bookId', () => {
        it('deletes book by Id', async () => {
            const book = books[0];

            const response = await request(app)
            .delete(`/books/${book.id}`)
        
            expect(response.status).to.equal(204);
            
            const deletedBook = await Book.findByPk(book.id);
            expect(deletedBook).to.equal(null);
        }); 

        it('deletes book by Id', async () => {
            const book = books[0];

            const response = await request(app)
            .delete(`/books/44444`)

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The book could not be found.');
        });
    });


  });
});