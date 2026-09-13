const redis = require("../config/redis")

const rateLimiter = async (req, res, next) => {
    try {
        
    
    const ip = req.ip

    const key = `rate:${ip}`
    
    const limit  = 20

    const count = await redis.incr(key)

    if(count ===1){
        await redis.expire(key, 60)
    }

    if(count > limit){
        return res.status(429).json({
            success: false,
            message : "Too many request",
        })
    }
    next()
} catch (error) {
        console.error("Rate limiter error:", error);

        next();
    }

}

module.exports = rateLimiter