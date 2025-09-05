const router = require("express").Router();
const { updateUser, getCurrentUser } = require("../controllers/users");
const { updateUserInfo } = require("../middlewares/validation");

const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserInfo, updateUser);

module.exports = router;
