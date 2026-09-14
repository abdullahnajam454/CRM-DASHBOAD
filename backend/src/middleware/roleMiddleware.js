const requireRole = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.role) {
            return res.status(403).json({
                success: false,
                message: "Role not found"
            });
        }


        if (!allowedRoles.includes(req.role)) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission"
            });
        }


        next();
    };
};


module.exports = {
    requireRole
};