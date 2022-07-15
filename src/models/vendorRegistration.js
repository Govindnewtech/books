const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt   = require('bcrypt');
const jwt = require('jsonwebtoken');

const vendorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        storename: {
            type:  String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: [true, "email is already present"],
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("invalid Email");
                }
            }
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            validate(value) {
                if (!validator.isMobilePhone(value)) {
                    throw new Error("invalid phone number")
                }
            }
        },
        address:{
            type:String,
            required:true
             
       },
        password: {
            type: String,
            required: true   
        },
        tokens:[{
            token:{
                type:String,
                required:true
            }
        }]

    });

    vendorSchema.pre('save' , async function (next){
        if(this.isModified('password')){
            this.password = await bcrypt.hashSync(this.password , 10);
          }
          next();
      }); 
    
    vendorSchema.methods.generateAuthToken = async function () {
        try {
                
             const token = jwt.sign({_id : this._id} , process.env.SECRET_KEY );
             this.tokens = this.tokens.concat({token : token})
             await this.save();
             return token;
        } catch (error) {
            console.log(error);
        }
     }

const vendorRegistraion = new mongoose.model('Vendor' , vendorSchema);

module.exports =  vendorRegistraion;
