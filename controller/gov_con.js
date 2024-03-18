const {validationResult }=require("express-validator")
const gov = require('../models/governorates_mod');
const httpstatus=require("../utils/httpstatus");
const asyncfn=require("../middleware/asyncwrapper");
const apperror=require("../utils/app_error");

const getALLgov=async(req,res)=>{
    const query=req.query;
    const limit=query.limit||6;
    const page=query.page||1;
    const skip=(page - 1)*limit;

    const goves=await gov.find({},{"__v":false}).limit(limit).skip(skip);
    res.json({status:httpstatus.suc,data:{goves}});
}
const getgoves=asyncfn(
    async(req,res)=>{
        const gove=await gov.findById(req.params.id);
        if(!gove){
           const error= apperror.create("governorate not found",404,httpstatus.Fail)
            return next(error)
         }
        return res.json({status:httpstatus.suc,data:{gove}})}
)

const addgove=asyncfn(async (req,res,next)=>{
    console.log(req.body);
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const error=apperror.create(errors.array(),400,httpstatus.Fail)
        return next(error);
    }
    

    const newgove=new gov(req.body);

    await newgove.save();
    res.status(201).json({status:httpstatus.suc,data:newgove})
})

const updategove=asyncfn(async(req,res)=>{
 
        const govid=req.params.id;

         const gove=await gov.updateOne({_id:govid},{$set:{...req.body}});

        return  res.status(200).json({status:httpstatus.suc,data:gove});


})

const deletegove=asyncfn(async(req,res)=>{
   const govid=req.params.id;
    const delone=await gov.deleteOne({_id:govid})


    res.status(200).json({status:httpstatus.suc,data:null});
 } )
 module.exports={
    getALLgov,
    getgoves,
    addgove,
    updategove,
    deletegove
 }