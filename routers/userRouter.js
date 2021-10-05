const express = require("express");

const router = express.Router();

const authJwt = require("../middleware/authJwt");

const userController = require("../controller/userController");

router.post('/signUp', userController.signUpUser);

router.get('/listUsers', [authJwt.verifyToken], userController.listUser);

router.post('/signIn', userController.signInUser);

router.get('/booksByUsername/:user', [authJwt.verifyToken], userController.booksByUsername);

module.exports = router;