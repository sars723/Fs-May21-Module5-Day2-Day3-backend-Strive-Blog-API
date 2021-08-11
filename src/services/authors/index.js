import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
/* import path,{dirname} from "path" */
import fs from "fs"
import uniqid from "uniqid"
const authorsRouter = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
console.log(currentFilePath)
const currentDirPath = dirname(currentFilePath)
console.log(currentDirPath)
const authorsJSONPath = join(currentDirPath, "authors.json")
/* const authorsJSONPath=path.join(currentDirPath,"authors.json") */
console.log(authorsJSONPath)

//create author
authorsRouter.post("/", (request, response) => {
    console.log(request.body.email)
    try {

        const { name, surname, email, dateOfBirth } = request.body
        const author = {
            id: uniqid(),
            name,
            surname,
            email,
            dateOfBirth,
            "avatar": `https://eu.ui-avatars.com/api/?name=${name}+${surname}`,
            createdAt: new Date(),
            updatedAt: new Date(),


        }
        /* const newAuthor = { ...request.body, id: uniqid(), createdAt: new Date() } */
        const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
        /* authors.push(newAuthor) */
        const newEmail = author.email
        const emailAlreadyExist = authors.find(author => author.email === newEmail)
        if (emailAlreadyExist) {
            response.send("email already exist")
        } else {
            authors.push(author)
            fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
            /* response.status(201).send({ id: newAuthor.id }) */
            response.status(201).send(author)
        }

    } catch (error) {
        response.send(500).send({ message: error.message })
    }
})

//get all authors
authorsRouter.get("/", (request, response) => {
    try {
        const fileContent = fs.readFileSync(authorsJSONPath)
        /*  const fileAsBuffer = fs.readFileSync(authorsJSONPath) */
        /* const fileAsString=fileContent.toString() */
        /*  const fileAsJson=JSON.parse(fileAsString) */
        response.send(JSON.parse(fileContent))
    } catch (error) {
        response.send(500).send({ message: error.message })
    }

})

//get one specific author
authorsRouter.get("/:authorID", (request, response) => {
    try {
        const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
        console.log("author ID: ", request.params.authorID)
        const author = authors.find(author => author.id === request.params.authorID)
        if (!author) {
            response.status(400).send({ message: `Author with ${request.params.id} is not found!` })
        } else {
            response.send(author)
        }

    } catch (error) {
        response.send(500).send({ message: error.message })
    }
})

//update author
authorsRouter.put("/:authorID", (request, response) => {
    try {
        const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
        const remainingAuthors = authors.filter(author => author.id !== request.params.authorID)
        const authorIndex = authors.findIndex(author => author.id === request.params.id)
        if (authorIndex == -1) {
            response.status(400).send({ message: `Author with ${request.params.id} is not found!` })
        }
        const previousAutorData = authors[authorIndex]
        const changedAuthor = { ...previousAutorData, ...request.body, updatedAt: new Date(), id: request.params.id }

        const checkEmail = remainingAuthors.find(author => author.email === changedAuthor.email)
        if (checkEmail) {
            response.send("email exist")
        }
        else {
            /* const updatedAuthor = { ...request.body, id: request.params.authorID } */
            authors[authorIndex] = changedAuthor;

            /*      remainingAuthors.push(updatedAuthor) */
            fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
            response.send(changedAuthor)
        }

    } catch (error) {
        response.send(500).send({ message: error.message })
    }
})

//delete author
authorsRouter.delete("/:authorID", (request, response) => {
    try {
        const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
        const author = authors.find(author => author.id === request.params.authorID)
        if (!author) {
            response.status(400).send({ message: `Author with ${request.params.id} is not found!` })
        } else {
            const remainingAuthors = authors.filter(author => author.id !== request.params.authorID)
            fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
            response.status(204).send()
        }

    } catch (error) {
        response.send(500).send({ message: error.message })
    }
})
export default authorsRouter