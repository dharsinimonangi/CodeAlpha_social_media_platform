const Post = require("../models/Post");
const Notification = require("../models/Notification");

exports.createPost = async (req,res)=>{

    try{

        const post = new Post({

            user:req.user.id,

            text:req.body.text,

            image:req.body.image

        });

        await post.save();

        const populatedPost = await Post.findById(post._id)
        .populate("user","name");

        res.json(populatedPost);

    }catch(error){

        res.status(500).json({
            message:error.message
        });
    }
};
exports.getPosts = async(req,res)=>{

    const posts = await Post.find()

    .populate("user","name")

    .populate("comments.user","name")

    .sort({createdAt:-1});

    res.json(posts);
};
exports.likePost = async(req,res)=>{

    const post = await Post.findById(req.params.id);

    if(!post.likes.includes(req.user.id)){

        post.likes.push(req.user.id);

        await post.save();

        if(post.user.toString() !== req.user.id){

            await Notification.create({

                user: post.user,

                sender: req.user.id,

                type:"like",

                message:"liked your post ❤️"

            });
        }
    }

    res.json(post);
};

exports.commentPost = async(req,res)=>{

    const post = await Post.findById(req.params.id);

    post.comments.push({

        user:req.user.id,

        text:req.body.text
    });

    await post.save();

    if(post.user.toString() !== req.user.id){

        await Notification.create({

            user: post.user,

            sender: req.user.id,

            type:"comment",

            message:"commented on your post 💬"

        });
    }

    res.json(post);
};