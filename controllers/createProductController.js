import productModel from "../models/productModel.js";
import fs from 'fs'
import slugify from "slugify";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

//configure env
dotenv.config();

//payment gateway
let gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const createProductController = async (req,res)=>{
   try {
      const {name,slug,description,price,category,quantity,shipping} = req.fields;
      const {photo} = req.files;
      
    //validation
    switch (true) {
      case !name:
        return res.status(201).send({ message: "name is required" });
      case !description:
        return res.status(201).send({ message: "description is required" });
      case !price:
        return res.status(201).send({ message: "price is required" });
      case !category:
        return res.status(201).send({ message: "category is required" });
      case !quantity:
        return res.status(201).send({ message: "quantity is required" });
        case !shipping:
          return res.status(201).send({ message: "shipping is required" });
      case photo && photo.size > 1000000:
        return res.status(201).send({ message: "photo size should be less than 1MB" });
    }

      const products = new productModel({...req.fields,slug:slugify(name)});
      if(photo){
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      await products.save();
      res.status(201).send({
        success:true,
        message:'Product Created Successfully',
        products
      })

   } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error in creating product',
        error
    })
   }
}

//get all products
export const getProductController = async (req,res)=>{
   try {
      const products = await productModel.find({})
      .populate('category')
      .select("-photo")
      .sort({createdAt:-1});

      res.status(200).send({
        success:true,
        message:"All Products",
        total : products.length,
        products,
        
      })

   } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error in getting products',
        error
    })
   }
}

//get single product
export const getSingleProductController = async (req,res)=>{
    try {
        const product = await productModel.findOne({slug:req.params.slug})
        .select("-photo")
        .populate('category');

        res.status(200).send({
            success:true,
            message:'Single Product Fetched',
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while getting single product',
            error
        })
    }
}

//get photo
export const productPhotoController = async (req,res)=>{
   try {
      const product =await productModel.findById(req.params.pid).select("photo");
      if(product.photo.data)
      {
        res.set('Content-type',product.photo.contentType);
        return res.status(200).send(product.photo.data);
      }

   } catch (error) {
     console.log(error);
     res.status(500).send({
        success:false,
        message:'Error in fetching product photo',
        error
     })
   }
}

//delete product
export const deleteProductController = async (req,res)=>{
  try {
     await productModel.findByIdAndDelete(req.params.pid).select("-photo");
     res.status(200).send({
        success:true,
        message:'product deleted successfully'
     });
  } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error while deleting product',
        error
    })
  }
}

export const updateProductController = async (req,res)=>{
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields;
      const {photo} = req.files;
      
    //validation
    switch (true) {
      case !name:
        return res.status(201).send({ message: "name is required" });
      case !description:
        return res.status(201).send({ message: "description is required" });
      case !price:
        return res.status(201).send({ message: "price is required" });
      case !category:
        return res.status(201).send({ message: "category is required" });
      case !quantity:
        return res.status(201).send({ message: "quantity is required" });
        case !shipping:
        return res.status(201).send({ message: "shipping is required" });
      case photo && photo.size > 1000000:
        return res.status(201).send({ message: "photo size should be less than 1MB" });
    }
    const products = await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true});

    if(photo){
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      await products.save();
      res.status(201).send({
        success:true,
        message:'Product Updated Successfully',
        products
      });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while updating product',
            error
        })
    }
}

//Filters
export const productsFilterController = async (req,res) => {
  try {
    const perPage = 6;
      const page = req.params.filterpage;
    const {checked,radio} = req.body;
    let args = {};
    if(checked.length)args.category = checked;
    if(radio.length)args.price = {$gte: radio[0],$lte: radio[1]}
    const products = await productModel.find(args).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:"-1"});
    res.status(200).send({
      success:true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:'Error while Filtering Products',
      error
    })
  }
}

//Home page product count
export const productCountController = async (req,res)=>{
   try {
      const total = await productModel.find({}).estimatedDocumentCount();
      res.status(200).send({
        success:true,
        total
      })
   } catch (error) {
    console.log(error);
    res.status(500).send({
     success:false,
     message:'Error in product count',
     error
    })
   }
}

//Filter Page Product Count
export const FilterCountController = async (req,res)=>{
  try {
    const {checked,radio} = req.body;
    let args = {};
    if(checked.length > 0)args.category = checked;
    if(radio.length)args.price = {$gte: radio[0],$lte: radio[1]}
    const products = await productModel.find(args);
     const total = products.length;
     res.status(200).send({
       success:true,
       total
     })
  } catch (error) {
   console.log(error);
   res.status(500).send({
    success:false,
    message:'Error in product count',
    error
   })
  }
}

//product per page
export const productListController = async (req,res)=>{
  try {
     const perPage = 6;
     const page = req.params.page ? req.params.page : 1;
     const products =await productModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1});
     res.status(200).send({
      success:true,
      products
     })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:'Error in per page control',
      error
    })
  }
}

//search product
export const searchProductController = async (req,res)=>{
   try {
     const {keyword} =req.params;
      const result = await productModel.find({
        $or:[
          {name:{$regex:keyword,$options:"i"}},
          {description:{$regex:keyword,$options:"i"}}
        ]
      }).select("-photo");
      res.json(result);
   } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:'Error in searching',
      error
    })
   }
}

//similar products
export const relatedProductController = async (req,res)=>{
  try {
    const pid = req.params.pid;
    const cid= req.params.cid;
    const products = await productModel.find({
      category:cid,
      _id:{$ne:pid}
    }).select("-photo").limit(4).populate('category');
    res.status(200).send({
      success:true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:'Error while getting related products',
      error
    })
  }
}

//filter products based on category
export const filterProductController = async (req,res)=>{
  try {
     const {cid} = req.params;
     let args={};
     args.category=cid;
     const products = await productModel.find(args).select("-photo").populate('category');
     res.status(200).send({
      success:true,
      message:'products obtained successfully',
      products
     })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:'Error in fetching products based on category',
      error
    })
  }
}

//payment gateway API
//token
export const braintreeTokenController = async (req,res)=>{
   try {
     gateway.clientToken.generate({},function(err,response){
      if(err)
      {
        res.status(500).send(err);
      }else{
        res.send(response);
      }
     })
   } catch (error) {
    console.log(error);
   }
}

//payment
export const braintreePaymentController = async (req,res)=>{
   try {
     const {cart,nonce} = req.body;

     let total = 0;
     cart.map((i) => {
      total += i.price;
     });

     let newTransaction = gateway.transaction.sale({
      amount:total,
      paymentMethodNonce:nonce,
      options:{
        submitForSettlement:true
      }
     },function(err,response){
      if(response){
         const order = new orderModel({
        products:cart,
        payment:response,
        buyer:req.user._id,
        }).save();
        res.json({ok:true})
     }else{
      res.status(500).send(err);
     }
    })

   } catch (error) {
     console.log(error)
   }
}