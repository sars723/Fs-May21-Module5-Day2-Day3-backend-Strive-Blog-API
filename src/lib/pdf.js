/* import PdfPrinter from "pdfmake"
import {  getBlogReadableStream } from "./fs-tools.js"

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
}

export const getPDFReadableStream = data => {
  const printer = new PdfPrinter(fonts)
const source=getBlogReadableStream()
console.log(source)
  const docDefinition = {
    content: [ getBlogReadableStream()],
  }
  const options = {}
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)

  pdfReadableStream.end()
  return pdfReadableStream
} */