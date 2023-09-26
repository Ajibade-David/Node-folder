
const user = require("../models/user.model")
const jwt = require("jsonwebtoken")


const showWelcome = (req, res)=>{
    res.send("Welcome girans")
    console.log("Welcome welcome");
}

const showRegister = (req, res) =>{
    
    // let newUser = new userModel (req.body)
    let newUser = new user (req.body)
    console.log(newUser);
    console.log("Working Now");
    console.log(req.body);
    newUser.save()
    .then((user)=>{
        console.log("User created");
        res.send({status: true, message: "User created"})
    })
    .catch((err)=>{
        console.log("User not created");
        console.log(err);
        res.send({status: false, message: "User not created"})

    })
}

const signin = (req, res) =>{
    let {signEmail, signPass} = req.body;
    user.findOne({signEmail:signEmail})
    .then((User)=>{
        User.comparedPassword(signPass, (err, isMatch)=>{
            let schoolPortal = process.env.SECRET
            if (isMatch) {
                jwt.sign({signEmail}, schoolPortal, {expiresIn: '1h'}, (err, token)=>{
                    if (err) {
                        console.log(err);
                        
                    }else{
                        console.log(token);
                        res.send({status:true, message: "User found", token:token})
                    }
                })
                console.log(isMatch);
                
            }else{
                res.send({status:false, message: "User not found"})
            }
        })
        console.log("User found");
    })
    .catch((err)=>{
        console.log("Wrong credentials");
    })
}
const getDashboard = (req, res) =>{
    let schoolPortal = process.env.SECRET
    let token = req.headers.authorization.split(" ")[1]

    jwt.verify(token, schoolPortal, (err, result) =>{
        if(err){
            console.log(result);
            res.send({status:false, message:"welcome"})
        }else{
            console.log(err);
            res.send({status:true, message:"welcome", result})
        }
    })
    console.log("I dey Work");
}


module.exports = {showWelcome, showRegister, signin, getDashboard}