module.exports = (sequelize, DataTypes) => {
    const schema = {
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            //unique: true,
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
        }
    };
    return sequelize.define('Author', schema);
};