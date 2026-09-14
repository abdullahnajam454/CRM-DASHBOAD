const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")

const dotenv = require("dotenv")
const redis = require("./src/config/redis")
const connectDB = require("./src/config/db")
const router = require("./src/routes/authRoutes")
const leadRouter = require("./src/routes/leadRoutes")
const memberRouter = require("./src/routes/memberRoutes");

dotenv.config()

connectDB()

app.use(cookieParser())
app.use(express.json())

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", router)
app.use("/api/leads", leadRouter)
app.use("/api/members", memberRouter);

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})