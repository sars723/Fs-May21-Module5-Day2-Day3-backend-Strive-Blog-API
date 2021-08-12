import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./services/authors/index.js"
import blogsRouter from "./services/blogs/index.js"
import filesRouter from "./services/files/index.js"
import { notFoundErrorHandler, forbiddenErrorHandler, badRequestErrorHandler, genericServerErrorHandler } from "./errorHandlers.js"
import { join } from "path"
const server = express()

const port = 3001

const publicFolderPath = join(process.cwd(), "public")

server.use(express.static(publicFolderPath))
server.use(cors())
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

