const express = require("express")
const router = express.Router()

const {create, getAll, getOne, update, deletedLead, searchAndFilter, getStats} = require("../controllers/leadController")
const {isLoggedIn} = require("../middleware/authMiddleware")
const rateLimiter = require("../middleware/rateLimiter")

router.post("/",isLoggedIn, create)
router.get("/", isLoggedIn, getAll)
router.get("/search", isLoggedIn,rateLimiter, searchAndFilter)
router.get("/stats", isLoggedIn,rateLimiter, getStats)
router.get("/:id", isLoggedIn, getOne)
router.patch("/:id", isLoggedIn, update)
router.delete("/:id", isLoggedIn, deletedLead)

module.exports = router