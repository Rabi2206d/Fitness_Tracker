import jwt from 'jsonwebtoken'

const fetchUser = (req,res, next)=>
{
    const token = req.header('auth-token');
    if(!token)
    {
        return res.status(400).json({error : 'Please using a valid token number'})
    }
    try { 
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        req.userid = decode.user.id
        next()
    } catch (error) {
        return res.status(500).json({err : 'Internal Server error'})
        
    }
}


export default fetchUser