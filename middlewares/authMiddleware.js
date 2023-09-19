import JWT from "jsonwebtoken";
import usermodel from "../models/usermodel.js";

//protected routes token based
// only logged in user can access the routes
export const requireSignin = async (req,res,next)=>{
   
   try {
    const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
    req.user=decode;
    console.log(req.user);
    next();
   } catch (error) {
     console.log(error);
   }
}

//admin accessing route
export const isAdmin = async (req,res,next)=>{
    try {
        const user = await usermodel.findById(req.user._id)
        if(user.role!==1)
        {
            return res.status(201).send({
                success:false,
                message:"Unauthorized Access",
            });
        }
        else
        next();
    } catch (error) {
        console.log(error);
    }
}


