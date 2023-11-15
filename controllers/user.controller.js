
const user = require("../models/user.model")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const crypto = require("crypto");


const showWelcome = (req, res)=>{
    res.send("Welcome girans")
    console.log("Welcome welcome");
}

const showRegister = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send({ status: false, message: "Email address is required" });
        }

        // Check if email exists in the database
        const existingUser = await user.findOne({ email });

        if (existingUser) {
            // If the email exists, display a message to the user
            return res.send({ status: false, message: "Email already exists in the database" });
        }

        // If the email doesn't exist, proceed with user creation
        const newUser = new user(req.body);
        await newUser.save();

        console.log("User created");
        return res.send({ status: true, message: "User created" });
    } catch (error) {
        console.error("Error occurred during user registration:", error);
        return res.status(500).send({ status: false, message: "Error creating user. Please try again later." });
    }
};

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

const SendEmail=(req,res)=>{

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: "davidajibade58@gmail.com",
            pass: "uagw dohu shpf mhix",
        },

    });
    let mailOptions = {
        from: 'davidajibade58@gmail.com', 
        to: "ajibaded550@gmail.com",
        subject: "Hello ",
        text: "Hello World",
        html: "<Lorm/>"

    }
    transporter.sendMail(mailOptions, function (err, info){
        if (err) {
            console.log(error);
            res.send({status:false, message:"user not created"})
        }else{
            console.log("Email sent:" + info.response);
                res.send({status:true, message:"user created"})
        }
    })
}
const ForgotPassword = async (req, res) => {
    try {   
      const { signEmail } = req.body;
  
      if (!signEmail) {
        return res.status(400).send({ status: false, message: "Email address is required" });
      }
  
      // Find user by email
      const existingUser = await user.findOne({ signEmail });
  
      if (!existingUser) {
        return res.status(404).send({ status: false, message: "User not found" });
      }
  
      // Generate reset token and set expiration time
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetPasswordToken = resetToken;
      const resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
  
      existingUser.resetPasswordToken = resetPasswordToken;
      existingUser.resetPasswordExpires = resetPasswordExpires;
  
      await existingUser.save();
  
      // Send password reset email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "davidajibade58@gmail.com", // Update with your email credentials
          pass: "uagw dohu shpf mhix", // Update with your email password
        },
      });
  
      const mailOptions = {
        from: "davidajibade58@gmail.com",
        to: signEmail,
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n`
          + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
          + `http://${req.headers.host}/reset/${resetPasswordToken}\n\n`
          + `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending password reset email:", error);
          return res.status(500).send({ status: false, message: "Error sending password reset email" });
        }
        res.status(200).send({ status: true, message: "Password reset email sent successfully" });
      });
    } catch (error) {
      console.error("Error initiating password reset:", error);
      res.status(500).send({ status: false, message: "Error initiating password reset" });
    }
  };
module.exports = {showWelcome, showRegister, signin, getDashboard, SendEmail, ForgotPassword}