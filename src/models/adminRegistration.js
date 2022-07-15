const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt   = require('bcrypt');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
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

    AdminSchema.pre('save' , async function (next){
        if(this.isModified('password')){
            this.password = await bcrypt.hashSync(this.password , 10);
          }
          next();
      }); 
    
      AdminSchema.methods.generateAuthToken = async function () {
        try {
                
             const token = jwt.sign({_id : this._id} , process.env.SECRET_KEY );
             this.tokens = this.tokens.concat({token : token})
             await this.save();
             return token;
        } catch (error) {
            console.log(error);
        }
     }


const AdminRegistraion = new mongoose.model('Admin' , AdminSchema);

module.exports =  AdminRegistraion;
