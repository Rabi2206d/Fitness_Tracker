import express from 'express';
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from 'path'; // Import path module
import "dotenv/config.js"
import fetchUser from '../middleware/fetchUser.js'

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Store in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use timestamp to avoid filename conflicts
  }
});

// Pass the storage configuration to multer
const upload = multer({ storage });
  

// Route 1 : Sign Up
router.post("/adduser" , upload.single('file') ,async (req , res)=>{
    const {name , email , password ,phone,specialization,experience} = req.body;
    const profile = req.file.filename;
    try {
        if(!name || !email || !password || !phone || !specialization || !experience || !profile ){
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
            name , email , password : hashedPassword ,phone,specialization,experience,file:profile
        })

        res.status(200).json({success : "User Created"});
        newUser.save();
        console.log(newUser);

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
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: userData._id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d'
        }, (err, token) => {
            if (err) {
                console.error("Error signing token: ", err);
                return res.status(500).json({ err: 'Error signing token' });
            }
            res.status(200).json({ 
                token,
                user: {
                    id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    status: userData.status,
                    profileImage: userData.file
                }
            });
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server Error', error });
    }
});


router.post("/logout", (req, res) => {
    try {
        res.status(200).json({ 
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});





export default router;