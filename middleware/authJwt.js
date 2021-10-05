const jwt = require("jsonwebtoken");
const config = require("./config");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send({ message: "Access Token Missing" });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Invalid Token!" });
      }
      req.userId = decoded.id;
      next();
    });
  };

  module.exports = {verifyToken};