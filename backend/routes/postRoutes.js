const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createPost,
    getPosts,
    likePost,
    commentPost
} = require("../controllers/postController");

router.post("/", authMiddleware, createPost);

router.get("/", authMiddleware, getPosts);

router.put("/like/:id", authMiddleware, likePost);

router.put("/comment/:id", authMiddleware, commentPost);

module.exports = router;