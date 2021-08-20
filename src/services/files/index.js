import express from "express"
import multer from "multer"
import {extname} from "path"
import { saveBlogsPicture,writeBlogs,getBlogs } from "../../lib/fs-tools.js"
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { pipeline } from "stream"

import { getPDFReadableStream } from "../../lib/pdf.js"

const cloudinaryStorage = new CloudinaryStorage({
 cloudinary, // short hand of _____cloudinary: cloudinary____ // grabs cloudinary_url from .env
  params: {
      // optional params
      folder: "files"
  }
})

const filesRouter = express.Router()
filesRouter.post("/:blogId", multer({ storage: cloudinaryStorage }).single("blogPic"), async (req, res, next) => {
    try {
      console.log(req.file)
      const extension = extname(req.file.originalname) // someimage.png --> 7d7d.png
      console.log(req.file.originalname)
      const fileName = `${req.params.blogId}${extension}`
      const url = `http://localhost:3006/${fileName}`
    /*   await saveBlogsPicture(fileName, req.file.buffer) */
      // FİND BLOG BY ID AND UPDATE COVER FIELD
      let  blogs = await  getBlogs()
      console.log(url)
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
  filesRouter.get("/PDFDownload/:id", async (req, res, next) => {
    try {
      const blogs = await getBlogs()
      const blog=blogs.find(blog=>blog.id===req.params.id)
      const filename =  `${req.params.id}.pdf`
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`) 
      const source =await getPDFReadableStream(blog)
      const destination = res
  
      pipeline(source, destination, err => {
        if (err) next(err)
      })
    } catch (error) {
      next(error)
    }
  })


  export default filesRouter
  