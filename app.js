
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields:["password"]});

const User = mongoose.model("User", userSchema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });
  user.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  })
});

app.post("/login", function(req,res){
  const emailId = req.body.username;
  const password = req.body.password;
  User.findOne({email: emailId},function(err,foundUser){
    if(err){
      console.log(err);
    } else if(foundUser){
      if(foundUser.password === password){
        res.render("secrets");
      }
    }
  });
});






app.listen(3000, function(){
  console.log("Server is running on Port 3000");
});
