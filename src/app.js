import Express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = Express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// json ki limit set kri hae
app.use(express.json({limit: "16kb"}))
// URL se data aae tb
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// to store files, folders, images etc.
app.use(express.static("public"))
app.use(cookieParser())

export { app }