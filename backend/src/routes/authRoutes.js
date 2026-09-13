const express = require("express")
const {register, login} = require("../controllers/authController")
const rateLimiter = require("../middleware/rateLimiter")

const router = express.Router()

router.post("/register", register)
router.post("/login", rateLimiter, login)

module.exports = router