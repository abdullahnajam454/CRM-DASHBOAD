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


// CREATE MEMBER
router.post(
    "/",
    isLoggedIn,
    create
);


// GET ALL MEMBERS
router.get(
    "/",
    isLoggedIn,
    getAll
);


// UPDATE MEMBER
router.patch(
    "/:id",
    isLoggedIn,
    update
);


// DELETE MEMBER
router.delete(
    "/:id",
    isLoggedIn,
    remove
);


module.exports = router;