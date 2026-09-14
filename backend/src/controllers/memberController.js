const {
    createMember,
    getMembers,
    updateMember,
    deleteMember
} = require("../services/memberService");


// CREATE MEMBER
const create = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        const result = await createMember(
            req.userId,
            req.organizationId,
            name,
            email,
            password,
            role
        );


        return res.status(201).json({
            success: true,
            message: "Member created successfully",
            user: result.user,
            membership: result.membership
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// GET MEMBERS
const getAll = async (req, res) => {

    try {

        const members =
            await getMembers(
                req.organizationId
            );


        return res.status(200).json({
            success: true,
            message: "Members fetched successfully",
            members
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE MEMBER
const update = async (req, res) => {

    try {

        const {
            role,
            permissions
        } = req.body;


        const member =
            await updateMember(
                req.userId,
                req.organizationId,
                req.params.id,
                role,
                permissions
            );


        return res.status(200).json({
            success: true,
            message: "Member updated successfully",
            member
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE MEMBER
const remove = async (req, res) => {

    try {

        const member =
            await deleteMember(
                req.userId,
                req.organizationId,
                req.params.id
            );


        return res.status(200).json({
            success: true,
            message: "Member deleted successfully",
            member
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    create,
    getAll,
    update,
    remove
};