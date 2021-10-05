const express = require("express");

const router = express.Router();

const bookController = require("../controller/bookController");

const authJwt = require("../middleware/authJwt");

router.post('/create',[authJwt.verifyToken],bookController.addBook);

router.put('/update/:id',[authJwt.verifyToken],bookController.updateBook);

router.delete('/delete/:id',[authJwt.verifyToken],bookController.deleteBook);

router.get('/listBooks',[authJwt.verifyToken],bookController.listBook);

router.get('/listBooks/:id',[authJwt.verifyToken],bookController.listBookById);

module.exports = router;
