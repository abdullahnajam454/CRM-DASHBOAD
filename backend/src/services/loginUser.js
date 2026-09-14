const User = require("../models/User");
const OrganizationMember = require("../models/OrganizationMember");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const loginUser = async (email, password) => {

    // 1. Validate
    if (!email || !password) {
        throw new Error("All fields are required");
    }


    // 2. Find user
    const existingUser = await User
        .findOne({ email })
        .select("+password");


    if (!existingUser) {
        throw new Error("Email or Password is invalid");
    }


    // 3. Compare password
    const isMatch = await bcrypt.compare(
        password,
        existingUser.password
    );


    if (!isMatch) {
        throw new Error("Email or Password is invalid");
    }


    // 4. Find organization membership
    const membership =
        await OrganizationMember.findOne({
            userId: existingUser._id
        });


    if (!membership) {
        throw new Error(
            "User is not a member of any organization"
        );
    }


    // 5. Create JWT
    const token = jwt.sign(
        {
            userId: existingUser._id,

            organizationId:
                membership.organizationId,

            role:
                membership.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "1d"
        }
    );


    // 6. Remove password
    existingUser.password = undefined;


    // 7. Return
    return {
        token,
        user: existingUser
    };
};


module.exports = {
    loginUser
};