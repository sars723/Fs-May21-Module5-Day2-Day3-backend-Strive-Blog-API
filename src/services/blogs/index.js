import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import uniqid from "uniqid"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"

import { blogsValidationMiddleware } from "./validation.js"
const blogsRouter = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)

const currentDirPath = dirname(currentFilePath)

const blogsJSONPath = join(currentDirPath, "blogs.json")

blogsRouter.get("/", (req, res, next) => {
    try {

        const blogs = JSON.parse(fs.readFileSync(blogsJSONPath))
        console.log(blogs)
        res.send(blogs)

    } catch (error) {
        next(error)
    }
})

blogsRouter.post("/", blogsValidationMiddleware, (req, res, next) => {
    try {
        const errorsList = validationResult(req)
        if (!errorsList.isEmpty()) {

            next(createHttpError(400, { errorsList }))
        } else {

            /* 
                        const {
                            category,
                            title,
                            cover,
                            readTime: {
                                value,
                                unit
                            },
                            author: {
                                name,
                                avatar
                            },
                            content } = req.body
            
                        const blog = {
                            id: uniqid(),
                            category,
                            title,
                            cover,
                            readTime: {
                                value,
                                unit
                            },
                            author: {
                                name,
                                "avatar": `https://eu.ui-avatars.com/api`,
                            },
                            content,
            
                            createdAt: new Date(),
                            updatedAt: new Date(),
            
            
                        } */
            const newBlog = { ...req.body, id: uniqid(), createdAt: new Date() }
            const blogs = JSON.parse(fs.readFileSync(blogsJSONPath))
            blogs.push(newBlog)
            fs.writeFileSync(blogsJSONPath, JSON.stringify(blogs))
            res.status(201).send(newBlog)
        }
    } catch (error) {
        next(error)
    }
})


blogsRouter.get("/:blogID", (req, res, next) => {
    try {

        const blogs = JSON.parse(fs.readFileSync(blogsJSONPath))

        const blog = blogs.find(s => s.id === req.params.blogID)

        if (blog) {

            res.send(blog)
        } else {
            next(createHttpError(404, `blog with id ${req.params.blogID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})


blogsRouter.put("/:blogID", (req, res, next) => {
    try {

        const blogs = JSON.parse(fs.readFileSync(blogsJSONPath))


        const remainingblogs = blogs.filter(blog => blog.id !== req.params.blogID)

        const updatedblog = { ...req.body, id: req.params.blogID }

        remainingblogs.push(updatedblog)


        fs.writeFileSync(blogsJSONPath, JSON.stringify(remainingblogs))

        res.send(updatedblog)
    } catch (error) {
        next(error)
    }
})


blogsRouter.delete("/:blogID", (req, res, next) => {
    try {

        const blogs = JSON.parse(fs.readFileSync(blogsJSONPath))

        const remainingblogs = blogs.filter(blog => blog.id !== req.params.blogID)

        fs.writeFileSync(blogsJSONPath, JSON.stringify(remainingblogs))

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default blogsRouter