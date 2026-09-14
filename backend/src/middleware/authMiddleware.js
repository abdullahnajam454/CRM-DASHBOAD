const jwt = require("jsonwebtoken");
const OrganizationMember = require("../models/OrganizationMember");


const isLoggedIn = async (req, res, next) => {

    try {

        const token =
            req.cookies.token;


        if (!token) {
            return res.status(401).json({
                message: "Please login first",
                success: false
            });
        }


        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        req.userId =
            decoded.userId;


        req.organizationId =
            decoded.organizationId;


        req.role =
            decoded.role;

        const membership = await OrganizationMember.findOne({
            userId: decoded.userId,
            organizationId: decoded.organizationId
        }).select("role permissions");

        if (!membership) {
            return res.status(403).json({
                message: "Organization membership not found",
                success: false
            });
        }

        req.role = membership.role;
        req.permissions = membership.permissions;


        next();


    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
};


module.exports = {
    isLoggedIn
};