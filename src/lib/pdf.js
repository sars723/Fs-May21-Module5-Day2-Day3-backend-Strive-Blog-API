import PdfPrinter from "pdfmake"
import {  getBlogReadableStream } from "./fs-tools.js"
import { getBlogs, writeBlogs } from '../lib/fs-tools.js'

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
}

export const getPDFReadableStream =async(blog)  => {
  const printer = new PdfPrinter(fonts)
/* const source=getBlogReadableStream() */
/* const blogs = await getBlogs() */
/* const docDefinition={ content: [{text: 'Blogs'}] } */
/* blogs.map(blog=>{ */
   /* docDefinition.content.push({ */
    const docDefinition={
    content: [ 
      {
        text: blog.title,
        style: 'header'
        },
        {
          text: `\nby ${blog.author.name}`, 
          style: 'subheader' 
          },  
          `\n${blog.cover}`,
      `\n${blog.content}`,
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      subheader: {
        fontSize: 15,
        bold: true
      },
      small: {
        fontSize: 8
      }
 }
}
 /* ) */
/* }) */
  const options = {}
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)

  pdfReadableStream.end()
  return pdfReadableStream
}