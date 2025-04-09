const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UNAUTHORIZED_ERROR = require("../utils/errors");

module.exports = (req, res, next) => {
  // get authorization from the header
  const { authorization } = req.headers;

  // check if the header exists and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(UNAUTHORIZED_ERROR).send({ message: "Unauthorized" });
  }

  // get the token
  const token = authorization.replace("Bearer ", "");

  // verify the token
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(UNAUTHORIZED_ERROR).send({ message: "Unauthorized" });
  }

  req.user = payload;

  return next();
};
