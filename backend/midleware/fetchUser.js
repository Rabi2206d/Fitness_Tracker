import jwt from "jsonwebtoken";
import "dotenv/config.js";


const fetchUser = (req , res , next) =>{
    const token = req.header("auth-token");
    if(!token){
        return res.status(400).json({error : "Inavlid token"});
    }

    try {
        const {userId} = jwt.verify(token , process.env.JWT_SECRET);
        req.userId = userId;
        console.log("fetchuser" , userId);
        next();
    } catch (error) {
        res.status(500).json({error : "Internal Server error"})
    }
}

export default fetchUser;