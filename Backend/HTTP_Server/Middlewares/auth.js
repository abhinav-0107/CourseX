const jwt = require("jsonwebtoken");

// Separate secrets for Admin and User.
const adminSecret = "S3cr3T";
const userSecret = "Sup3rS3cr3T";

// Middleware for authenticating Admin's Jwt
function authenticateAdminJwt(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, adminSecret, (err, admin) => {
    if (err) throw err;
    req.admin = admin;
    next();
  });
}

// Middleware for authenticating User's Jwt
function authenticateUserJwt(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, userSecret, (err, user) => {
    if (err) throw err;
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateAdminJwt,
  authenticateUserJwt,
  adminSecret,
  userSecret,
};
