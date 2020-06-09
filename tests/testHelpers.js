const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const {
    get404Error,
    getModel
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
          expect(response.body).to.eql(newItemRecord);
          expect(response.body).to.include(item);
        }
};

const testListAllItems = async(model, path) => {
    const Model = getModel(model);
    
    const response = await request(app)
       .get(path);
    const listAllItem = await Model.findAll({raw: true})
    expect(response.status).to.equal(200);
    expect(response.body.length).to.equal(listAllItem.length);   
    expect(response.body).to.eql(listAllItem);
};

const testGetItemById = async(model, path, id) => {
    const Model = getModel(model);

    const response = await request(app)
        .get(`${path}/${id}`)
    const itemById = await Model.findByPk(id, {raw: true})
    if(!itemById) {
        expect(response.status).to.equal(404);
        expect(response.body).to.eql(get404Error(model));
    } else {
    expect(response.status).to.equal(200);
    expect(response.body.id).to.equal(itemById.id);   
    expect(response.body).to.eql(itemById);
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
    }else if (response.body.error) {
        expect(response.status).to.equal(400);
        expect(updatedItem).not.to.include(item);
    } else {
        expect(response.status).to.equal(200);
        expect(updatedItem).to.include(item);
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