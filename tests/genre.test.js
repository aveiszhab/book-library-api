/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const {Genre} =require('../src/models/index');
const app = require('../src/app');

const {
  testCreateItem,
  testListAllItems,
  testGetItemById,
  testUpdateItem,
  testDeleteItem
} = require('./testHelpers');

describe('/genres', () => { 
  before(async () => {
    try {
      await Genre.sequelize.sync();
    } catch (err) {
        console.log(err);
    }
  });

  describe('with no records in the database', () => {
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        const newGenre = {
            genre: 'Science Fiction'
        };
        await testCreateItem('genre','/genres', newGenre);
      }); 

      it('returns a 400 if no genre is provided', async () => {
        const newGenre = {
            genre: null
        };
        await testCreateItem('genre','/genres', newGenre);
      });

      it('returns a 400 if empty genre is provided', async () => {
        const newGenre = {
            genre: ''
        };
        await testCreateItem('genre','/genres', newGenre);
      });

      it('returns a 400 if genre is not unique', async () => {
        const newGenre1 = {
          author: 'J.G. Ballard'
        };
        const newGenre2 = {
        author: 'J.G. Ballard'
        };

        await testCreateItem('genre','/genres', newGenre1);
        await testCreateItem('genre','/genres', newGenre2);
      });
    });
  });

  describe('with records in the database', () => {
    let genres;

    beforeEach(async ()=> {
      await Genre.destroy({ where: {} });
      
      genres = await Promise.all([
        Genre.create({
            genre: 'Science Fiction',
        }),
        Genre.create({
            genre: 'Fantasy',
        }),
        Genre.create({
            genre: 'Crime',
        }),
      ]);
    });

    describe('GET/genres', () => {
      it('gets all genre records', async () => {
         await testListAllItems('genre', '/genres')      
      });
    });

    describe('GET /genres/:genreId', () => {
        it('gets genre record by id', async () => {
          const genre = genres[0];
          await testGetItemById('genre', '/genres', genre.id);
        });

        it('returns a 404 if genre does not exist', async () => {
          await testGetItemById('genre', '/genres', '444444444');
        });
    });

    describe('PATCH /genres/:genreId', () => {
        it('updates genre by id', async () => {
          const genre = genres[0];
          const update = {genre: 'Genre1Updated'};
          await testUpdateItem('genre', '/genres', genre.id, update);
        });
                
        it('returns a 404 if genre could not be found', async () => {
          const update = {genre: 'updated'};
          await testUpdateItem('genre', '/genres', '444444444', update);
        });

        it('returns a 400 if no genre is provided', async () => {
          const genre = genres[0];
          const update = {genre: null};
          await testUpdateItem('genre', '/genres', genre.id, update);
        });
  
        it('returns a 400 if empty genre is provided', async () => {
          const genre = genres[0];
          const update = {genre: ''};
          await testUpdateItem('genre', '/genres', genre.id, update);
        });
    }); 

    describe('DELETE /genres/:genreId', () => {
        it('deletes genre by Id', async () => {
            const genre = genres[0];
            await testDeleteItem('genre', '/genres', genre.id);
        }); 

        it('returns a 404 if the genre does not exist', async () => {
          await testDeleteItem('genre', '/genres', '444444444');
        });
    });
  });
});