const router = require("express").Router();

const clothingItem = require("./clothingItems");

const userRouter = require("./users");

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(500).send({ messsage: "Router not found" });
});

router.use("/users", userRouter);

module.exports = router;
