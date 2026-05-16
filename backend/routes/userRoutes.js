const express = require("express");

const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {

    getProfile,

    getUsers,

    followUser

} = require("../controllers/userController");



// ================= GET ALL USERS =================

router.get("/", auth, getUsers);



// ================= GET PROFILE =================

router.get("/profile/:id", auth, getProfile);



// ================= FOLLOW / UNFOLLOW =================

router.put("/follow/:id", auth, followUser);



module.exports = router;