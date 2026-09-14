const express = require("express")
const router = express.Router()

const {create, getAll, getOne, update, deletedLead, searchAndFilter, getStats} = require("../controllers/leadController")
const {isLoggedIn} = require("../middleware/authMiddleware")
const {requirePermission} = require("../middleware/permissionMiddleware")
const rateLimiter = require("../middleware/rateLimiter")

router.post("/", isLoggedIn, requirePermission("createLeads"), create)
router.get("/", isLoggedIn, requirePermission("viewLeads"), getAll)
router.get("/search", isLoggedIn, requirePermission("viewLeads"), rateLimiter, searchAndFilter)
router.get("/stats", isLoggedIn, requirePermission("viewLeads"), rateLimiter, getStats)
router.get("/:id", isLoggedIn, requirePermission("viewLeads"), getOne)
router.patch("/:id", isLoggedIn, requirePermission("updateLeads"), update)
router.delete("/:id", isLoggedIn, requirePermission("deleteLeads"), deletedLead)

module.exports = router