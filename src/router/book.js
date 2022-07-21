const express = require('express');
const router = new express.Router();
const book = require('../models/book_upload');
const multer = require('multer');
const fs = require('fs')
const { VendorAuth, AdminAuth } = require('../middleware/authenticate')
const APIURL = process.env.API_URL;


const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");


// ---------------------
//   multer Storage define
//----------------------  

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/root/book-api-ntf/public/uploads/books/images");
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

const multipleupload = upload.fields([{ name: 'front', maxCount: 50 }, { name: 'back', maxCount: 50 }, { name: 'content', maxCount: 50 }]);

// ---------------------
//  book upload 
//----------------------

router.post("/book", multipleupload, async (req, res) => {

  const { userId, name, author, publisher, edition, year, isbn, binding, pages, language, mrp, discount, cost, front, back
    , content, classes, bookCategories, sellerName, sellerPhone, aadhar, paymentMode, color, status } = req.body;

  if (!userId || !name || !author || !publisher || !edition || !year || !isbn || !binding || !pages || !language || !mrp || !discount || !cost
    || !front || !back || !content || !classes || !bookCategories || !sellerName || !sellerPhone || !aadhar || !paymentMode || !color || !status) {
    return res.status(200).json({
      code: 201,
      status: "fail",
      message: "Invalid Request"
    })
  }

  try {

    const public = './public'
    const Fpath = '/uploads/books/images/' + new Date().getTime().toString() + '.jpg'
    fs.writeFileSync(public + Fpath, front, { encoding: 'base64' })

    const Bpath = '/uploads/books/images/' + new Date().getTime().toString() * 2 + '.jpg'
    fs.writeFileSync(public + Bpath, back, { encoding: 'base64' })


    const Cpath = '/uploads/books/images/' + new Date().getTime().toString() * 3 + '.jpg'
    fs.writeFileSync(public + Cpath, content, { encoding: 'base64' })

    const result = new book({
      userId, name, author, publisher, edition, year, isbn, binding, pages, language, mrp, discount, cost,
      front: APIURL + Fpath, back: APIURL + Bpath, content: APIURL + Cpath, classes, bookCategories, sellerName, sellerPhone, aadhar, paymentMode, color, status
    });
    const Data = await result.save();

    if (Data) {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Book register succesfully",
        name: Data.name,
        front: Data.front,
        price: Data.cost
      })
    } else {
      return res.status(200).json({
        code: 201,
        status: "fail",
        message: "Something went wrong"
      })
    }
    // res.status(201).send()
  } catch (error) {
    res.status(500).json(error);

  }
});

// //GET ALL

// router.post("/book/all", async (req, res) => {
//   try {
//     const id = req.body.userId;

//     const books = await book.find({ userId: id });
//     res.status(200).json({ books });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// without id get all cat
router.get("/book/all", async (req, res) => {
  try {
    const books = await book.find();
    res.status(200).json({
      books
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// book get by id
router.get("/book/:id", async (req, res) => {

  try {
    const id = req.params.id;

    const books = await book.find({ _id: id });
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json(err);
  }
});



// book update 

router.post("/book/update", async (req, res) => {



  const { bookId, userId, name, author, publisher, edition, year, isbn, binding, pages, language, mrp, discount, cost, front, back
    , content, classes, bookCategories, sellerName, sellerPhone, aadhar, paymentMode, color, status } = req.body;

  if (!userId || !name || !author || !publisher || !edition || !year || !isbn || !binding || !pages || !language || !mrp || !discount || !cost
    || !classes || !bookCategories || !sellerName || !sellerPhone || !aadhar || !paymentMode || !color || !status) {
    return res.status(200).json({
      code: 201,
      status: "fail",
      message: "Invalid Request"
    })
  }

  try {



    const public = './public'

    if (front != '') {

      const Fpath = '/uploads/books/images/' + new Date().getTime().toString() + '.jpg'
      fs.writeFileSync(public + Fpath, front, { encoding: 'base64' })

      const updateFront = await book.findByIdAndUpdate(bookId, { front: APIURL + Fpath }, { new: true });
    }

    if (back != '') {

      const Bpath = '/uploads/books/images/' + new Date().getTime().toString() * 2 + '.jpg'
      fs.writeFileSync(public + Bpath, back, { encoding: 'base64' })
      const updateFront = await book.findByIdAndUpdate(bookId, { back: APIURL + Bpath }, { new: true });
    }

    if (content != '') {
      const Cpath = '/uploads/books/images/' + new Date().getTime().toString() * 3 + '.jpg'
      fs.writeFileSync(public + Cpath, content, { encoding: 'base64' })
      const updateFront = await book.findByIdAndUpdate(bookId, { content: APIURL + Cpath }, { new: true });
    }

    const result = await book.findByIdAndUpdate(bookId, {
      userId: userId, name: name, author: author, publisher: publisher, edition: edition, year: year, isbn: isbn, binding: binding, pages: pages, language: language, mrp: mrp, discount: discount, cost: cost, classes: classes, bookCategories: bookCategories, sellerName: sellerName, sellerPhone: sellerPhone, aadhar: aadhar, paymentMode: paymentMode, color: color
      , status: status
    }, { new: true });



    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Book updated succesfully",
    })

    // res.status(201).send()
  } catch (error) {
    res.status(500).json(error);

  }
});



//DELETE
router.delete("/book/delete/:id", async (req, res) => {
  try {
    await book.findByIdAndDelete(req.params.id);
    res.status(200).json("Book has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET BOOK ORDER classes
router.get("/book/classes/:classes", async (req, res) => {
  const classes = req.params.classes;
  try {
    const books = await book.find({ classes: classes });
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json(err);
  }
});



//GET BOOK ORDER author
router.post("/author/:author", async (req, res) => {

  const author = req.params.author;
  const userId = req.body.userId;
  try {
    const bookauthor = await book.find({ userId: userId, author: author });
    res.status(200).json({ bookauthor });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET BOOK ORDER publisher
router.post("/publisher/:publisher", async (req, res) => {
  const publisher = req.params.publisher;
  const userId = req.body.userId;

  try {
    const bookpublisher = await book.find({ userId: userId, publisher: publisher });
    res.status(200).json({ bookpublisher });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET BOOK ORDER bookCategories
router.get("/bookCategories/:bookCategories", async (req, res) => {
  const bookCategories = req.params.bookCategories;
  try {
    const Categories = await book.find({ bookCategories: bookCategories });
    res.status(200).json({ Categories });
  } catch (err) {
    res.status(500).json(err);
  }
});
// 
router.patch('/status/:_id', async (req, resp) => {

  let update = await book.findOneAndUpdate({ _id: req.params._id }, req.body);
  console.log(update);
  resp.send({ status: "updated succesfully" });
});

// filter api
router.post('/filter', async (req, resp) => {
  const { from, to, userId, type } = req.body;
  console.log(from);
  console.log(to);

  if (type == 'custom') {
    if (from != '' && to != '') {
      const result = await book.find({
        userId: userId, createdAt: {
          $gte: new Date(from + "T00:00:00.000Z"),
          $lt: new Date(to + "T23:59:59.999Z")
        }
      });
      return resp.send({ data: result });
    } else {
      return resp.status(200).json({
        code: 201,
        status: "fail",
        message: "Invalid Request"
      })
    }


  } else {

    const d = new Date();
    console.log(d);
    d.setDate(d.getDate() - type);
    console.log(d);
    const result = await book.find({
      userId: userId, createdAt: {
        $gte: d,
        $lt: new Date()
      }
    });
    return resp.send({ data: result });

  }

});

module.exports = router;
