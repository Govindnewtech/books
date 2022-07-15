const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema(
  {
   bookName:{
     type:String,
     required:true
   },
   mrp:{
     type:new Number,
     required:true
   },
   authorName:{
     type:String,
     required:true
   },
   ngr:{
     type:String,
     required:true
   },
   userName:{
     type:String,
     required:true
   },
   color:{
     type:String,
     required:true
   },
  },
);



module.exports = mongoose.model("Order", OrderSchema);
