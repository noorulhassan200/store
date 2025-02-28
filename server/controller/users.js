const userModel = require("../models/users");
const bcrypt = require("bcryptjs");

class User {
  async getAllUser(req, res) {
    try {
      let Users = await userModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Users) {
        return res.json({ Users });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getSingleUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let User = await userModel
          .findById(uId)
          .select("name email phoneNumber userImage updatedAt createdAt");
        if (User) {
          return res.json({ User });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postAddUser(req, res) {
    let { allProduct, user, amount, transactionId, address, phone } = req.body;
    if (
      !allProduct ||
      !user ||
      !amount ||
      !transactionId ||
      !address ||
      !phone
    ) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let newUser = new userModel({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
        });
        let save = await newUser.save();
        if (save) {
          return res.json({ success: "User created successfully" });
        }
      } catch (err) {
        return res.json({ error: error });
      }
    }
  }

  async postEditUser(req, res) {
    try {
      const { uId, name, phoneNumber } = req.body;
      
      // Validation
      if (!uId || !name || !phoneNumber) {
        return res.json({ error: "All fields are required" });
      }

      // Find and update user
      const editUser = await userModel.findByIdAndUpdate(
        uId,
        {
          name,
          phoneNumber,
          updatedAt: Date.now(),
        },
        { new: true }
      );

      if (!editUser) {
        return res.json({ error: "User not found" });
      }

      return res.json({ success: "User updated successfully" });

    } catch (err) {
      console.log(err);
      return res.json({ error: "An error occurred while updating user" });
    }
  }

  async getDeleteUser(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    }
    try {
      const result = await userModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      if (!result) {
        return res.json({ error: "User not found" });
      }
      return res.json({ success: "User updated successfully" });
    } catch (err) {
      console.log(err);
      return res.json({ error: "An error occurred while updating user" });
    }
  }

  async changePassword(req, res) {
    let { uId, oldPassword, newPassword } = req.body;
    if (!uId || !oldPassword || !newPassword) {
      return res.json({ message: "All filled must be required" });
    }
    try {
      const data = await userModel.findOne({ _id: uId });
      if (!data) {
        return res.json({
          error: "Invalid user",
        });
      }
      
      const oldPassCheck = await bcrypt.compare(oldPassword, data.password);
      if (!oldPassCheck) {
        return res.json({
          error: "Your old password is wrong!!",
        });
      }

      newPassword = bcrypt.hashSync(newPassword, 10);
      await userModel.findByIdAndUpdate(uId, {
        password: newPassword,
      });
      
      return res.json({ success: "Password updated successfully" });
    } catch (err) {
      console.log(err);
      return res.json({ error: "An error occurred while updating password" });
    }
  }
}

const ordersController = new User();
module.exports = ordersController;
