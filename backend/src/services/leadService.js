const Lead = require("../models/Lead")
const mongoose = require("mongoose")

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const createLead = async (leadData, organizationId) => {

    const newLead = await Lead.create({
        ...leadData,
        organizationId: organizationId
    })
    return newLead
}

const getAllLeads = async (organizationId) => {
    const leads = await Lead.find({ organizationId: organizationId })

    return leads
}

const getLeadById = async (leadId, organizationId) => {

    const getOneLead = await Lead.findOne({
        _id: leadId,
        organizationId: organizationId
    })
    return getOneLead
}

const updateLead = async (leadId, organizationId, leadData) => {

    const allowedFields = [
        "name", "email", "phone", "company", "source", "stage",
        "priority", "dealValue"
    ];
    const safeLeadData = Object.fromEntries(
        allowedFields
            .filter((field) => leadData[field] !== undefined)
            .map((field) => [field, leadData[field]])
    );

    const updatedLead = await Lead.findOneAndUpdate({
        _id: leadId,
        organizationId: organizationId
    }, safeLeadData, { new: true, runValidators: true })

    if (!updatedLead) {
        throw new Error("Lead not found or you are not the owner");
    }

    return updatedLead

}

const deleteLead = async (leadId, organizationId) => {
    const deletedLead = await Lead.findOneAndDelete({
        _id: leadId,
        organizationId : organizationId
    })

    if (!deletedLead) {
        throw new Error("Lead not found or you are not the owner")
    }
    return deletedLead
}

const searchAndFilterLeads = async (organizationId, queryParams) => {

    const { search, stage, priority, source, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = queryParams

    const filter = {
        organizationId: organizationId
    }

    if (search) {
        const safeSearch = escapeRegex(String(search).slice(0, 100))
        filter.$or = [
            { name: { $regex: safeSearch, $options: "i" } },
            { email: { $regex: safeSearch, $options: "i" } },
            { company: { $regex: safeSearch, $options: "i" } }
        ]
    }

    if (stage) {
        filter.stage = stage
    }

    if (priority) {
        filter.priority = priority
    }

    if (source) {
        filter.source = source
    }

    const pageNumber = Math.max(1, Number.isFinite(Number(page)) ? Number(page) : 1)
    const limitNumber = Math.min(100, Math.max(1, Number.isFinite(Number(limit)) ? Number(limit) : 10))
    const skip = (pageNumber - 1) * limitNumber
    const sortOrder = order === "asc" ? 1 : -1

    const allowedSortFields = ["createdAt", "name", "company", "dealValue", "stage", "priority"]
    const sort = { [allowedSortFields.includes(sortBy) ? sortBy : "createdAt"]: sortOrder }


    const leads = await Lead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)

    const totalLeads = await Lead.countDocuments(filter)

    return {
        leads,
        totalLeads,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalLeads / limitNumber)
    }
}

const getLeadStats = async (organizationId) => {

    const stats = await Lead.aggregate([
        {
            $match: {
                organizationId: new mongoose.Types.ObjectId(organizationId)
            }
        },
        {
            $facet: {
                totalStats: [
                    {
                        $count: "totalLeads"
                    }
                ],
                stageStats: [
                    {
                        $group: {
                            _id: "$stage",
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                sourceStats: [
                    {
                        $group: {
                            _id: "$source",
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                priorityStats: [
                    {
                        $group: {
                            _id: "$priority",
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                dealStats: [
                    {
                        $group: {
                            _id: null,

                            totalDealValue: {
                                $sum: "$dealValue"
                            },

                            averageDealValue: {
                                $avg: "$dealValue"
                            }
                        }
                    }
                ]
            }
        }
    ])

    // GET AGGREGATION RESULT

    const result = stats[0]

    //totalLeads

    const totalLeads = result.totalStats[0]?.totalLeads || 0



    // STAGE STATISTICS

    const stageStatistics = {}

    result.stageStats.forEach((item) => {
        stageStatistics[item._id] = item.count
    })

    // SOURCE STATISTICS

    const sourceStatistics = {}

    result.sourceStats.forEach((item) => {
        sourceStatistics[item._id] = item.count
    })

    // PRIORITY STATISTICS

    const priorityStatistics = {}

    result.priorityStats.forEach((item) => {
        priorityStatistics[item._id] = item.count
    })

    // DEAL STATISTICS

    const totalDealValue =
        result.dealStats[0]?.totalDealValue || 0;

    const averageDealValue =
        result.dealStats[0]?.averageDealValue || 0;

    // WON LEADS

        const wonLeads =
        stageStatistics.won || 0;

    // CONVERSION RATE

    const conversionRate =
        totalLeads > 0
            ? Number(
                ((wonLeads / totalLeads) * 100)
            )
            : 0;


    // RETURN RESULT

    return {

        totalLeads,

        stageStatistics,

        sourceStatistics,

        priorityStatistics,

        totalDealValue,

        averageDealValue,

        conversionRate

    };
}

module.exports = { createLead, getAllLeads, getLeadById, updateLead, deleteLead, searchAndFilterLeads, getLeadStats }