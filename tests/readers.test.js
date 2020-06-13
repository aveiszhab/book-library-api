/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');

const {
  testCreateItem,
  testListAllItems,
  testGetItemById,
  testUpdateItem,
  testDeleteItem
} = require('./testHelpers');

describe('/readers', () => {
  before(async () => {
    try {
      await Reader.sequelize.sync();
    } catch (err) {
        console.log(err);
    }
  });

  describe('with no records in the database', () => {
    describe('POST /readers', () => {
      it('creates a new reader in the database', async () => {
        const newReader = {
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'password1'
        };
        await testCreateItem('reader','/readers', newReader);
      });

      it('returns a 400 if no name is provided', async () => {
        const newReader = {
          name: null,
          email: 'future_ms_darcy@gmail.com',
          password: 'password1'
        };
        await testCreateItem('reader','/readers', newReader);
      });

      it('returns a 400 if empty name is provided', async () => {
        const newReader = {
          name: '',
          email: 'future_ms_darcy@gmail.com',
          password: 'password1'
        };
        await testCreateItem('reader','/readers', newReader);
      });

      it('returns a 400 if no email is provided', async () => {
        const newReader = {
          name: 'Elizabeth Bennet',
          email: null,
          password: 'password1'
        };
        await testCreateItem('reader','/readers', newReader);
      });

      it('returns a 400 if invalid email is provided', async () => {
        const newReader = {
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcygmail.com',
          password: 'password1'
        };
        await testCreateItem('reader','/readers', newReader);
      });

      it('returns a 400 if no password is provided', async () => {
        const newReader = {
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: null
        };
        await testCreateItem('reader','/readers', newReader);
      });

      it('returns a 400 if invalid password is provided', async () => {
        const newReader = {
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'passwd'
        };
        await testCreateItem('reader','/readers', newReader);
      });
    });
  });

  describe('with records in the database', () => {
    let readers;

    beforeEach(async () => {
      await Reader.destroy({ where: {} });

      readers = await Promise.all([
        Reader.create({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'password1'
        }),
        Reader.create({ 
          name: 'Arya Stark',
          email: 'vmorgul@me.com',
          password: 'password2'
        }),
        Reader.create({
          name: 'Lyra Belacqua',
          email: 'darknorth123@msn.org',
          password: 'password1'
        }),
      ]);
    });

    describe('GET /readers', () => {
      it('gets all readers records', async () => {
        await testListAllItems('reader', '/readers');
      });
    });

    describe('GET /readers/:readerId', () => {
      it('gets readers record by id', async () => {
        const reader = readers[0];
        await testGetItemById('reader', '/readers', reader.id);
      });

      it('returns a 404 if the reader does not exist', async () => {
        await testGetItemById('reader', '/readers', '44444444');
      });
    });

    describe('PATCH /readers/:readerId', () => {
      it('updates readers email by id', async () => {
        const reader = readers[0];
        const update = { email: 'miss_e_bennet@gmail.com' };
        await testUpdateItem('reader', '/readers', reader.id, update);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const update = { email: 'miss_e_bennet@gmail.com' };     
        await testUpdateItem('reader', '/readers', '44444444', update);
      });

      it('returns a 400 if no name is provided', async () => {
        const reader = readers[0];
        const update = { name: null };        
        await testUpdateItem('reader', '/readers', reader.id, update);
      });

      it('returns a 400 if empty name is provided', async () => {
        const reader = readers[0];
        const update = { name: "" };        
        await testUpdateItem('reader', '/readers', reader.id, update);
      });

      it('returns a 400 if no email is provided', async () => {
        const reader = readers[0];
        const update = { email: null };        
        await testUpdateItem('reader', '/readers', reader.id, update);
      });

      it('returns a 400 if invalid email is provided', async () => {
        const reader = readers[0];
        const update = { email: 'kafhakjshdf' };        
        await testUpdateItem('reader', '/readers', reader.id, update);
      });

      it('returns a 400 if no password is provided', async () => {
        const reader = readers[0];
        const update = { password: null };        
        await testUpdateItem('reader', '/readers', reader.id, update);
      });

      it('returns a 400 if invalid password is provided', async () => {
        const reader = readers[0];
        const update = { password: '\dfk' };        
        await testUpdateItem('reader', '/readers', reader.id, update);
      });
    });

    describe('DELETE /readers/:readerId', () => {
      it('deletes reader record by id', async () => {
        const reader = readers[0];
        await testDeleteItem('reader', '/readers', reader.id);
      });

      it('returns a 404 if the reader does not exist', async () => {
        await testDeleteItem('reader', '/readers', '44444444444');
      });
    });
  });
});
