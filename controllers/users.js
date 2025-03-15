const User = require("../models/user");
const {
  CAST_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  DEFAULT__SERVER_ERROR,
} = require("../utils/errors");

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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(CAST_ERROR).send({ message: "Invalid Data" });
      } else {
        res.status(DEFAULT__SERVER_ERROR).send({ message: err.message });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
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

module.exports = { getUsers, createUser, getUser };
