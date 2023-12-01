
const user = require("../models/user.model")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const crypto = require("crypto");
const Book = require("../models/bookmodel");
const { log } = require("console");


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
        subject: "Hi",
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
// Assuming you have a Mongoose model named 'Appointment' defined elsewhere



const BookAppointment = async (req, res) => {
  const { fullName, phoneNumber, age, dob, gender, address } = req.body;
console.log(req.body);
  const booking = new Book({ // Use the Book model to create a new booking
    patientName: fullName,
    patientPhoneNumber: phoneNumber,
    dateOfBirth: dob,
    gender: gender,
    address: address,
    status: "pending",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  try {
    const result = await booking.save(); // Save the booking using the Book model
    res.status(201).json(result); // Send a success response with the saved booking
  } catch (err) {
    console.error(err);
    res.status(500).send("Error occurred while saving the booking"); // Send an error response
  }
};


const FetchBooking = async (req, res)=>{
    try {
        // Fetch all bookings from the database
        const bookings = await Book.find();
        
        // Send the bookings as a JSON response
        res.json(bookings);
        console.log(bookings)
      } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Internal server error' });
      }
    
}


  
module.exports = {showWelcome, showRegister, signin, getDashboard, SendEmail, BookAppointment, FetchBooking  }