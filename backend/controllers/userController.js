const User = require("../models/User");

const Notification = require("../models/Notification");



// ================= GET PROFILE =================

exports.getProfile = async(req,res)=>{

    try{

        const user = await User.findById(req.params.id)

        .populate("followers","name")

        .populate("following","name");

        res.json(user);

    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });
    }
};



// ================= GET USERS =================

exports.getUsers = async(req,res)=>{

    try{

        const users = await User.find()

        .select("-password");

        res.json(users);

    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });
    }
};



// ================= FOLLOW / UNFOLLOW =================

exports.followUser = async(req,res)=>{

    try{

        const currentUser =
        await User.findById(req.user.id);

        const targetUser =
        await User.findById(req.params.id);


        // USER NOT FOUND

        if(!targetUser){

            return res.status(404).json({
                message:"User not found"
            });
        }


        // CANNOT FOLLOW SELF

        if(req.user.id === req.params.id){

            return res.status(400).json({
                message:"You cannot follow yourself"
            });
        }


        // CHECK IF ALREADY FOLLOWING

        const alreadyFollowing =
        currentUser.following.some(

            id =>

            id.toString() ===
            targetUser._id.toString()
        );



        // ================= UNFOLLOW =================

        if(alreadyFollowing){

            currentUser.following =
            currentUser.following.filter(

                id =>

                id.toString() !==
                targetUser._id.toString()
            );

            targetUser.followers =
            targetUser.followers.filter(

                id =>

                id.toString() !==
                currentUser._id.toString()
            );

            await currentUser.save();

            await targetUser.save();

            return res.json({
                message:"User unfollowed"
            });
        }



        // ================= FOLLOW =================

        currentUser.following.push(targetUser._id);

        targetUser.followers.push(currentUser._id);

        await currentUser.save();

        await targetUser.save();


        // ================= NOTIFICATION =================

        await Notification.create({

            user: targetUser._id,

            sender: currentUser._id,

            type:"follow",

            message:"started following you 👥"
        });


        res.json({
            message:"User followed"
        });

    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });
    }
};