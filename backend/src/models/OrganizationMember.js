const mongoose = require("mongoose");

const organizationMemberSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true
        },

        role: {
            type: String,
            enum: ["owner", "admin", "member"],
            default: "member"
        },

        permissions: {
            viewLeads: {
                type: Boolean,
                default: true
            },

            createLeads: {
                type: Boolean,
                default: true
            },

            updateLeads: {
                type: Boolean,
                default: true
            },

            deleteLeads: {
                type: Boolean,
                default: false
            },

            manageMembers: {
                type: Boolean,
                default: false
            }
        }
    },
    {
        timestamps: true
    }
);


// Same user cannot join
// the same organization twice
organizationMemberSchema.index(
    {
        userId: 1,
        organizationId: 1
    },
    {
        unique: true
    }
);


const OrganizationMember =
    mongoose.model(
        "OrganizationMember",
        organizationMemberSchema
    );


module.exports = OrganizationMember;