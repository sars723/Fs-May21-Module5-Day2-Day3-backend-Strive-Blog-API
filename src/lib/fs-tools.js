import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { readJSON, writeJSON, writeFile } = fs
const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../data/authors.json")
const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../data/blogs.json")
const publicFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/blogs")

export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = (content) => writeJSON(authorsJSONPath, content)
export const getBlogs = () => readJSON(blogsJSONPath)
export const writeBlogs = (content) => writeJSON(blogsJSONPath, content)

export const saveBlogsPicture = (filename, contentAsBuffer) => writeFile(join(publicFolderPath, filename), contentAsBuffer)