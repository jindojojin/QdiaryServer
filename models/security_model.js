var crypto = require("crypto");
var jwt = require("jsonwebtoken");
const jwtsecure = require("../controllers/key").jsecure;

var secure = {
  createSalt: function() {
    return crypto.randomBytes(10).toString("hex");
  },
  encrypt: function(str, salt) {
    return crypto
      .createHash("md5")
      .update(str + salt)
      .digest("hex");
  },
  compare: function(str, hash, salt) {
    return hash == this.encrypt(str, salt);
  },
  createUserToken: function(user) {
    return jwt.sign(user, jwtsecure, { expiresIn: 86400 });
  },
  verifyUserToken: function(token) {
    try {
      return jwt.verify(token, jwtsecure);
    } catch (error) {
      return null;
    }
  }
};
module.exports = secure;