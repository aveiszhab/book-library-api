module.exports = (sequelize, DataTypes) => {
    const schema = {
        title: {
          type: DataTypes.STRING,
          unique: true
        },
        author: {
          type: DataTypes.STRING,
          unique: true
        },
        genre: {
          type: DataTypes.STRING
        },
        ISBN: {
          type: DataTypes.STRING
        }
    };

    return sequelize.define('Book',schema);
};