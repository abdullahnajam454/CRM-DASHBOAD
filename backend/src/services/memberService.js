const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const OrganizationMember = require("../models/OrganizationMember");


const getDefaultPermissions = (role) => {

    if (role === "owner") {
        return {
            viewLeads: true,
            createLeads: true,
            updateLeads: true,
            deleteLeads: true,
            manageMembers: true
        };
    }

    if (role === "admin") {
        return {
            viewLeads: true,
            createLeads: true,
            updateLeads: true,
            deleteLeads: true,
            manageMembers: true
        };
    }

    return {
        viewLeads: true,
        createLeads: true,
        updateLeads: true,
        deleteLeads: false,
        manageMembers: false
    };
};


// CREATE MEMBER
const createMember = async (
    creatorUserId,
    organizationId,
    name,
    email,
    password,
    role
) => {

    if (!name || !email || !password || !role) {
        throw new Error("All fields are required");
    }

    // Check creator membership
    const creatorMembership =
        await OrganizationMember.findOne({
            userId: creatorUserId,
            organizationId
        });

    if (!creatorMembership) {
        throw new Error("You are not a member of this organization");
    }

    // Owner can create admin/member
    if (creatorMembership.role === "owner") {

        if (!["admin", "member"].includes(role)) {
            throw new Error(
                "Owner can only create admin or member"
            );
        }
    }

    // Admin can only create member
    else if (creatorMembership.role === "admin") {

        if (role !== "member") {
            throw new Error(
                "Admin can only create members"
            );
        }
    }

    // Member cannot create
    else {
        throw new Error(
            "You don't have permission to create members"
        );
    }


    // Check email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error(
            "A user with this email already exists"
        );
    }


    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            organizationId
        });

        await newUser.save({ session });


        // Create membership
        const membership =
            new OrganizationMember({
                userId: newUser._id,
                organizationId,
                role,
                permissions: getDefaultPermissions(role)
            });

        await membership.save({ session });


        await session.commitTransaction();


        newUser.password = undefined;


        return {
            user: newUser,
            membership
        };

    } catch (error) {

        await session.abortTransaction();
        throw error;

    } finally {

        await session.endSession();
    }
};


// GET MEMBERS
const getMembers = async (organizationId) => {

    const members =
        await OrganizationMember.find({
            organizationId
        })
        .populate(
            "userId",
            "name email createdAt"
        )
        .sort({
            createdAt: -1
        });

    return members;
};


// UPDATE MEMBER
const updateMember = async (
    creatorUserId,
    organizationId,
    memberId,
    role,
    permissions
) => {

    const creatorMembership =
        await OrganizationMember.findOne({
            userId: creatorUserId,
            organizationId
        });

    if (!creatorMembership) {
        throw new Error(
            "You are not a member of this organization"
        );
    }


    const targetMember =
        await OrganizationMember.findOne({
            _id: memberId,
            organizationId
        });

    if (!targetMember) {
        throw new Error("Member not found");
    }


    // Nobody can modify owner
    if (targetMember.role === "owner") {

        throw new Error(
            "Owner cannot be modified"
        );
    }


    // MEMBER cannot update
    if (creatorMembership.role === "member") {

        throw new Error(
            "You don't have permission to update members"
        );
    }


    // ADMIN restrictions
    if (creatorMembership.role === "admin") {

        // Admin cannot change role
        if (role && role !== "member") {
            throw new Error(
                "Admin can only keep member role"
            );
        }

        // Admin cannot update another admin
        if (targetMember.role === "admin") {
            throw new Error(
                "Admin cannot modify another admin"
            );
        }
    }


    // OWNER can change role
    if (role) {

        if (!["admin", "member"].includes(role)) {
            throw new Error(
                "Invalid role"
            );
        }

        targetMember.role = role;

        // Reset permissions according to new role
        targetMember.permissions =
            getDefaultPermissions(role);
    }


    // Custom permissions
    if (permissions) {

        // Only owner can customize permissions
        if (creatorMembership.role !== "owner") {
            throw new Error(
                "Only owner can update permissions"
            );
        }

        targetMember.permissions = {
            ...targetMember.permissions,
            ...permissions
        };
    }


    await targetMember.save();

    return targetMember;
};


// DELETE MEMBER
const deleteMember = async (
    creatorUserId,
    organizationId,
    memberId
) => {

    const creatorMembership =
        await OrganizationMember.findOne({
            userId: creatorUserId,
            organizationId
        });

    if (!creatorMembership) {
        throw new Error(
            "You are not a member of this organization"
        );
    }


    const targetMember =
        await OrganizationMember.findOne({
            _id: memberId,
            organizationId
        });

    if (!targetMember) {
        throw new Error("Member not found");
    }


    // Nobody can delete owner
    if (targetMember.role === "owner") {
        throw new Error(
            "Owner cannot be deleted"
        );
    }


    // Only owner can delete admin
    if (
        targetMember.role === "admin" &&
        creatorMembership.role !== "owner"
    ) {
        throw new Error(
            "Only owner can delete an admin"
        );
    }


    // Member cannot delete
    if (creatorMembership.role === "member") {
        throw new Error(
            "You don't have permission to delete members"
        );
    }


    await OrganizationMember.findByIdAndDelete(
        memberId
    );


    const remainingMemberships = await OrganizationMember.countDocuments({
        userId: targetMember.userId
    });

    if (remainingMemberships === 0) {
        await User.findByIdAndDelete(targetMember.userId);
    }


    return targetMember;
};


module.exports = {
    createMember,
    getMembers,
    updateMember,
    deleteMember
};
