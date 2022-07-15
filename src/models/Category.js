const mongoose = require("mongoose");


const CategorySchema = new mongoose.Schema(
  {
   name:{
     type:String,
     required:true
   },
   description:{
     type:String,
    //  required:true
   },
    userId: {
      type: String,
      required: true
    },
    front: {
      type: String,
      // required: true
    },
  },
);


// module.exports = Category = mongoose.model("categories", CategorySchema);

module.exports = mongoose.model("Category", CategorySchema);
