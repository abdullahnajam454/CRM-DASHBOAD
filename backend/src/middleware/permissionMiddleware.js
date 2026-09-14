const requirePermission = (permission) => (req, res, next) => {
    if (!req.permissions?.[permission]) {
        return res.status(403).json({
            success: false,
            message: "You don't have permission"
        });
    }

    next();
};

module.exports = { requirePermission };