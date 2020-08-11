const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model('User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config/keys') ;
const requireLogin=require('../middleware/requireLogin');

// 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




router.post('/signup',(req,res)=>{

    const {name,email,password,pic}=req.body;
    if(!email||!password ||!name){
        return res.status(422).json({error:"Please add all the fields"})
    }
    
    User.findOne({email:email})
    .then((savedUser)=>{
    if(savedUser){
        return res.status(422).json({error:"User already exist with this email"});
    }
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        const user=new User({
            email,
            password:hashedpassword,
            name,
            pic:pic
        })
        user.save()
        .then(user=>{
     
            res.json({message:"saved succesfully"})
        }).catch(err=>{
            console.log(err)
        })
    })
   
    }).catch(err=>{
        console.log(err);
    })

})


//sigin route

router.post('/login',(req,res)=>{

    const {email,password}=req.body;
    if(!email || !password){
        return res.status(422).json({error:'please add email or password'});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:'Invalid email or password'});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                 // res.json({message:"succesfully signed in"});
             const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
             const {_id,name,email,followers,following,pic}=savedUser;
             res.json({token,user:{_id,name,email,followers,following,pic}});
           
            }else{
                return res.status(422).json({error:'Invalid  password'});

            }
        }).catch(err=>{
            console.log(err);
        })
    })
})

module.exports=router