const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
// const {
//   CAST_ERROR,
//   DOCUMENT_NOT_FOUND_ERROR,
//   DEFAULT__SERVER_ERROR,
//   CONFLICT_ERROR,
//   UNAUTHORIZED_ERROR,
// } = require("../utils/errors");

const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-error");

const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new BadRequestError("Email already being used.");
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({
            name,
            avatar,
            email,
            password: hash,
          })
        )
        .then((newUser) =>
          res.status(201).send({
            _id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            avatar: newUser.avatar,
          })
        )
        .catch((err) => {
          if (err.name === "ValidationError") {
            next(new BadRequestError("Invalid Data"));
          }
          if (err.code === 11000) {
            next(new ConflictError("Email already exists."));
          }
          next(err);
        });
    })
    .catch(() => {
      res
        .status(DEFAULT__SERVER_ERROR)
        .send({ message: "Finding User Failed" });
    });
};

const logInUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Both Email and Password fields are necessary");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("email or password incorrect"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("Requested Item was not found");
      } else if (err.name === "CastError") {
        throw new BadRequestError("Invalid Data Entered");
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Invalid Data Entered");
      } else if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("Requested User not found");
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  logInUser,
  updateUser,
};
