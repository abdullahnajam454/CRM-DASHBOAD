const User = require("../models/User");
const Organization = require("../models/Organization");
const OrganizationMember = require("../models/OrganizationMember");

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");


const registerUser = async (
    name,
    email,
    password
) => {

    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }


    const session = await mongoose.startSession();

    try {

        session.startTransaction();


        // 1. Check existing user
        const existingUser = await User
            .findOne({ email })
            .session(session);

        if (existingUser) {
            throw new Error("Email already exists");
        }


        // 2. Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // 3. Create user
        const users = await User.create(
            [
                {
                    name,
                    email,
                    password: hashedPassword
                }
            ],
            { session }
        );

        const newUser = users[0];


        // 4. Create organization
        const organizations =
            await Organization.create(
                [
                    {
                        name: `${name}'s Organization`,

                        slug:
                            `${name
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                            }-${newUser._id}`,

                        createdBy: newUser._id
                    }
                ],
                { session }
            );

        const newOrganization =
            organizations[0];


        // 5. Connect user with organization
        newUser.organizationId =
            newOrganization._id;

        await newUser.save({ session });


        // 6. Create organization membership
        await OrganizationMember.create(
            [
                {
                    userId: newUser._id,

                    organizationId:
                        newOrganization._id,

                    role: "owner",

                    permissions: {
                        viewLeads: true,
                        createLeads: true,
                        updateLeads: true,
                        deleteLeads: true,
                        manageMembers: true
                    }
                }
            ],
            { session }
        );


        // 7. Commit transaction
        await session.commitTransaction();


        // Don't return password
        newUser.password = undefined;


        return {
            user: newUser,
            organization: newOrganization
        };


    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        await session.endSession();
    }
};


module.exports = {
    registerUser
};