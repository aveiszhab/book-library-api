const {Book, Reader, Author,Genre} = require('../models');

const get404Error = (model) => ({ error: `The ${model} could not be found.` });

const getModel = (model) => {
    const models = {
      book: Book,
      reader: Reader,
      author: Author,
      genre: Genre
    };
    return models[model];
};

const getOptions = (model) => {
  if (model === 'book') return { include: [{model: Author}, {model: Genre}], raw: true, nest: true };

  if (model === 'reader') return { include: Book, raw: true, nest: true };
  if (model === 'author') return { include: Book, raw: true, nest: true };
  if (model === 'genre') return { include: Book, raw: true, nest: true };

  return {};
};

const removePassword = (obj) => {
  if (obj.hasOwnProperty('password')) {
    delete obj.password;
  }

  return obj;
};


const listAllItems = (res, model) => {
  const Model = getModel(model);
  const options = getOptions(model);

    Model.findAll({...options})
    .then((items)=> {
      const itemWithoutPwd = items.map((item) =>
        removePassword(item)
      );
      res.status(200).json(itemWithoutPwd);
    })      
    .catch((error) => res.status(400).json({ error: error.message }));
  };

const deleteItem = (res, model, id) => {
  const Model = getModel(model);

  Model
    .destroy({ where: { id } })
    .then(deletedItem => {
      if (!deletedItem)
        res.status(404).json(get404Error(model));
      else
        res.status(204).json(deletedItem);
  })
  .catch((error) => res.status(400).json({ error: error.message }));
};

const updateItem = (res, model, id, item) => {
  const Model = getModel(model);
  
  Model
    .update(item, { where: { id } })
    .then(([update]) => {
      if (!update) 
        res.status(404).json(get404Error(model));
      else {
        Model.findByPk(id, {raw: true})
        .then((updatedItem) => {
          const itemWithoutPwd = removePassword(updatedItem)
          res.status(200).json(itemWithoutPwd);
        })
      };
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

const getItemById = (res, model, id) => {
  const Model = getModel(model);
  const options = getOptions(model);

  Model.findByPk(id, {...options})
  .then(item => {
    if (!item) 
     res.status(404).json(get404Error(model));
    else {
      const itemWithoutPwd = removePassword(item)
      res.status(200).json(itemWithoutPwd);
    };
  })
  .catch((error) => res.status(400).json({ error: error.message }));
}

const createItem = (res, model, item) => {
  const Model = getModel(model)
  
    Model
    .create(item)
    .then(itemCreated => {
      const itemWithoutPwd = removePassword(itemCreated.dataValues)
      res.status(201).json(itemWithoutPwd)
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};


  module.exports = {
      listAllItems,
      deleteItem,
      updateItem,
      getItemById,
      createItem,
      get404Error,
      getModel,
      getOptions
  }