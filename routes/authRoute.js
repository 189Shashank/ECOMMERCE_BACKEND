import express from "express";
import { registerController,loginController,testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController, getAllUsersController } from '../controllers/authController.js'
import { requireSignin,isAdmin } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post('/register',registerController)

//LOGIN || METHOD POST
router.post('/login',loginController)

//FORGOT PASSWORD || METHOD POST
router.post('/forgot-password',forgotPasswordController)

//test route
router.get('/test',requireSignin,isAdmin,testController);

//protected User route Auth
router.get('/user-auth',requireSignin,(req,res)=>{res.status(200).send({ok:true})})

//protected Admin route Auth
router.get('/admin-auth',requireSignin,isAdmin,(req,res)=>{res.status(200).send({ok:true})})

//update profile
router.put('/profile',requireSignin,updateProfileController)

//orders
router.get('/orders',requireSignin,getOrdersController);

// All orders
router.get('/all-orders',requireSignin,isAdmin,getAllOrdersController);

//order status update
router.put('/order-status/:orderId',requireSignin,isAdmin,orderStatusController);

//get all users
router.get('/all-users',requireSignin,isAdmin,getAllUsersController);

export default router;