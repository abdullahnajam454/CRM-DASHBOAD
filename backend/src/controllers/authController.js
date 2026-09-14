const {registerUser} = require("../services/authService")
const {loginUser} = require("../services/loginUser")
const User = require("../models/User")

const register = async (req, res)=>{
    try {
    
const {name, email, password} = req.body

const user = await registerUser(name, email, password)

return res.status(201).json({
    message : "User created successfully",
    success : true,
    user
})
   
    } catch (error) {
        return res.status(400).json({
            message : "server error while creating user",
            success : false,
            error: error.message
            
        })
    }
}

const login = async (req, res)=> {
    try {
        const {email, password} = req.body

        const {token, user} = await loginUser(email, password)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });


        return res.status(200).json({
            message : "Login successfully",
            success : true,
            user
        })
    } catch (error) {
        return res.status(400).json({
            message : "Something went wrong while login",
            success : false,
            error : error.message
        })
    }
}

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    return res.status(200).json({
        message: "Logout successful",
        success: true
    });
};

const me = async (req, res) => {
    const user = await User.findById(req.userId).select("name email organizationId createdAt");

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    }

    return res.status(200).json({
        success: true,
        user,
        role: req.role,
        permissions: req.permissions
    });
};

module.exports = {register, login, logout, me}