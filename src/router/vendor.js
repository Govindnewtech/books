const express = require("express");
const router = new express.Router();
const vendor = require("../models/vendorRegistration");
const bcrypt = require('bcrypt')
const multer = require('multer');

const upload = multer();


//  insert vendor user data 
router.post("/register", upload.any(), async (req, res) => {


  const { name, storename, email, phone, address, password } = req.body;

  if (!name || !storename || !email || !address || !phone || !password) {
    return res.status(422).json({ error: 'plz filled the filed properly' });
  }
  try {

    const result = new vendor({ name, storename, email, phone, address, password });
    const Data = await result.save();

    if (Data) {
      res.status(201).json({ message: "user register succesfully" });
    } else {
      res.status(500).json({ error: "user not registerd" });
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

//-----------------------   
//  Login vendor
// ------------------------


router.post("/login", upload.any(), async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(200).json({
      code: 201,
      status: "fail",
      message: "Invalid Request"
    })
  }

  try {

    const result = await vendor.findOne({ email });
    if (result) {

      const isMatch = await bcrypt.compare(password, result.password)
      const token = await result.generateAuthToken();

      const cookie = res.cookie('jwt', token, {
        expires: new Date(Date.now() + 500000),
        httpOnly: true
      })

      if (!isMatch) {
        return res.status(200).json({
          code: 201,
          status: "invalidpassword",
          message: "Incorrect Password"
        })
      } else {
        return res.status(200).json({
          code: 200,
          status: "working",
          data : result,
          message: "login sucessfull"
        })
      }
    } else {
      return res.status(200).json({
        code: 201,
        status: "notexist",
        message: "Email does not exist"
      })
    }

  } catch (error) {
    return res.status(200).json({
      code: 201,
      status: "fail",
      message: "Something went wrong"
    })
  }


})


//UPDATE


router.put("/vendorupdate/:userId", upload.any(), async (req, resp) => {
  try {
    const _id = req.params.userId;
    const profileData = await vendor.findByIdAndUpdate(_id, req.body, {
        new: true
    });
    resp.status(201).send(profileData);

} catch (error) {

    resp.status(404).send(error);
}

});


//DELETE
router.delete("/venderdelete/:delete_id", async (req, res) => {
  try {
    const _id = req.params.delete_id;
    await vendor.findByIdAndDelete(_id);
    res.status(200).json("vendor has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/vender/all", async (req, res) => {
  try {
    const vendors = await vendor.find();
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/vender_id/:id", async (req, res) => {
  try {
    const _id = req.params.id
    const vendors = await vendor.findById(_id);
    res.status(200).json({vendors});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
