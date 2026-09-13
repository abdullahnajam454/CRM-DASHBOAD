const user = require("../models/User")
const organization = require("../models/Organization")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

const registerUser = async (name, email, password) => {

    if (!name || !email || !password) {
        throw new Error("All field must be required")
    }

    const session = await mongoose.startSession()

    try{

    session.startTransaction()

    const isExist = await user.findOne({ email }).session(session)
    if (isExist) {
        throw new Error("Email already exist")
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const newuser = await user.create(
        [{
        name,
        email,
        password: hashPassword
    }],
    {session}
)

    const newOrganization = await organization.create(
        [{
        name: `${name}'s Organization`,
        slug: `${name.toLowerCase().replace(/\s+/g, "-")}-${newuser[0]._id}`,
        createdBy: newuser[0]._id
    }],{session}
)

    newuser[0].organizationId = newOrganization[0]._id;
    await newuser[0].save({session})

    await session.commitTransaction()

    newuser[0].password = undefined
    return { newuser:newuser[0], newOrganization:newOrganization[0] }
    }
    catch(error){
        await session.abortTransaction()
        throw error
    }finally{
        await session.endSession()
    }
}

module.exports = { registerUser }