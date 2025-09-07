const router = require("express").Router();
const NotFoundError = require("../errors/not-found-error");
const { createUser, logInUser } = require("../controllers/users");
const {
  validateUserInfo,
  authenticateUser,
} = require("../middlewares/validation");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.post("/signin", authenticateUser, logInUser);
router.post("/signup", validateUserInfo, createUser);

router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use((next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
