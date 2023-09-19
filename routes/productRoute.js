import express from "express";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
import { FilterCountController, braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, filterProductController, getProductController, getSingleProductController, productCountController, productListController, productPhotoController, productsFilterController, relatedProductController, searchProductController, updateProductController } from "../controllers/createProductController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
//create product
router.post('/create-product',requireSignin,isAdmin,formidable(),createProductController);

//get products
router.get('/get-product',getProductController);

//single product
router.get('/get-product/:slug',getSingleProductController);

//get photo
router.get('/product-photo/:pid',productPhotoController);

//delete product
router.delete('/:pid',requireSignin,isAdmin,deleteProductController);

//update product
router.put('/update-product/:pid',requireSignin,isAdmin,formidable(),updateProductController);

//Filter product
router.post('/product-filters/:filterpage',productsFilterController);

//count products of home page
router.get('/product-count',productCountController);

//count products of filter page
router.post('/filter-product-count',FilterCountController);

//product per page
router.post('/product-list/:page',productListController);

//search product
router.get('/search/:keyword',searchProductController);

//similar product
router.get('/related-product/:cid/:pid',relatedProductController);

//get products based on particular category
router.get('/filter-product/:cid',filterProductController);

//payments route
//get token
router.get('/braintree/token',braintreeTokenController);

//payments
router.post('/braintree/payment',requireSignin,braintreePaymentController);

export default router