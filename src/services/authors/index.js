import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"
import uniqid from "uniqid"
const authorsRouter = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = dirname(currentFilePath)
const authorsJSONPath = join(currentDirPath, "authors.json")
authorsRouter.post("/", (request, response) => {

    const newAuthor = { ...request.body, id: uniqid(), createdAt: new Date() }
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    authors.push(newAuthor)
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
    response.status(201).send({ id: newAuthor.id })
})
authorsRouter.get("/", (request, response) => {
    const fileContent = fs.readFileSync(authorsJSONPath)
    response.send(JSON.parse(fileContent))

})
authorsRouter.get("/:studentID", (request, response) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    console.log("author ID: ", request.params.authorID)
    const student = authors.find(author => author.id === request.params.authorID)
    response.send(student)
})
authorsRouter.put("/:authorID", (request, response) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    const remainingAuthors = authors.filter(author => author.id !== request.params.authorID)

    const updatedAuthor = { ...request.body, id: request.params.authorID }

    remainingAuthors.push(updatedAuthor)
    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
    response.send(updatedAuthor)
})
authorsRouter.delete("/:authorID", (request, response) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    const remainingAuthors = authors.filter(author => author.id !== request.params.authorID)
    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
    response.status(204).send("deleted")
})
export default authorsRouter