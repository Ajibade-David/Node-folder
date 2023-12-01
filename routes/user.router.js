const express = require("express")
const { showWelcome, showRegister, signin, getDashboard, SendEmail, BookAppointment, FetchBooking  } = require("../controllers/user.controller")
const router = express.Router()


router.get("/welcome", showWelcome)
router.post("/signUp", showRegister)
router.post("/signin", signin)
router.get("/dashboard", getDashboard)
router.get("/sendmail", SendEmail)
router.post("/BookAppointment", BookAppointment)
router.get("/FetchBooking", FetchBooking )




module.exports = router