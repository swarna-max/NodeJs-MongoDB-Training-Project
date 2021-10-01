const crypto = require("crypto");


 function encryptData(password){
    const algorithm = "aes-256-cbc"; 

    // secret key generate 32 bytes of random data
    const Securitykey = crypto.randomBytes(32);
    
    // generate 16 bytes of random data
    const initVector = crypto.randomBytes(16);
     
      // the cipher function
      const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

      let encryptedData = cipher.update(password, "utf-8", "hex");

      encryptedData += cipher.final("hex");
      
      return encryptedData;

  }

  function decryptData(password){
    const algorithm = "aes-256-cbc"; 

    // secret key generate 32 bytes of random data
    const Securitykey = crypto.randomBytes(32);
    
    // generate 16 bytes of random data
    const initVector = crypto.randomBytes(16);
     

        // the decipher function
        const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

        let decryptedData = decipher.update(password, "hex", "utf-8");

        decryptedData += decipher.final("utf8");

        return decryptedData;
  }

  module.exports = {encryptData, decryptData};