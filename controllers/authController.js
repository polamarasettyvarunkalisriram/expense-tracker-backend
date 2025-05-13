const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const db=require('../config/db');


exports.signup=async(req,res)=>{
const {username,email,password}=req.body;
if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email, and password.' });
  }
  db.query('select * from users where email=?',[email],(err,result)=>{
    if(err){
        return res.status(500).json({message:'databases err'})
    }
    if(result.length>0){
        return res.status(400).json({message:'user is already exists'});
    }
    bcrypt.hash(password,10,(err,hashedPassword)=>{
        if(err)
            return res.status(500).json({message:'databases err'});
    
    db.query('insert into users(username,email,password)values(?,?,?)',[username,email,hashedPassword],(err,result)=>{
        if(err){
            return res.status(500).json({message:'databases error'});
        }
    res.status(200).json({message:result})
    })
    })
  })
}

exports.login=async(req,res)=>{
    const{email,password}=req.body
    if(!email || !password){
       return res.status(400).json({message:'Please provide email, and password.'});
    }

    db.query('select * from users where email=?',[email],(err,result)=>{
         if(err){
        return res.status(500).json({message:'databases err'})
    }
    if(result.length==0){
        return res.status(500).json({message:'user is not found'})
    }
    const user=result[0];
    bcrypt.compare(password,user.password,(err,ismatch)=>{
        if(err){
            return res.status(500).json({message:'databases err'});
        }
    if(!ismatch){
        return res.status(500).json({message:'invalid password'});
    }
    const token=jwt.sign({userID:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:'2h'});
    res.status(200).json({message:'login sucessfull',token})
    })
    })
}