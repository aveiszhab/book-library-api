/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const {Author} =require('../src/models/index');
const app = require('../src/app');

const {
  testCreateItem,
  testListAllItems,
  testGetItemById,
  testUpdateItem,
  testDeleteItem
} = require('./testHelpers');

describe('/authors', () => { 
  before(async () => {
    try {
      await Author.sequelize.sync();
    } catch (err) {
        console.log(err);
    }
  });

  describe('with no records in the database', () => {
    describe('POST /authors', () => {
      it('creates a new author in the database', async () => {
        const newAuthor = {
            author: 'J.G. Ballard'
        };
        await testCreateItem('author','/authors', newAuthor);
      }); 

      it('returns a 400 if author is not unique', async () => {
        const newAuthor1 = {
          author: 'J.G. Ballard'
        };
        const newAuthor2 = {
        author: 'J.G. Ballard'
        };

        await testCreateItem('author','/authors', newAuthor1);
        await testCreateItem('author','/authors', newAuthor2);
      });

      it('returns a 400 if no author is provided', async () => {
        const newAuthor = {
            author: null
        };
        await testCreateItem('author','/authors', newAuthor);
      });

      it('returns a 400 if empty author is provided', async () => {
        const newAuthor = {
            author: ''
        };
        await testCreateItem('author','/authors', newAuthor);
      });
    });
  });

  describe('with records in the database', () => {
    let authors;

    beforeEach(async ()=> {
      await Author.destroy({ where: {} });
      
      authors = await Promise.all([
        Author.create({
            author: 'J.G. Ballard',
        }),
        Author.create({
            author: 'Frank Herbert',
        }),
        Author.create({
            author: 'Ursula K. Le Guin',
        }),
      ]);
    });

    describe('GET/authors', () => {
      it('gets all author records', async () => {
         await testListAllItems('author', '/authors')      
      });
    });

    describe('GET /authors/:authorId', () => {
        it('gets author record by id', async () => {
          const author = authors[0];
          await testGetItemById('author', '/authors', author.id);
        });

        it('returns a 404 if author does not exist', async () => {
          await testGetItemById('author', '/authors', '444444444');
        });
    });

    describe('PATCH /authors/:authorId', () => {
        it('updates author by id', async () => {
          const author = authors[0];
          const update = {author: 'Author1Updated'};
          await testUpdateItem('author', '/authors', author.id, update);
        });
                
        it('returns a 404 if author could not be found', async () => {
          const update = {author: 'updated'};
          await testUpdateItem('author', '/authors', '444444444', update);
        });

        it('returns a 400 if no author is provided', async () => {
          const author = authors[0];
          const update = {author: null};
          await testUpdateItem('author', '/authors', author.id, update);
        });
  
        it('returns a 400 if empty author is provided', async () => {
          const author = authors[0];
          const update = {author: ''};
          await testUpdateItem('author', '/authors', author.id, update);
        });
    }); 

    describe('DELETE /authors/:authorId', () => {
        it('deletes author by Id', async () => {
            const author = authors[0];
            await testDeleteItem('author', '/authors', author.id);
        }); 

        it('returns a 404 if the author does not exist', async () => {
          await testDeleteItem('author', '/authors', '444444444');
        });
    });
  });
});