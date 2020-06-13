const Sequelize = require('sequelize');
const ReaderModel = require('./reader');
const BookModel = require('./book');
const AuthorModel = require('./author');
const GenreModel = require('./genre')

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const setupDatabase = () => {
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: false
    },
  });

  const Reader = ReaderModel(sequelize, Sequelize);
  const Book = BookModel(sequelize, Sequelize);
  const Author = AuthorModel(sequelize, Sequelize);
  const Genre = GenreModel(sequelize, Sequelize);

  Book.belongsTo(Reader, {foreignKey: 'readerId'});
  Reader.hasMany(Book, {foreignKey: 'readerId'});
  Book.belongsTo(Author, {foreignKey: 'authorId'});
  Author.hasMany(Book, {foreignKey: 'authorId'});
  Book.belongsTo(Genre, {foreignKey: 'genreId'});
  Genre.hasMany(Book, {foreignKey: 'genreId'})


  sequelize.sync({ alter: true });
  return {
    Reader,
    Book,
    Author,
    Genre
  };
};

module.exports = setupDatabase();
