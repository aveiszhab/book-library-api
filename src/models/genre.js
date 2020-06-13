module.exports = (sequelize, DataTypes) => {
    const schema = {
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
            //unique: true,
            validate: {
              notNull: {
                args: true,
                msg: 'Genre is required.'
              },
              notEmpty: {
                args: true,
                msg: 'Genre is required.'
              }
            } 
        }
    };
    return sequelize.define('Genre', schema);
};