const express = require("express");
const router = new express.Router();
const Order = require("../models/myorder");
const Cart = require("../models/Cart");




router.post("/order", async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.post("/order/add", async (req, res) => {
  const { userId, name, phone, gTotal, quantity,cartId } = req.body;

  try {


    const cartData = await Cart.findById(cartId);
    const status = cartData.status;
    if(status == 'unpaid'){
      const newOrder = new Order({
        userId, name, phone, gTotal, quantity, cartId,status:"pending"
      });
      const savedOrder = await newOrder.save();
      const update = await Cart.findByIdAndUpdate({ _id: cartId }, { status: "paid" }, {
        new: true
      })
      res.status(200).json(savedOrder);  
    }else{
      res.status(500).json({msg:"Order Already Placed"});

    } 
    
  } catch (err) {
    res.status(500).json(err);
  }
});
// //GET ALL

router.get("/order/all", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Get One

//GET BOOK ORDER classes
router.get("/order/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const Orders = await Order.find({ userId: id });
    res.status(200).json(Orders);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post("/orderStatus", async (req, res) => {
  const {orderId,status} = req.body;
  try {
    const Orders = await Order.findByIdAndUpdate({ _id: orderId } ,{ status: status }, {
      new: true
    });
    res.status(200).json({
      code: 200,
      meesage: 'Update Successfully',
      status: 'success',
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/getorderdetail/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const Orders = await Order.findById(id);

    const cartId = Orders.cartId;



    const CartData = await Cart.findById(cartId);


    res.status(200).json(CartData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post("/order/status", async (req, res) => {
  try {
    console.log('1');

    const { productId, cartId,status } = req.body;
    
    const CartData = await Cart.findById(cartId);
    const products = CartData.products;
    const objIndex = products.findIndex((obj => obj._id == productId));

    products[objIndex].color = status;
    const update = await Cart.findByIdAndUpdate({ _id: cartId }, { products: products }, {
      new: true
    })

    return res.status(200).json(update);


    // await Cart.findByIdAndDelete(req.params.id);
  } catch (err) {
    console.log('2');

    res.status(500).json(err);
  }
});


module.exports = router;