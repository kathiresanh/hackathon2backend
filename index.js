const express = require('express')
const app = express()
const cors = require("cors")
app.use(express.json())
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const { URLSearchParams } = require("whatwg-url");
const URL ="mongodb+srv://kathir:kathir12345@cluster0.jnknh.mongodb.net?retryWrites=true&w=majority"
var nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const jswt = require("jsonwebtoken");
const secret = "ABCDEFGHIJ";
let options = {
    origin:"*"
}
app.use(cors(options))

app.post("/createproduct",async function(req,res){
    try {
        let connection = await mongoClient.connect(URL)
        let db = connection.db("b29")
       await  db.collection("products").insertOne(req.body)
       connection.close();
       res.json({message:"productadded"})
      } catch (error) {
          console.log(error)
      }
})



// login

app.post("/login",async function(req,res){
    try {
        let connection = await mongoClient.connect(URL)
        let db = connection.db("b29")
        let user = await db.collection("ionix").findOne({email:req.body.email})
     
        
        if(user){
            let passwordresult = await bcrypt.compare(req.body.password,user.password)
            if(passwordresult){
                let token = jswt.sign({userid:user._id},secret,{expiresIn: "1h"})
                res.json({token})
              
            }else{
                res.status(401).json({message:"password not match"})
            }
        }else{
            res.status(401).json({message:"no user found"})

        }

    } catch (error) {
         console.log(error)
    }
})

app.post("/register",async function(req,res){
    try {
        let connection = await mongoClient.connect(URL)
        let db = connection.db("b29")
   
    //    encrypt the password
          let salt = await bcrypt.genSalt(10);
          let hash =await bcrypt.hash(req.body.password,salt);
      
          req.body.password=hash;
          


        await db.collection("ionix").insertOne(req.body)
        await connection.close()
        res.json({message:"user created"})
    } catch (error) {
        console.log(error)
    }
})

app.get('/getproduct', async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("b29");
       let user =  await db.collection("products").find({}).toArray();
        await connection.close();
        res.json(user);
    } catch (error) {
        console.log(error)
    }
   
  })

  app.delete("/deleteproduct/:id",async function(req,res) {
      console.log(req.params.id)
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("b29");
        let objId = mongodb.ObjectId(req.params.id);
        await db.collection("products").deleteOne({_id:objId})
        await connection.close();
        res.json({message:"user deleted"})
    } catch (error) {
     console.log(error)
    }
})
app.listen(3001)