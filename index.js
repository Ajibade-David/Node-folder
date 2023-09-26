const express = require("express")
const app = express()
require("dotenv").config()
const PORT = process.env.PORT
const userRouter = require("./routes/user.router")
// const userModel = require("./models/user.model")
const cors = require("cors")
// const mongoose = require("mongoose")

const mongoose = require("mongoose")
let URI = "mongodb+srv://Virtue2006:Virtue2006@cluster0.8zgmewo.mongodb.net/Davelogics?retryWrites=true&w=majority"
mongoose.connect(URI).then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err, "Database not connected");
})


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/user", userRouter)
app.listen(PORT, () =>{
    console.log( `Server n sare lori port ${PORT}` );
})

