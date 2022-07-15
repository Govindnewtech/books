const mongoose = require('mongoose');

const myorderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        cartId: {
            type: String,
            required: true
        },
       name: {
        type:String,
        required:true
       },
       phone: {
        type: String,
        required:true
       },
       gTotal: {
        type:String,
        required:true
       },
        quantity: {
            type: String,
            required: true
        }, status: {
            type: String,
            required: true
        }
       // payment: {
       //  type: String,
       //  required:true
       // },
       // itemName: {
       //  types:[String],
       //  required:true
       // },
       // price: {
       //  type: [Number],
       //  required:true
       // },
    });




const myorder = new mongoose.model('Order' , myorderSchema);

module.exports =  myorder;
