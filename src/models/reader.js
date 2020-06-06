module.exports = (sequelize, DataTypes) => {
  const schema = {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRINGgit
  };

  return sequelize.define('Reader', schema);
};
