const ClothingItem = require("../models/clothingItem");
const {
  CAST_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  DEFAULT__SERVER_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(CAST_ERROR).send({ message: "Invalid Data" });
      } else {
        res
          .status(DEFAULT__SERVER_ERROR)
          .send({ message: "Error: cannot create clothing item" });
      }
      f;
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      res.status(DEFAULT__SERVER_ERROR).send({ message: "Get Items Failed" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: "Deleted Clothing Item" }))
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
          .send({ message: "Delete Item Failed" });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: "Item to be liked was not found" });
      } else if (err.name === "CastError") {
        res.status(CAST_ERROR).send({ message: "Invalid Data Entered" });
      } else {
        res
          .status(DEFAULT__SERVER_ERROR)
          .send({ message: "Delete Item Failed" });
      }
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: "Item to be liked was not found" });
      } else if (err.name === "CastError") {
        res.status(CAST_ERROR).send({ message: "Invalid Data Entered" });
      } else {
        res
          .status(DEFAULT__SERVER_ERROR)
          .send({ message: "Delete Item Failed" });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
