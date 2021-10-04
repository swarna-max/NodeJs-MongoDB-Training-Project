const express = require("express");
const bookModel = require("../model/bookModels");
const formidable = require("formidable");
const pathRoute = require("path");
const fs = require("fs");
const authJwt = require("../authJwt");
const { exit } = require("process");

const app = express();

app.post("/create",[authJwt.verifyToken], async (req, res) => {

    const form = new formidable.IncomingForm();

    form.maxFileSize = 50 * 1024 * 1024; // 5MB
    
    form.parse(req, async (err, fields, files) => {
        if (err) {
          console.log("Error parsing the files");
          return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
          });
        }
      
        if(!files.book||!fields.name||!fields.author){
            return res.status(400).json({message:"Fields required:book, name and author"});
 
        }

        let bookName = await bookModel.findOne({ bookName: fields.name });
        if (bookName) {
            return res.status(400).json({message: "Name of book already exist, it should be unique"});
        }
        
        const isFileValid = (file) => {
            const type = file.type.split("/").pop();
            const validTypes = ["jpg", "jpeg", "png", "pdf" , "docx", "txt" ];
            if (validTypes.indexOf(type) === -1) {
              return false;
            }
            return true;
          };

        //validate file type
         if (!isFileValid(files.book)) {
            return res.status(400).json({message: "The book file type is not a valid type"});
         }

        //move file to folder
        var filePath = files.book.path;
        var newpath = pathRoute.join('./uploads/') + files.book.name + new Date().getTime();
        fs.rename(filePath, newpath, function (err) {
            if (err) res.status(400).json({message: "File not moved to folder"});
            else console.log('File moved to folder');
        });
        
        const newBook = new bookModel({
            bookName: fields.name,
            bookPath: newpath,
            bookDescription: fields.description,
            bookAuthor: fields.author,
        });
        
        try {
            await newBook.save();
            console.log('Book created successfully');
            res.send(newBook);
        } catch (error) {
            res.status(500).send(error);
        }
        
      });
});

app.put("/update/:id", [authJwt.verifyToken], async (req, res) => {
    
        const updateBook = new bookModel({
          _id: req.params.id,
          bookName: req.body.name,
          bookDescription: req.body.description,
          bookAuthor: req.body.author,
        });

        bookModel.updateOne({_id: req.params.id}, updateBook).then(
          () => {
           res.status(201).json({message: 'Book updated successfully!'});
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
});

app.delete('/delete/:id', [authJwt.verifyToken],(req, res ) => {

    bookModel.find({_id: req.params.id}, function(err, book){
        if(!book){
           res.status(404).send({message: "Not able to delete or book id not found"})
        }
        else{
            const filePath = book[0].bookPath;

            fs.unlink(filePath, function(err) {
                bookModel.deleteOne({_id: req.params.id}).then(
                    () => {
                    res.status(200).json({
                        message: 'Book Deleted!'
                    });
                    }
                ).catch(
                    (error) => {
                    res.status(400).json({
                        error: error
                    });
                    }
                );
            });
        }

    });
});

app.get("/listBooks",[authJwt.verifyToken], async (req, res) => {

    const books = await bookModel.find({});

    try {
      res.send(books);
    } catch (error) {
      res.status(500).send(error);
    }
  });

app.get("/listBooks/:id",[authJwt.verifyToken], async (req, res) => {

     bookModel.findOne({_id: req.params.id}, function(err, book){
        if(!book){
            res.status(404).send({message: "No book found"});
         }
         else{
            res.send(book);
         }
    });
});

module.exports = app;
