import express from "express"
import multer from "multer"
import {extname,dirname,join} from "path"
import { saveBlogsPicture,writeBlogs,getBlogs } from "../../lib/fs-tools.js"
import {fileURLToPath} from "url"

import { pipeline } from "stream"


import { getPDFReadableStream } from "../../lib/pdf.js"

 

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
  filesRouter.get("/PDFDownload/:id", async (req, res, next) => {
    try {
      const blogs = await getBlogs()
      const blog=blogs.find(blog=>blog.id===req.params.id)
      const filename =  `${req.params.id}.pdf`
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`) // this header tells the browser to open the "save file as" dialog
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
  