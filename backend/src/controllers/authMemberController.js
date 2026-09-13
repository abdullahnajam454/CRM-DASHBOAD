const createMember = require("../services/authMember");

const userCreate = async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        console.log("OWNER ID:", req.userId);
        console.log("ORGANIZATION ID:", req.organizationId);

        const member = await createMember(
            name,
            email,
            password,
            role,
            req.userId,
            req.organizationId
        );

        return res.status(201).json({
            success: true,
            message: "Member created successfully",
            member
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error while creating member",
            error: error.message
        });
    }
};

module.exports = userCreate;
