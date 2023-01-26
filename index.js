const express = require('express')
const cors= require('cors')
const JWT= require('jsonwebtoken')
const jwtKey = 'e-comm'
require('./DB/config')
const User = require('./DB/User')
const Product = require('./DB/Products')
const app = express();
app.use(cors())
app.use(express.json())

app.post("/register",async(req,resp)=>{
    
      
    let check = await User.find({email: req.body.email})
     if(check.length>0){
       return  resp.send({message:"Email Already Exist"})
     }
    let user = new User(req.body);
    let result = await user.save();
 
    resp.send(result)
})
 
app.post('/add-product',async(req,resp)=>{
 
    let product = new Product (req.body)
    let result = await product.save()
    JWT.sign({result},jwtKey ,{expiresIn: "2h"},(err,token)=>{
      if (err){
       resp.send({result:"Something went wrong!"})
      }
       resp.send({result,auth: token})
     })})

app.post('/login', async(req,resp)=>{


    if (req.body.password && req.body.email){  
        let user = await User.findOne(req.body)
        if (user)
        {
          JWT.sign({user},jwtKey ,{expiresIn: "2h"},(err,token)=>{
           if (err){
            resp.send({result:"Something went wrong!"})
           }
            resp.send({user,auth: token})
          })
        }
        else{
            resp.send({response:"No Result Found"})
        }}
 else{
    resp.send({response:"No Result Found!!"})
 }
})
app.get('/products',async(req,resp)=>{
  let products = await Product.find()
  if (products.length>0)
  {
    resp.send(products)
  }else { resp.send({response:"No Product Found"})}
})

app.delete('/product/:id',async(req,resp)=>{
    let result = await Product.findByIdAndDelete(req.params.id);
    resp.send(result)
})

app.get("/update/:id",async(req,resp)=>{
    let result = await Product.findById(req.params.id)
resp.send(result)

})
app.put('/update/:id',async (req,resp)=>{
    let result = await Product.updateOne(
        { _id: req.params.id},
        {
          $set : req.body  
        }
        )
        resp.send(result)
})

app.get('/search/:key', async(req,resp)=>{
   let result = await Product.find({
      "$or": [
        {name: {$regex: req.params.key}}
      ]
   })
   resp.send(result)
})
app.listen(5000,()=>console.log("server started")); 
