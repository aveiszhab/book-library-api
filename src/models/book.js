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
        
        ISBN: {
          type: DataTypes.STRING
        }
    };

    return sequelize.define('Book',schema);
};