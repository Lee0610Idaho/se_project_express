const router = require("express").Router();
const { DEFAULT__SERVER_ERROR } = require("../utils/errors");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  res
    .status(DEFAULT__SERVER_ERROR)
    .send({ messsage: "Requested resource not found" });
});

module.exports = router;
