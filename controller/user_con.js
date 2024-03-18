const asyncfn=require("../middleware/asyncwrapper");
const User=require('../models/usrer_mod');
const httpstatus=require("../utils/httpstatus");
const apperror=require("../utils/app_error");
const bcrybt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const genratejwt=require('../utils/genrate_jwt');


const getAllusers=asyncfn(async(req,res)=>{
    // get all user from DB using model
    const query=req.query;
    const limit=query.limit||4;
    const page=query.page||1;
    const skip=(page - 1) * limit;
//hide password
    const users= await User.find({},{"__v":false,"password":false}).limit(limit).skip(skip);
    res.json({status:httpstatus.suc,data:{users}});
    });
const register=asyncfn(async(req,res,next)=>{
    console.log(req.body);

    const {fullname,email,password,role}=req.body;
    const olduser=await User.findOne({email:email});
    if(olduser){
        const error= apperror.create("user already founded",404,httpstatus.Fail)
        return next(error)
    }

    // hash pass
    const hashpass=await bcrybt.hash(password,10);
    const newUser=new User({
      fullname,
        email,
        password:hashpass,
        role,
        avatar:req.file.filename      
    })

    //genrate jwt token

    const token= await genratejwt({email:newUser.email,id:newUser._id,role:newUser.role});
    console.log("token",token);
    newUser.token=token;
    await newUser.save();
    res.status(201).json({status:httpstatus.suc,data:newUser})



})
const login=asyncfn(async (req,res,next)=>{
    const {email,password}=req.body;
    if(!email&&!password){
        const error= apperror.create("email and password is required",404,httpstatus.Fail)
        return next(error) 
    }
    const user=await User.findOne({email:email});
    if(!user){
        const error= apperror.create("user not found",404,httpstatus.ERR)
        return next(error) 
    }
    const matchpassword=await bcrybt.compare(password,user.password);


    if(user&&matchpassword){
        //logeddin succ
        const token= await genratejwt({email:user.email,id:user._id,role:user.role});
        res.json({status:httpstatus.suc,data:{token}});

    }else{
        const error= apperror.create("passowrd error",500,httpstatus.ERR)
        return next(error) 
    }
})

module.exports={
    getAllusers,
    register,
    login
}