const express=require('express');
const multer  = require('multer')
const apperror=require('../utils/app_error')
const diskstorge=multer.diskStorage({
        destination:function(req,file,cb){
            console.log("file",file);
            cb(null,'uploads/')
        },
        filename:function(req,file,cb){
            const ext=file.mimetype.split('/')[1];
            const filename=`user-${Date.now()}.${ext}`;
            cb(null,filename);
        }

})
const filefilter=(req,file,cb)=>{
    const imagefilter=file.mimetype.split('/')[0];
    if(imagefilter=="image"){
        return cb(null,true);
    }else{
       return cb(apperror.create("must be file",400),false)
    }
}

const upload = multer({ storage: diskstorge,fileFilter:filefilter})
const router=express.Router();
const user_con=require('../controller/user_con');
const veryfiy=require("../middleware/veryfiyToken");


router.route('/').get(veryfiy,user_con.getAllusers)
router.route('/register').post(upload.single('avatar'),user_con.register)
router.route('/login').post(user_con.login)


module.exports=router;