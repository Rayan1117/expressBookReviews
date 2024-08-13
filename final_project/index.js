const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const secretWord='secret_word'

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth", function auth(req,res,next){
        const authHeader=req.headers['authorization']
        let token=''
        if(authHeader && authHeader.startsWith("Bearer ")){
          token =authHeader.split(" ")[1]
        }
        else{
          return res.status(500).json({message:"no token found"})
        }
      
        jwt.verify(token,secretWord,(err,decoded)=>{
          if(err){
            return res.status(500).json({message: err})
          }
          req.user=decoded.username
          next();
        });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
