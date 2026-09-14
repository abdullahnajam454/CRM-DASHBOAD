const {createLead, getAllLeads, getLeadById, updateLead, deleteLead, searchAndFilterLeads, getLeadStats} = require("../services/leadService")

const redis = require("../config/redis")

const clearLeadSearchCache = require("../helpers/cacheHelper")

const create = async (req, res) => {
    try {
    
    const leadData = req.body

    const lead = await createLead(
        leadData,
        req.organizationId
    )
    const cacheKey = `lead:stats:${req.organizationId}`
        await redis.del(cacheKey)

        await clearLeadSearchCache(req.organizationId)

    return res.status(201).json({
        message : "Lead created successfully",
        success : true,
        lead
    })
        
    } catch (error) {
        return res.status(400).json({
            message : "Error while creating Lead",
            success : false,
            error : error.message
        })
    }
}

const getAll = async (req, res)=>{
    try {
    
    const leads = await getAllLeads(req.organizationId)

    return res.status(200).json({
        message : "Leads fetched successfully",
        success : true,
        leads
    })
     
    } catch (error) {
        return res.status(400).json({
            message : "Error while getting leads",
            success : false,
            error : error.message
        })
    }
}

const getOne = async (req, res)=> {
    try {
      
    const lead = await getLeadById(req.params.id, req.organizationId)

    return res.status(200).json({
        message : "Lead fetch successfully",
        success : true,
        lead
    })
      
    } catch (error) {
        return res.status(400).json({
            message : "Error while fetch lead",
            error : error.message
        })
    }
}

const update = async (req, res)=> {
try {

    const lead = await updateLead(req.params.id, 
        req.organizationId,
        req.body,
    )
    const cacheKey = `lead:stats:${req.organizationId}`
    await redis.del(cacheKey)

    await clearLeadSearchCache(req.organizationId)

    return res.status(200).json({
        message : "Lead updated successfully",
        success : true,
        lead
    })
     
} catch (error) {
    return res.status(400).json({
        message : "Error while updating the lead",
        success : false,
        error : error.message
    })
}
}

const deletedLead = async (req, res)=> {

    try {
     
    const lead = await deleteLead(req.params.id, req.organizationId)

    const cacheKey = `lead:stats:${req.organizationId}`
        await redis.del(cacheKey)

        await clearLeadSearchCache(req.organizationId)

    return res.status(200).json({
        message : "Lead deleted successfully",
        success: true,
        lead
    })
       
    } catch (error) {
        return res.status(400).json({
            message : "Error while deleting the lead",
            success : false,
            error : error.message
        })
    }
}

const searchAndFilter = async (req, res) =>{
    try {

        const cacheKey = `lead:search:${req.organizationId}:${JSON.stringify(req.query)}`

        const cachedSearch = await redis.get(cacheKey)

        if(cachedSearch){
            return res.status(200).json({
                success : true,
                ...JSON.parse(cachedSearch)
            })
        }
        const result = await searchAndFilterLeads(req.organizationId, req.query)

        await redis.set(
            cacheKey,
            JSON.stringify(result),
            "EX",
            120
        )

        return res.status(200).json({
            message : "Leads fetched successfully",
            success : true,
            count : result.leads.length,
            ...result
        })
    } catch (error) {
        return res.status(400).json({
            message : "Error while searching leads",
            success : false,
            error: error.message
        })
    }
}

const getStats = async (req,res)=> {
try {

    const cacheKey = `lead:stats:${req.organizationId}`

    const cachedStats = await redis.get(cacheKey)

    if(cachedStats){

        return res.status(200).json({
            success: true,
            ...JSON.parse(cachedStats),
        })
    }
  
    const stats = await getLeadStats(req.organizationId)

    await redis.set(
        cacheKey,
        JSON.stringify(stats),
        "EX",
        60
    )
    return res.status(200).json({
        message : "Lead statistics fetched successfully",
        success : true,
        ...stats
    })
      
} catch (error) {
    return res.status(400).json({
        message : "Error while fetching lead statistics",
        success : false,
        error : error.message
    })
}
}

module.exports = {create, getAll, getOne, update, deletedLead, searchAndFilter, getStats}