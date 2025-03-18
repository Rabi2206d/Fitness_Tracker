import express from 'express';
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js"
import fetchUser from '../midleware/fetchUser.js'

const router = express.Router();


// Route 1 : Sign Up
router.post("/adduser" , async (req , res)=>{
    const {name , email , password ,phone,specialization,experience} = req.body;
    try {
        if(!name || !email || !password || !phone || !specialization || !experience ){
            return res.status(400).json({error : "All Fields Are required"});
        }
    
        if(!email.includes('@')){
            return res.status(400).json({error : "Invalid Email"});
        } 

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({error : "User already exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const newUser = new User({
            name , email , password : hashedPassword ,phone,specialization,experience
        })

        res.status(200).json({success : "User Created"});
        console.log(newUser);
        newUser.save();

    } catch (error) {
        res.status(500).json({error : "Internal Server Error"});
    }
})


// Route 2 : LogIn
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.json({ message: 'Invalid Credentials' });
        }

        res.json({ status: userData.status === 'admin' ? 'AdminData' : 'UserData' });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server Error', error });
    }
});


    // const {email , password} = req.body;

    // try {
    //     if(!email || !password){
    //         return res.status(400).json({error : "All fields are required"});
    //     }

    //     if(!email.includes('@')){
    //         return res.status(400).json({error : "Invalid Email"});
    //     }

    //     const user = await User.findOne({email});
    //     if(!user){
    //         return res.status(400).json({error : "user not found"})
    //     }

    //     const dotMatch = await bcrypt.compare(password , user.password);
    //     if(dotMatch){
    //         const token = jwt.sign({userId : user.id} , process.env.JWT_SECRET , {
    //             expiresIn : "7d"
    //         })
    //         return res.status(200).json({token});
    //     }
    //     else{
    //         res.status(400).json({error : "Invalid Credentials"});
    //     }

    // } catch (error) {
    //    res.status(500).json({error : "Internal Server Error"}) 
    // }





// Route 3 : User get
router.get("/getuser" , fetchUser , async (req ,res)=>{
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        res.status(200).json({user});
    } catch (error) {
       res.status(500).json({error : "Internal Server Error"});
    }
})






export default router;