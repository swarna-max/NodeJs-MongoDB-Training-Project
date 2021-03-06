
const userModel = require("../model/userModels");
//const crypto = require("../crypto");
var validator = require("email-validator");
const jwt = require("jsonwebtoken");
const config = require("../middleware/config");
const mongoose = require("mongoose");
const db = mongoose.connection;

exports.signUpUser = async (req, res) => {
    //validate email
    if(!validator.validate(req.body.email)){
      return res.status(400).json({message:"Enter valid email"});
    } 
   // Check if this user or email already exisits
   let userName = await userModel.findOne({ username: req.body.username });
   let userEmail = await userModel.findOne({ email: req.body.email });
   if (userName || userEmail) {
        let message = 'User name or email already exists';
        console.log(message);
        res.status(400).json({message: message});
   }
   else{
      //const encryptPassword = crypto.encryptData(req.body.password);

      const user = new userModel({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email
        });

      try {
        await user.save();
        console.log('User created successfully');
        res.send(user);
      } catch (error) {
        res.status(500).send(error);
      }
    }
}

exports.listUser = async (req, res) => {

    const sortOrder = { username: 1 };
    const users = await userModel.find({}).sort(sortOrder);

    // users.forEach(user => {
    //   return users[0].password = crypto.decryptData(user.password);
    // });
    
    try {
      res.send(users);
    } catch (error) {
      res.status(500).send(error);
    }
}

exports.signInUser =  async (req, res) => {

      userModel.findOne({
        username: req.body.username
      }) .exec((err, user) => {

      if (err) {
        res.status(500).send({ message: err });
        return;
      }
       
      if (!user) {
        return res.status(404).json({ message: "username required or user not exist!" });
      }

      if (user.password != req.body.password) {
        return res.status(401).json({ message: "password required or incorrect password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      console.log("Signin Successfully");

      res.status(200).send({
        message: "Signin Successfully",
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    });
}

exports.booksByUsername = async (req, res) => {

    db.collection('users').aggregate([
        { $lookup:
          {
            from: 'books',
            let: { username: "$username" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$bookAuthor", "$$username"] },
                      { $eq: ["$bookAuthor", req.params.user] },
                    ],
                  },
                },
              },
            ],
            as: 'bookdetails'
          }
        },
        {
          $unwind: "$bookdetails",
        },
      ]).toArray(function(err, list) {
        if (list == "") return res.status(404).send({message:"No book created by this user"});
        else res.status(200).send(list);
      });
}