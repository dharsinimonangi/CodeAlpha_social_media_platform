const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");



// ================= REGISTER =================

exports.register = async (req, res) => {

    try{

        const { name, email, password } = req.body;


        // CHECK USER EXISTS

        const existingUser = await User.findOne({ email });

        if(existingUser){

            return res.status(400).json({
                message: "User already exists"
            });
        }


        // HASH PASSWORD

        const hashedPassword =
        await bcrypt.hash(password, 10);


        // CREATE USER

        const user = new User({

            name,

            email,

            password: hashedPassword
        });


        await user.save();


        res.status(201).json({
            message: "Registration successful"
        });

    }catch(error){

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};



// ================= LOGIN =================

exports.login = async (req, res) => {

    try{

        const { email, password } = req.body;


        // CHECK USER

        const user = await User.findOne({ email });

        if(!user){

            return res.status(400).json({
                message: "User not found"
            });
        }


        // CHECK PASSWORD

        const isMatch =
        await bcrypt.compare(password, user.password);

        if(!isMatch){

            return res.status(400).json({
                message: "Invalid password"
            });
        }


        // CREATE TOKEN

        const token = jwt.sign(

            {
                id: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }
        );


        // SEND RESPONSE

        res.json({

            token,

            user: {

                _id: user._id,

                name: user.name,

                email: user.email
            }
        });

    }catch(error){

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};