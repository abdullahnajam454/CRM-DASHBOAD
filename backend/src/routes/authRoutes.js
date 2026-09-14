const express = require("express")
const {register, login, logout, me} = require("../controllers/authController")
const rateLimiter = require("../middleware/rateLimiter")
const {isLoggedIn} = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/register", register)
router.post("/login", rateLimiter, login)
router.post("/logout", logout)
router.get("/me", isLoggedIn, me)

module.exports = router