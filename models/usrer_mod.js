const mongoose=require('mongoose');
const validator=require('validator');
const userrolr = require('../utils/role_login');
const userschema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
            email:{
                    type:String,
                    requierd:true,
                    unique:true,
                    validate:[validator.isEmail,'email must be  a valid Email Address'],  // array
                },
            password:{
                type:String,
                requierd:true
            },
            token:{
                type:String
            },
            role:{
               type:String,//{admin,user,manger}
               enum:[userrolr.ADMIN,userrolr.MANAGER,userrolr.USER],
               default:userrolr.USER
            },
            avatar:{
                type:String,
                default:'uploads/profile.jpeg'
            }
})
module.exports=mongoose.model("user",userschema)