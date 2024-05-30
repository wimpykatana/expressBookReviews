const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
        return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});

});

function getBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 5000);
    });
}

function getBooksByIsbn(isbn){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books[isbn]);
        }, 5000);
      });
}

function getBooksByAuthor(author){
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(books[author])
        }, 5000)
    })
}

function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      // Simulate async operation using setTimeout
      setTimeout(() => {
        let bookByAuthor = Object.keys(books).reduce((result, id) => {
          if (books[id].author === author) {
            result[id] = books[id];
          }
          return result;
        }, {});
        resolve(bookByAuthor);
      }, 5000);
    });
  }

function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        // Simulate async operation using setTimeout
        setTimeout(() => {
        let bookByTitle = Object.keys(books).reduce((result, id) => {
            if (books[id].title === title) {
            result[id] = books[id];
            }
            return result;
        }, {});
        resolve(bookByTitle);
        }, 5000);
    });
}

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await getBooks();
        return res.status(200).json(book);
      } catch (error) {
        return res.status(500).json({ error: 'An error occurred' });
      }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await getBooksByIsbn(isbn);
        return res.status(200).json(book);
      } catch (error) {
        return res.status(500).json({ error: 'An error occurred' });
      }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  try {
    const author = req.params.author;
    const books = await getBooksByAuthor(author);
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred' });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    try {
        const title = req.params.title;
        const books = await getBooksByTitle(title);
        return res.status(200).json(books);
      } catch (error) {
        return res.status(500).json({ error: 'An error occurred' });
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn]);
});

module.exports.general = public_users;
