const Redis = require("ioredis")

const url = process.env.REDIS_URL

const redis = new Redis(url)

redis.on("connect", ()=> {
    console.log("Redis Connected successfully ")
})

redis.on("error", (error)=> {
    console.log("Redis connection error:", error)
})

module.exports = redis