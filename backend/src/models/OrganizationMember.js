const mongoose = require("mongoose");

const organizationMemberSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true 
        },

        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            // required: true 
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "OrganizationMember",
    organizationMemberSchema
);
