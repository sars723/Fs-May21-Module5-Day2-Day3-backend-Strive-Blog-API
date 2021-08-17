import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./services/authors/index.js"
import blogsRouter from "./services/blogs/index.js"
import filesRouter from "./services/files/index.js"
import { notFoundErrorHandler, forbiddenErrorHandler, badRequestErrorHandler, genericServerErrorHandler } from "./errorHandlers.js"
import { join } from "path"
const server = express()

const port = process.env.PORT

const publicFolderPath = join(process.cwd(), "public")

const whiteList=[process.env.FE_DEV_URL]

const corsOpts={origin:function(origin,next){
    console.log("ORIGIN-->",origin)
    if(whiteList.indexOf(origin)!==-1){
        next(null,true)
    }
    else{
        next(new Error(`Origin with ${origin} not allowed!`))
    }
}}


server.use(express.static(publicFolderPath))
server.use(cors(corsOpts))
server.use(express.json())

server.use("/authors", authorsRouter)//to let server know about router

server.use("/blogs", blogsRouter)

server.use("/files", filesRouter)


server.use(notFoundErrorHandler)
server.use(badRequestErrorHandler)
server.use(forbiddenErrorHandler)
server.use(genericServerErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log("Server listening on port " + port)
})

