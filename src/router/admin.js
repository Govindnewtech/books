const express = require("express");
const router = new express.Router();
const Admin = require('../models/adminRegistration');
const bcrypt = require('bcrypt');
const multer = require('multer');

const upload = multer();


//  insert Admin user data 



router.post("/admin_register", upload.any(), async (req, res) => {


    const { name, email, phone, address, password } = req.body;

    if (!name || !email || !address || !phone || !password) {
        return res.status(422).json({ error: 'plz filled the filed properly' });
    }
    try {

        const result = new Admin({ name, email, phone, address, password });
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
//  Admin vendor
// ------------------------


router.post("/Admin_login", upload.any(), async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(200).json({
            code: 201,
            status: "fail",
            message: "Invalid Request"
        })
    }

    try {

        const result = await Admin.findOne({ email });
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
                    status: "success",
                    message: "Login Successfully"
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




module.exports = router;