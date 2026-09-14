const jwt = require("jsonwebtoken");


const isLoggedIn = (req, res, next) => {

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