const express = require('express');
const router = new express.Router();
const Category = require('../models/Category')
const book = require('../models/book_upload');

const fs = require('fs')
const { VendorAuth, AdminAuth } = require('../middleware/authenticate')
const APIURL = process.env.API_URL;

//-----------------------   
//  Example  authenticate about page 
// ------------------------


// router.get('/about' , AdminToken , (req,res) => {
//   res.send(req.rootUser);
// })

//-----------------------   
// Example logout user
// ------------------------


// router.get("/logout" , (req, res) => {
//   res.clearCookie('jwt' ,{ path: "/"});
//   res.status(200).send('user logout')
// })


//CREATE

router.post("/category/add", async (req, res) => {
  try {

    const { userId, name, description, front } = req.body;

    const categories = await Category.find({ name: name });

    if (categories.length == 0) {
      const public = './public/'
      
      const Fpath = '/uploads/category/' + new Date().getTime().toString() + '.jpg'
      fs.writeFileSync(public + Fpath, front, { encoding: 'base64' })


      const newCategory = new Category({
        userId, name, description, front: APIURL + Fpath
      });


      const savedCategory = await newCategory.save();
      return res.status(200).json(savedCategory);
    } 
    else {
      return res.status(200).json({
        'code': 201,
        'status': 'fail',
        'message': 'Category name already exist'
      });

    }


  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE
router.post("/category/update", async (req, res) => {
  try {

    const { id, userId, name, description, front } = req.body



    if (front != '') {

      const public = './public'
      const Fpath = '/uploads/category/' + new Date().getTime().toString() + '.jpg'
      fs.writeFileSync(public + Fpath, front, { encoding: 'base64' })
      const category = await Category.findById(id);
      const cname = category.name;
      const Book = await book.find({ userId: userId, classes: cname });

      if (Book != '') {
        const bookid = Book[0]._id;


        const updateBook = await book.findByIdAndUpdate(bookid, { classes: name }, {
          new: true
        })
      }

      const newData = await Category.findByIdAndUpdate(id, { userId: userId, name: name, description: description, front: APIURL + Fpath }, {
        new: true
      });
      return res.status(200).json(updateBook);

    } 
    else {

      const category = await Category.findById(id);
      var cname = category.name;

      const Book = await book.find({ userId: userId, classes: cname });
      if (Book != '') {
        const bookid = Book[0]._id;


        const updateBook = await book.findByIdAndUpdate(bookid, { classes: name }, {
          new: true
        })
      }

      const newData = await Category.findByIdAndUpdate(id, { userId: userId, name: name, description: description }, {
        new: true
      });
      return res.status(200).json(newData);

    }




  } catch (error) {

    res.status(404).send(error);
  }

});
// without
router.get("/cat/all", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      categories
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE


router.delete("/cat/delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json("Category has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});


// //GET ALL

router.post("/category", async (req, res) => {
  try {
    const userId = req.body.userId
    const categories = await Category.find({ userId: userId });
    res.status(200).json({
      categories
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/category/:id", async (req, res) => {
  try {

    const _id = req.params.id
    const categories = await Category.findById(_id);
    res.status(200).json({categories});
  } catch (err) {
    res.status(500).json(err);
  }
});


//Academic
router.post("/academic", async (req, res) => {
  try {

    const userId = req.body.userId
    // const categories = await Category.find({ userId: userId });
    const categories = await Category.find({ userId: userId, description: "Academic" })
    res.status(200).json({
      categories
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


//academic data check
router.post("/catdata", async (req, res) => {
  try {
    const userId = req.body.userId
    const categories = await Category.findOne({ userId: userId, description: "Academic" })
    if (categories) {
      res.status(200).json({
        categories
      });
    } else {
      res.status(500).json({ message: "No data found" });

    }

  } catch (err) {
    res.status(400).json(err);
  }
});


// Other Categories

router.post("/othercategories", async (req, res) => {
  try {

    const userId = req.body.userId
    // const categories = await Category.find({ userId: userId });
    const categories = await Category.find({ userId: userId, description: "Other Categories" })
    res.status(200).json({
      categories
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//





router.post("/searchcat", async (req, res) => {
  try {

    const userId = req.body.userId

    // const categories = await Category.find({ userId: userId });
    const categories = await Category.find({ userId:userId, description: "Other Categories"})
    res.status(200).json({
      categories
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post("/searchcats/", async (req, res) => {
  const userId = req.body.userId
  const name = req.params.name;
  try {
    const bookpublisher = await Category.find({ description: "Other Categories"});
    res.status(200).json(bookpublisher);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
