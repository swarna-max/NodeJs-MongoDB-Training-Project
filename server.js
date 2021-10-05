const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routers/userRouter");
const bookRouter = require("./routers/bookRouter");
const chalk = require('chalk');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerJson = require('./swagger.json');
const authJwt = require("./middleware/authJwt");
const PORT = process.env.PORT || 3000;


const app = express();


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb+srv://swarna:Swarna%40%241997@node-data.qasob.mongodb.net/node-data?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("MongoDB Connected successfully");
});

app.use("/user", userRouter);
app.use("/book", bookRouter);  
app.use("/swagger-api", swaggerUI.serve, swaggerUI.setup(swaggerJson));


app.listen(3000, () => {
    console.log(` ${chalk.green('Listening Port ' +PORT+ ' running success')}`);
});


