module.exports = (sequelize, DataTypes) => {
    const schema = {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              args: true,
              msg: 'Title is required.'
            },
            notEmpty: {
              args: true,
              msg: 'Title is required.'
            }
          }
        },
        author: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              args: true,
              msg: 'Author is required.'
            },
            notEmpty: {
              args: true,
              msg: 'Author is required.'
            }
          }
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