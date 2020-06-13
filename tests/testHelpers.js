const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const {
    get404Error,
    getModel, 
    getOptions
} = require('../src/controllers/helpers');



const testCreateItem  = async(model, path, item) => {
    const Model = getModel(model);
    
    const response = await request(app)
        .post(path)
        .send(item);
    
    const newItemRecord = await Model.findByPk(response.body.id, {raw: true});
        if(!newItemRecord) {
          expect(response.status).to.equal(400);
          expect(newItemRecord).to.equal(null);
        } else {
          expect(response.status).to.equal(201);            
          expect(newItemRecord).to.include(response.body);
          expect(newItemRecord).to.include(item);
          expect(response.body).not.to.has.property('password');
        }
};

const testListAllItems = async(model, path) => {
    const Model = getModel(model);
    const options = getOptions(model);
    
    const response = await request(app)
       .get(path);
    const listAllItems = await Model.findAll({...options})

    expect(response.status).to.equal(200);
    expect(response.body.length).to.equal(listAllItems.length);   

    listAllItems.forEach((obj) => {
        const expected = response.body.find((a) => a.id === obj.id);
        if (obj.hasOwnProperty('password')) {
            expect(obj).to.deep.includes(expected);
        } else {
            expect(obj).to.eql(expected);
        }
    });
};

const testGetItemById = async(model, path, id) => {
    const Model = getModel(model);
    const options = getOptions(model);

    const response = await request(app)
        .get(`${path}/${id}`)
    const itemById = await Model.findByPk(id, {...options})
    if(!itemById) {
        expect(response.status).to.equal(404);
        expect(response.body).to.eql(get404Error(model));
    } else {
    expect(response.status).to.equal(200);
    expect(response.body.id).to.equal(itemById.id);   
    expect(itemById).to.deep.includes(response.body);
    expect(response.body).not.to.has.property('password')
    };
};

const testUpdateItem = async(model, path, id, item) => {
    const Model = getModel(model);

    const response = await request(app)
        .patch(`${path}/${id}`)
        .send(item)
    
    const updatedItem = await Model.findByPk(id, {raw: true});
    
    if(!updatedItem) {
        expect(response.status).to.equal(404);
        expect(response.body).to.eql(get404Error(model));
    } else if (response.body.error) {
        expect(response.status).to.equal(400);
        expect(updatedItem).not.to.include(item);
    } else {
        expect(response.status).to.equal(200);
        expect(updatedItem).to.include(item);
        expect(updatedItem).to.include(response.body);
        expect(response.body).not.to.has.property('password');
    };
};

const testDeleteItem = async(model, path, id) => {
    const Model = getModel(model);
    
    const itemToDelete = await Model.findByPk(id, { raw: true });

    const response = await request(app)
    .delete(`${path}/${id}`)
    
    const deletedItem = await Model.findByPk(id, { raw: true });
   
    if (!itemToDelete) {
        expect(response.status).to.equal(404);
        expect(response.body).to.eql(get404Error(model));
    } else {
        expect(response.status).to.equal(204);
        expect(deletedItem).to.equal(null);
    }
    
};

module.exports = {
    testCreateItem,
    testListAllItems,
    testGetItemById,
    testUpdateItem,
    testDeleteItem
}