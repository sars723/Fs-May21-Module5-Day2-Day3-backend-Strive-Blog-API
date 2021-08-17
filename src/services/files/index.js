import express from "express"
import multer from "multer"
import {extname,dirname,join} from "path"
import { saveBlogsPicture,writeBlogs,getBlogs } from "../../lib/fs-tools.js"
import {fileURLToPath} from "url"

 

const filesRouter = express.Router()
filesRouter.post("/:blogId", multer().single("blogPic"), async (req, res, next) => {
    try {
      console.log(req.file)
      const extension = extname(req.file.originalname) // someimage.png --> 7d7d.png
      console.log(req.file.originalname)
      const fileName = `${req.params.blogId}${extension}`
      const url = `${process.env.FE_DEV_URL}/${fileName}`
      await saveBlogsPicture(fileName, req.file.buffer)
      // FİND BLOG BY ID AND UPDATE COVER FIELD
      let  blogs = await  getBlogs()
      console.log(blogs)
      const blog = blogs.find(b=>b.id===req.params.blogId);
      console.log(blog)
      blog.cover=url
      blogs = blogs.filter(b=>b.id!==req.params.blogId)
      blogs.push(blog)
      await writeBlogs(blogs)
      res.send({blog})
    } catch (error) {
        console.log(error)
      next(error)
    }
  })


  export default filesRouter
  