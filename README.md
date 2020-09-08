# MySQL Book Library API

This is an Node.js/Express RESTful API that allows user to create accounts and list books based on User's stories.

# Learning Objectives

* Interpret User Stories and use them to plan work
* Setup an Express API using SQL2, Sequelize, Mocha/Chai and Supertest for testing.
* Use advanced Sequelize schema validation, error handling and establish complex relationships between database tables
* Refactor to use helpers and make code DRY

# User stories
1)
    * As a library customer
    * So I can list and borrow books from the online library
    * I want to create an account with my name, email address and password

2)
    * As a library customer
    * So my account is more secure
    * I want my password to not be returned from the API

3)
    * As a library customer
    * So I can receive emails
    * I want to receive an error if the email address I sign up with is not valid

4)
    * As a library customer
    * So my account is secure
    * I want to receive an error if the password I sign up with is less than 8 characters long

5)
    * As a book lender
    * So people can loan out my books
    * I want to be able to create a book listing on my account with a title, author, genre and ISBN number

6)
    * As a library customer
    * So I know what I'm looking at
    * I want all book listings to have at least a title and an author

7)
    * As a library customer
    * So I can find books to borrow
    * I want to see a list of all books

8)
    * As a library customer
    * So I can find books I am interested in
    * I want to be able to search for books with a specific title, author, genre or ISBN

# Endpoints
For endpoints check the below link:

https://documenter.getpostman.com/view/11208763/TVCjwRJ7

# Deployment

https://book-library-db-api.herokuapp.com

# Development utilities used:

- The App was built using Express
- Testing: Mocha, Chai, supertest
- Packages: nodemon, dotenv, cors, mysql2, sequelize




# Set up the project locally
 * Clone the repo
 https://github.com/aveiszhab/book-library-api
 * Install the project dependencies with npm i
 * Based on the .env.example create two files on the route of your project: .env (realted to your production database) and .env.test (related to your test database).
    * DB_PASSWORD: replace *somepassword* with a password of your choosing. Make sure you use the same passord in the .env and the .env.test files
    *   DB_NAME replace *my_db_name* with a name of your choosing. Make sure you DO NOT USE the same name in the .env and the .env.test files. (e.g.: book_library and book_library_test)
* Run a docker MySQL container by using the following command:

        docker run -d -p 3307:3306 --name book_library -e MYSQL_ROOT_PASSWORD=secret mysql
* For testing run:

        npm test

* Start the server:

        npm start 

* use postman to test the routes

# Author:
Aniko Veiszhab