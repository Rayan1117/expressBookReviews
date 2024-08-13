const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username=req.body['username']
  let password=req.body['password']
  if(!username.trim() || !password.trim()){
    return res.status(400).json({error: "Username or Password not provided"})
  }
  if(isValid(username)){
    return res.status(401).json({error: "username already exist!!"})
    
  }
  users.push({"username":username,"password":password})
    return res.status(200).json({message: "Successfully registered"});
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let bookList=books;
  return res.status(200).json({message: bookList});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let specificBook=books[req.params.isbn]
  return res.status(200).json({message: specificBook});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let bookOfAnAuthor=[];
  for (let key in books){
    if(books[key].author===req.params.author){
      bookOfAnAuthor.push(books[key])
    }
  }
  return res.status(200).json({message: bookOfAnAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let bookWithTitle='';
  for (let key in books){
    if(books[key].title===req.params.title){
      bookWithTitle=books[key];
    }
  }
  return res.status(200).json({message: bookWithTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let reviews="";
  let bookWithISBN=books[req.params.isbn]
  reviews=bookWithISBN['reviews']
  return res.status(300).json({message: reviews});
});

module.exports.general = public_users;
