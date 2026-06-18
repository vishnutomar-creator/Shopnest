const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers } = require("../controllers/AuthControllers");
const { protect } = require("../middleware/AuthMiddleware");
const { admin } = require("../middleware/AdminMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers); // protect and admin are middleware where protect check whetehr user is properly login or not

module.exports = router;