const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
// router.post("/", () => console.log("POST users"));
router.post("/", createUser);

module.exports = router;
