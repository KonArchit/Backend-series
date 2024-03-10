// require('dotenv').config({path: './env'}) 
import dotenv from 'dotenv'
import connectDB from './db/index.js';

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("ERROR: ", error);
        throw error
    })
    // app.listen isliye kra hae kyu ki abhi database ka use krte hue listen krna start nhi kia (server create kra hae) 
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server running on port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO DB Connection failed !!! ", err)
})



/*
import Express from 'express';
const app = Express()

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERROR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error) 
        throw err
    }
})()
*/