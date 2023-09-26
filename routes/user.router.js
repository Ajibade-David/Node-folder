const express = require("express")
const { showWelcome, showRegister, signin, getDashboard } = require("../controllers/user.controller")
const router = express.Router()


router.get("/welcome", showWelcome)
router.post("/signUp", showRegister)
router.post("/signin", signin)
router.get("/dashboard", getDashboard)



module.exports = router