const { toTitleCase } = require("../config/function");
const categoryModel = require("../models/categories");
const fs = require("fs");

class Category {
  async getAllCategory(req, res) {
    try {
      let Categories = await categoryModel.find({}).sort({ _id: -1 });
      if (Categories) {
        return res.json({ Categories });
      } else {
        return res.json({ Categories: [] });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "Problem in getting categories" });
    }
  }

  async postAddCategory(req, res) {
    let { cName, cDescription, cStatus } = req.body;
    let cImage = req.file.filename;
    const filePath = `../server/public/uploads/categories/${cImage}`;

    if (!cName || !cDescription || !cStatus || !cImage) {
      try {
        await fs.promises.unlink(filePath);
        return res.json({ error: "All fields must be required" });
      } catch (err) {
        console.log(err);
        return res.json({ error: "Error in file deletion" });
      }
    }

    try {
      cName = toTitleCase(cName);
      const checkCategoryExists = await categoryModel.findOne({ cName: cName });
      
      if (checkCategoryExists) {
        await fs.promises.unlink(filePath);
        return res.json({ error: "Category already exists" });
      }

      const newCategory = new categoryModel({
        cName,
        cDescription,
        cStatus,
        cImage,
      });

      await newCategory.save();
      return res.json({ success: "Category created successfully" });

    } catch (err) {
      console.log(err);
      return res.json({ error: "Unable to create category" });
    }
  }

  async postEditCategory(req, res) {
    let { cId, cDescription, cStatus } = req.body;
    if (!cId || !cDescription || !cStatus) {
      return res.json({ error: "All fields must be required" });
    }
    try {
      let edit = await categoryModel.findByIdAndUpdate(
        cId,
        {
          cDescription,
          cStatus,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      
      if (edit) {
        return res.json({ success: "Category edited successfully" });
      }
      return res.json({ error: "Category not found" });
    } catch (err) {
      console.log(err);
      return res.json({ error: "Unable to edit category" });
    }
  }

  async getDeleteCategory(req, res) {
    let { cId } = req.body;
    if (!cId) {
      return res.json({ error: "Category ID is required" });
    }
    
    try {
      const deletedCategoryFile = await categoryModel.findById(cId);
      if (!deletedCategoryFile) {
        return res.json({ error: "Category not found" });
      }

      const filePath = `../server/public/uploads/categories/${deletedCategoryFile.cImage}`;
      const deleteCategory = await categoryModel.findByIdAndDelete(cId);
      
      if (deleteCategory) {
        try {
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.log("Error deleting image file:", err);
        }
        return res.json({ success: "Category deleted successfully" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "Unable to delete category" });
    }
  }
}

const categoryController = new Category();
module.exports = categoryController;
