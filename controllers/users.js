const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  CAST_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  DEFAULT__SERVER_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res
        .status(DEFAULT__SERVER_ERROR)
        .send({ message: "Finding User Failed" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email }).then((user) => {
    //Checking for required email
    // if (user.email === undefined) {
    //   return res.status(CAST_ERROR).send({ message: "Email field is empty" });
    // }
    if (user) {
      return res
        .status(CONFLICT_ERROR)
        .send({ message: "Email already being used" });
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
        // console.error(err);
        if (err.name === "ValidationError") {
          return res.status(CAST_ERROR).send({ message: "Invalid Data" });
        } else if (err.code === 11000) {
          return res
            .status(CONFLICT_ERROR)
            .send({ message: "Email Already Taken" });
        } else {
          return res
            .status(DEFAULT__SERVER_ERROR)
            .send({ message: err.message });
        }
      });
  });
};

const logInUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(CAST_ERROR)
      .send({ message: "Both Email and Password fields are necessary" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      // console.error(err);
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED_ERROR).send({ message: "Unauthorized" });
      } else {
        return res.status(DEFAULT__SERVER_ERROR).send({ message: err.message });
      }
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: "Requested Item was not found" });
      } else if (err.name === "CastError") {
        res.status(CAST_ERROR).send({ message: "Invalid Data Entered" });
      } else {
        res
          .status(DEFAULT__SERVER_ERROR)
          .send({ message: "Finding User Failed" });
      }
    });
};

const updateUser = (req, res) => {
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
        res.status(CAST_ERROR).send({ message: "Invalid Data Entered" });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: "Requested Item was not found" });
      } else {
        res.status(DEFAULT__SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  logInUser,
  updateUser,
};
