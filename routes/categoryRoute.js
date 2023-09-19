import express from 'express'
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/createCategoryController.js';
import { requireSignin,isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes
//create category
router.post('/create-category',requireSignin,isAdmin,createCategoryController)

//update category
router.put('/update-category/:id',requireSignin,isAdmin,updateCategoryController);

//get all category
router.get('/get-category',categoryController);

//single category
router.get('/single-category/:slug',singleCategoryController);

//delete category
router.delete('/delete-category/:id',requireSignin,isAdmin,deleteCategoryController);

export default router;