import express from 'express'
/* import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs' */
import uniqid from "uniqid"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import { getBlogs, writeBlogs } from '../../lib/fs-tools.js'

import { /* blogsValidationMiddleware */checkBlogPostSchema, checkValidationResult } from "./validation.js"


const blogsRouter = express.Router()

/* const currentFilePath = fileURLToPath(import.meta.url)

const currentDirPath = dirname(currentFilePath)

const blogsJSONPath = join(currentDirPath, "blogs.json") */

blogsRouter.get("/", async (req, res, next) => {
    try {

        /*   const blogs = JSON.parse(fs.readFileSync(blogsJSONPath)) */
        const blogs = await getBlogs()
        console.log(blogs)
        res.send(blogs)

    } catch (error) {
        next(error)
    }
})

blogsRouter.post("/", /* blogsValidationMiddleware */checkValidationResult, checkValidationResult, async (req, res, next) => {
    try {
        const errorsList = validationResult(req)
        if (!errorsList.isEmpty()) {

            next(createHttpError(400, { errorsList }))
        } else {


            const {
                category,
                title,
                cover,
                content,

                name,


            } = req.body
            console.log("name=", name)
            const blog = {
                id: uniqid(),
                category,
                title,
                cover,
                readTime: {
                    value: 2,
                    unit: "minute"
                },
                author: {
                    name: name,
                    "avatar": `https://eu.ui-avatars.com/api?name=${name}`,
                },
                content: `<div class='py-5 blog-content'><p>${content}</p></div>`,

                createdAt: new Date(),
                updatedAt: new Date(),


            }
            /*   const newBlog = { ...req.body, id: uniqid(), createdAt: new Date() } */


            /* const blogs = JSON.parse(fs.readFileSync(blogsJSONPath)) */
            const blogs = await getBlogs()



            /*  blogs.push(newBlog) */
            blogs.push(blog)


            /* fs.writeFileSync(blogsJSONPath, JSON.stringify(blogs)) */
            await writeBlogs(blogs)


            res.status(201).send(blog)
        }
    } catch (error) {
        next(error)
    }
})


blogsRouter.get("/:blogID", async (req, res, next) => {
    try {

        /* const blogs = JSON.parse(fs.readFileSync(blogsJSONPath)) */
        const blogs = await getBlogs()

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


blogsRouter.put("/:blogID", async (req, res, next) => {
    try {

        /*  const blogs = JSON.parse(fs.readFileSync(blogsJSONPath)) */
        const blogs = await getBlogs()


        const remainingblogs = blogs.filter(blog => blog.id !== req.params.blogID)

        const updatedblog = { ...req.body, id: req.params.blogID }

        remainingblogs.push(updatedblog)


        /* fs.writeFileSync(blogsJSONPath, JSON.stringify(remainingblogs)) */
        await writeBlogs(remainingblogs)

        res.send(updatedblog)
    } catch (error) {
        next(error)
    }
})


blogsRouter.delete("/:blogID", async (req, res, next) => {
    try {

        /* const blogs = JSON.parse(fs.readFileSync(blogsJSONPath)) */
        const blogs = await getBlogs()

        const remainingblogs = blogs.filter(blog => blog.id !== req.params.blogID)

        /*  fs.writeFileSync(blogsJSONPath, JSON.stringify(remainingblogs)) */
        await writeBlogs(remainingblogs)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default blogsRouter