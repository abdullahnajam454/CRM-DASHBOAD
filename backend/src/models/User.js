const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email:{
        type : String,
        required: true,
        lowercase : true,
        unique : true
    },
    password : {
        type: String,
        required :true,
        select: false
    },
    role : {
        type : String,
        enum: ["owner","manager", "member"],
        default: "owner"
    },
    organizationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Organization"
    }
}, {timestamps: true})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel
