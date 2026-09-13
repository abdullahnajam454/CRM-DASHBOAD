const {registerUser} = require("../services/authService")
const {loginUser} = require("../services/loginUser")

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

module.exports = {register, login}