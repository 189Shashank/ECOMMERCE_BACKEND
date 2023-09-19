import { comparepassword, hashpassword } from "../helpers/authHelper.js";
import usermodel from "../models/usermodel.js";
import JWT from "jsonwebtoken";
import orderModel from '../models/orderModel.js';


export const registerController = async (req,res)=>{
  try {
     const {name,email,password,phone,address,answer} = req.body;
     //validations
     if(!name){return res.send({message:"Name is Required"})}
     if(!email){return res.send({message:"Email is Required"})}
     if(!password){return res.send({message:"Password is Required"})}
     if(!phone){return res.send({message:"Phone no is Required"})}
     if(!address){return res.send({message:"Address is Required"})}
     if(!answer){return res.send({message:"Answer is Required"})}
     //existing user
     const userexist = await usermodel.findOne({email})
     if(userexist)
     {
        return res.status(200).send({
            success:false,
            message:"Already Registered please Login"
        })
     }

     //Register User
     const hashedpassword = await hashpassword(password);
     //save
     const user = await new usermodel({name,email,phone,address,password:hashedpassword,answer}).save();
     res.status(201).send({
        success:true,
        message:`${name} Registered Successfully`,
        user
     })

  } catch (error) {
    console.log(error);
    res.status(500).send({
        success:"false",
        message:"Error in Registration",
        error
    });
  }
}

export const loginController = async (req,res)=>{
     try {
        const {email,password} = req.body;
        //validation
        if(!email || !password) 
        {
           return res.status(201).send({
            success:false,
            message:'Invalid Email or Password'
           })
        }
        const user = await usermodel.findOne({email});
        if(!user)
        {
         return res.status(201).send({
           success:false,
           message:"Email is not registered"
         })
        }
        const match = await comparepassword(password,user.password);
        if(!match)
        {
         return res.status(200).send({
            success:false,
            message:"Invalid Password"
         })
        }
        //token
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.status(200).send({
         success:true,
         message:`${user.name} Login Successfully`,
         user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role,
         },
         token,
        })
     } catch (error) {
      console.log(error);
      res.status(500).send({
         success:false,
         message:"Error in Login",
         error
      })
     }
}

//forgotPasswordController
export const forgotPasswordController= async (req,res)=>{
   try {
      const {email,answer,newPassword} = req.body;
      if(!email){
         res.status(201).send({message:"Email is required"})
      }
      if(!answer){
         res.status(201).send({message:"answer is required"})
      }
      if(!newPassword){
         res.status(201).send({message:"New Password is required"})
      }

      //validation
      const user = await usermodel.findOne({email,answer});
      if(!user)
      {
         res.status(201).send({
            success:false,
            message:"Wrong Email or Answer"
         })
      }
      const hashedPassword = await hashpassword(newPassword);
      await usermodel.findByIdAndUpdate(user._id,{password:hashedPassword});
      res.status(200).send({
         success:true,
         message:"Password Reset Successfully"
      })
   } catch (error) {
      console.log(error);
      res.status(500).send({
         success:false,
         message:'something went wrong',
         error
      })
   }
}

//testcontroller
export const testController = (req,res)=>{
   res.send("Protected Route")
}

//update profile
export const updateProfileController = async (req,res)=>{
 try {
   const {name,email,password,address,phone,uid} = req.body;
   const user = await usermodel.findById(uid);
   const hashedPassword = password 
   ? await hashpassword(password)
   : user.password
   const updatedUser = await usermodel.findByIdAndUpdate(uid,{
      name : name || user.name,
      password : hashedPassword,
      email : email || user.email,
      phone : phone || user.phone,
      address : address || user.address
   },{new:true})

   res.status(200).send({
      success:true,
      message:'Profile Updated Successfully',
      updateduser:{
          _id:updatedUser._id,
         name:updatedUser.name,
         email:updatedUser.email,
         phone:updatedUser.phone,
         address:updatedUser.address,
         role:updatedUser.role,
      }
   })
   
 } catch (error) {
   console.log(error);
   res.status(400).send({
      success:false,
      message:'Error while updating Profile',
      error
   })
 }
}

//orders
export const getOrdersController = async (req,res) =>{
   try {
      const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name").sort({createdAt:"-1"});
      res.json(orders);
   } catch (error) {
      console.log(error);
      res.status(500).send({
         success:false,
         message:'Error while getting orders',
         error
      })
   }
}

//All Orders
export const getAllOrdersController = async (req,res) =>{
   try {
      const orders = await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:"-1"});
      res.json(orders);
   } catch (error) {
      console.log(error);
      res.status(500).send({
         success:false,
         message:'Error while getting orders',
         error
      })
   }
}

//order status update -- Admin
export const orderStatusController = async (req,res)=>{
   try {
      const {orderId} = req.params
      const {changestatus} = req.body

      const orders = await orderModel.findByIdAndUpdate(orderId,{status:changestatus},{new:true})
      const order = await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:"-1"});
      res.json(order);
   } catch (error) {
      console.log(error);
      res.status(500).send({
         success:false,
         message:'Error while updating order status',
         error
      })
   }
}

//get all users
export const getAllUsersController = async (req,res)=>{
   try {
      const users= await usermodel.find({role:0}).select("-password").select("-answer");
      res.status(200).send({
         success:true,
         message:"Success in fetching users",
         users
      })
   } catch (error) {
      console.log(error);
      res.status(400).send({
         success:false,
         message:'Error in fetching users',
         error
      })
   }
}