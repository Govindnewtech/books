const Cart = require("../models/Cart");
const router = require("express").Router();
const multer = require('multer');
const fs = require('fs')
const book = require('../models/book_upload');
const { VendorAuth, AdminAuth } = require('../middleware/authenticate')


// ---------------------
//   multer Storage define
//----------------------  

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/root/stationery/public/uploads/cart/images");
  },
  filename: (req, file, cb) => {
    const filename = file.originalname;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {

  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);

};

const upload = multer({ storage: fileStorageEngine, fileFilter: fileFilter });

const multipleupload = upload.fields([{ name: 'front', maxCount: 50 }])




//CREATE

router.post("/cart/add", multipleupload, async (req, res) => {

  const { userId, bookId, name, front, price, offerprice, autername, quantity, color } = req.body;

  try {

    const cartData = await Cart.find({ userId: userId , status :"unpaid" });

   

    if (cartData.length == 0) {
      const bookData = await book.findById(bookId);

      const sellerName = bookData.sellerName
      const sellerPhone = bookData.sellerPhone
     
      // return res.status(200).json(bookData);


      const newCart = new Cart({
        userId, products: [{
          bookId, name, price, offerprice, autername, front, quantity, color,sellerName,sellerPhone
        }],
        status: "unpaid"
      });

      const savedCart = await newCart.save();
      return res.status(200).json(savedCart);
    } else {

      const bookData = await book.findById(bookId);

      const sellerName = bookData.sellerName
      const sellerPhone = bookData.sellerPhone
      // return res.status(200).json(bookData);

      var products = cartData[0].products;

      var id = cartData[0]._id;

      var element = {};
      element.bookId = bookId;
      element.name = name;
      element.price = price;
      element.offerprice = offerprice;
      element.autername = autername;
      element.front = front;
      element.quantity = quantity;
      element.color = color;
      element.sellerName = sellerName;
      element.sellerPhone = sellerPhone;
      
      products.push(element);

      const update = await Cart.findByIdAndUpdate({ _id: id }, { products: products }, {
        new: true
      })

      // console.log(products);
      return res.status(200).json(update);


    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.patch("/cart/update/:id", async (req, res) => {

  const _id = req.params.id;
  try {
    const cartData = await Cart.findByIdAndUpdate(_id, req.body, {
      new: true
    })
    res.status(201).send(cartData);

  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.post("/cart/delete", async (req, res) => {
  try {

    const { productId,cartId } = req.body;
    const cartData = await Cart.findById(cartId);
    const products = cartData.products;


    for (var i = 0; i < products.length; i++) {

      if (products[i]._id == productId) {
        products.splice(i, 1);       
      }
    }

    const update = await Cart.findByIdAndUpdate({ _id: cartId }, { products: products }, {
      new: true
    })

    return res.status(200).json(update);


    // await Cart.findByIdAndDelete(req.params.id);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART

router.get("/book/cart/:id", async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.id });
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(400).json({ message: 'cart is empty' })
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//cart data c
router.get("/cart/:id", multipleupload, async (req, res) => {

  try {
    const cart = await Cart.find({ userId: req.params.id ,status:"unpaid"});
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(400).json({ message: 'cart is empty' })
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/all/cart", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json({
      carts
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/cart/all", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
