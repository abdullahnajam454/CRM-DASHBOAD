const express = require("express");

const router = express.Router();

const {
    create,
    getAll,
    update,
    remove
} = require("../controllers/memberController");

const {
    isLoggedIn
} = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/permissionMiddleware");


// CREATE MEMBER
router.post(
    "/",
    isLoggedIn,
    requirePermission("manageMembers"),
    create
);


// GET ALL MEMBERS
router.get(
    "/",
    isLoggedIn,
    requirePermission("manageMembers"),
    getAll
);


// UPDATE MEMBER
router.patch(
    "/:id",
    isLoggedIn,
    requirePermission("manageMembers"),
    update
);


// DELETE MEMBER
router.delete(
    "/:id",
    isLoggedIn,
    requirePermission("manageMembers"),
    remove
);


module.exports = router;