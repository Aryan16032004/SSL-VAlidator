import express from "express"
import dotenv from "dotenv"

dotenv.config({
        path:"./.env"
})
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))



import { router } from "./Router/user.router.js"

app.use("/api",router)

export {app}