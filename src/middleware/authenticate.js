const jwt = require('jsonwebtoken');
const Admin = require("../models/adminRegistration")
const Vendor = require('../models/vendorRegistration')




const VendorAuth = async ( req , res , next) => {

    try {
         
        const token = req.cookies.jwt;

        const verifyToken = jwt.verify( token , process.env.SECRET_KEY);

        const rootUser = await Vendor.findOne({ _id : verifyToken._id, "tokens.token": token});

        if(!rootUser){throw new Error ('user not found')};

        req.token = token;
        req.rootUser = rootUser;

        next();


    } catch (error) {
        res.status(401).send(error)
    }


}


const AdminAuth = async ( req , res , next) => {

    try {
         
        const token = req.cookies.jwt;

        const verifyToken = jwt.verify( token , process.env.SECRET_KEY_Admin);

        const rootUser = await Admin.findOne({ _id : verifyToken._id, "tokens.token": token});

        if(!rootUser){throw new Error ('user not found')};

        req.token = token;
        req.rootUser = rootUser;

        next();


    } catch (error) {
        res.status(401).send(error)
    }


}

module.exports = {
    VendorAuth,
    AdminAuth
};