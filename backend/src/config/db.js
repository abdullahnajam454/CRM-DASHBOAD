const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const url = process.env.MONGO_URI

        if (!url) {
            throw new Error("MongoDB URL is not coming from dotenv");
        }
        await mongoose.connect(url)
        
        console.log("MongoDb is  connected successfully")
    } catch (error) {
        console.error("MongoDB connection failed", error.message)
        process.exit(1)
    }
}

module.exports = connectDB