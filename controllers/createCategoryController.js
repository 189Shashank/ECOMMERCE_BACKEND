import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req,res)=>{
  try {
      const {name} =req.body;
      if(!name)
      {
        return res.status(201).send({
            message:'Name is required'
        })
      }
      const existingcategory = await categoryModel.findOne({name});
      if(existingcategory)
      {
        return res.status(200).send({
            success:true,
            message:'category already exists'
        })
      }
      const category = await new categoryModel({name,slug:slugify(name)}).save();
      res.status(201).send({
        success:true,
        message:'New Category created',
        category
      })
  } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error in Category',
        error
    })
  }
}

export const updateCategoryController = async (req,res)=>{
    try {
        const {name} = req.body;
        const {id}=req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:'category updated successfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while updating category',
            error
        })
    }
}

//get all category
export const categoryController = async (req,res)=>{
   try {
      const category = await categoryModel.find({});
      res.status(200).send({
        success:true,
        message:'All Categories List',
        category
      })
   } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error while getting all categories',
        error
    })
   }
}

export const singleCategoryController = async (req,res)=>{
   try {
    const category = await categoryModel.findOne({slug : req.params.slug});
    res.status(200).send({
        success:true,
        message:'Get Single Category Success',
        category
    })
   } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error while getting single category',
        error
    })
   }
}

export const deleteCategoryController = async (req,res)=>{
   try {
    const {id} = req.params;
      await categoryModel.findByIdAndDelete(id);
      res.status(200).send({
        success:true,
        message:'Category deleted successfully'
      })
   } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error while deleting category',
        error
    })
   }
}