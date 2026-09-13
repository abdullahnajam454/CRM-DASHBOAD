const express  = require("express")
const userCreate = require("../controllers/authMemberController")

const memberRouter = express.Router()

memberRouter.post("/register/member", userCreate )

module.exports = memberRouter


