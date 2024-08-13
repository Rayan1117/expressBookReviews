const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [ { username: "rayan", password: "user@123" } ];

const isValid = (username)=>{ 
  return users.some(user=>user.username==username);
}

const authenticatedUser = (username,password)=>{ 
  return users.some(user=>user.username===username && user.password===password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username=req.body["username"]
  const password=req.body["password"]
  if(!username || !password){
    return res.status(400).json({message: "Must provide username and password"})
  }
  if(!authenticatedUser(username,password)){
    return res.status(401).json({message: "user not found"})
  }
  const token=jwt.sign({"username":username},secretWord,{expiresIn:'1h'})
  return res.status(200).json({message: "logged in successfully",token});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review=req.query.review
  const user=req.user
  const bookID=req.params.isbn
  if(!review.trim()){
    return res.status(501).json({message:"must provide the review"})
  }
  if(!books[bookID]){
    return res.status(404).json({message:"book not found"})
  }
  books[bookID]['reviews'][user]=review
  return res.status(300).json({message: "Review added successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res, next) => {
  const isbn = req.params.isbn;

  if (!isbn) {
      return res.status(400).json({ message: "Must provide book ID" });
  }

  if (!books.hasOwnProperty(isbn)) {
      return res.status(400).json({ message: "There is no book with the given ISBN" });
  }
  req.isbn=isbn
  next();
}, (req, res) => {  
  const user = req.user;
  if (!books[req.isbn].reviews.hasOwnProperty(user)) {
      return res.status(404).json({ message: "No review by the specified user found" });
  }

  delete books[req.isbn].reviews[user];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
