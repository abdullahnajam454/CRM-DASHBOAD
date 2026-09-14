const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            lowercase: true,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        source: {
            type: String,
            enum: [
                "website",
                "referral",
                "linkedin",
                "cold-call",
                "other"
            ],
            default: "website"
        },

        stage: {
            type: String,
            enum: [
                "new",
                "qualified",
                "proposal",
                "won",
                "lost"
            ],
            default: "new"
        },

        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high"
            ],
            default: "low"
        },

        dealValue: {
            type: Number,
            default: 0,
            min: 0
        },

        organizationId: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Organization",
            required : true
        }
    },
    {
        timestamps: true
    }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
