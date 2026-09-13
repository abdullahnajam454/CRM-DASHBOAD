const User = require("../models/User");
const OrganizationMember = require("../models/OrganizationMember");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const createMember = async (
    name,
    email,
    password,
    role,
    ownerId,
    organizationId
) => {

    // 1. Validate fields
    if (!name || !email || !password || !role) {
        throw new Error("All fields are required");
    }

    // 2. Start session
    const session = await mongoose.startSession();

    try {

        // 3. Start transaction
        session.startTransaction();

        // 4. Check if user already exists
        const existingUser = await User
            .findOne({ email })
            .session(session);

        if (existingUser) {
            throw new Error("Email already exists");
        }

        // 5. Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // 6. Create User
        const newUser = await User.create(
            [{
                name,
                email,
                password: hashPassword,
                role
            }],
            { session }
        );

        // 7. Create OrganizationMember
        const member = await OrganizationMember.create(
            [{
                userId: newUser[0]._id,
                ownerId,
                organizationId
            }],
            { session }
        );

        // 8. Commit transaction
        await session.commitTransaction();

        // 9. Return created member
        return member[0];

    } catch (error) {

        // 10. Rollback everything
        await session.abortTransaction();

        throw error;

    } finally {

        // 11. Close session
        await session.endSession();
    }
};

module.exports = createMember;
