module.exports = (sequelize, DataTypes) => {
  const schema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'Email address is invalid.'
        },
        notNull: {
          args: true,
          msg: 'Email address is required.'
        }
      }
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Name is required.'
        },
        notEmpty: {
          args: true,
          msg: 'Name is required.'
        }
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: { min: 8 },
          msg: 'Password should be at least 8 characters long.'
        },
        notNull: {
          args: true,
          msg: 'Password is required.'
        },
        notEmpty: {
          args: true,
          msg: 'Name is required.'
        }
      }
    }
  };

  return sequelize.define('Reader', schema);
};
