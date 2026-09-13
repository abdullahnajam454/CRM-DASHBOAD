const redis  = require("../config/redis")

const clearLeadSearchCache = async (organizationId) => {



const pattern = `lead:search:${organizationId}*`

let cursor = "0"

do{
    const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern
    )
    cursor = nextCursor

    if(keys.length>0) {
       await redis.del(...keys)

    }

}while(cursor!=="0")
}

module.exports = clearLeadSearchCache