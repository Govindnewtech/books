require('dotenv').config({ path: './config.env' })
const bodyParser = require("body-parser")
const express = require('express');
const cookieParser = require("cookie-parser");
require('./db/conn')


const cors = require("cors")
const app =  express();
app.use(cors())
const port = process.env.PORT || 8000;
const Vendor = require("./router/vendor")
const book =require('./router/book')
const Cart = require('./router/cart')
const Order = require('./router/myOrder')
const category = require('./router/category')

const Admin = require('./router/admin')

app.use(express.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ extended: true , limit:'50mb' }));
app.use(bodyParser.json({limit:'50mb'}));
app.use(cookieParser())
app.use(express.static('public'));
app.use(express.static('/public/uploads/books/images'));
app.use(express.static('/public/uploads/cart/images'));
app.use(Vendor);
app.use(book);
app.use(Order);
app.use(category);
app.use(Cart);
app.use(Admin)




app.get("/" ,  (req,res) => {
      res.send("hello")
})



app.listen(port, () => {
    console.log(`server is running on ${port}`);
  });  
