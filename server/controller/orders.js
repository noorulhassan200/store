const orderModel = require("../models/orders");

class Order {
  async getAllOrders(req, res) {
    try {
      let Orders = await orderModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Orders) {
        return res.json({ Orders });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOrderByUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let Order = await orderModel
          .find({ user: uId })
          .populate("allProduct.id", "pName pImages pPrice")
          .populate("user", "name email")
          .sort({ _id: -1 });
        if (Order) {
          return res.json({ Order });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postCreateOrder(req, res) {
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
        let newOrder = new orderModel({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
        });
        let save = await newOrder.save();
        if (save) {
          return res.json({ success: "Order created successfully" });
        }
      } catch (err) {
        return res.json({ error: error });
      }
    }
  }

  async postUpdateOrder(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    }
    
    try {
      let currentOrder = await orderModel.findByIdAndUpdate(
        oId,
        {
          status: status,
          updatedAt: Date.now(),
        },
        { new: true }
      );

      if (currentOrder) {
        return res.json({ success: "Order updated successfully" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "Order update failed" });
    }
  }

  async postDeleteOrder(req, res) {
    let { oId } = req.body;
    if (!oId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteOrder = await orderModel.findByIdAndDelete(oId);
        if (deleteOrder) {
          return res.json({ success: "Order deleted successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

const ordersController = new Order();
module.exports = ordersController;
