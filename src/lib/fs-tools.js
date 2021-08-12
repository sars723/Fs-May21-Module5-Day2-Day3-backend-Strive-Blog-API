import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const {readJSON, writeJSON} = fs
const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../data/authors.json")
const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../data/blogs.json")

export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = (content) => writeJSON(authorsJSONPath, content)
export const getBlogs = () => readJSON(blogsJSONPath)
export const writeBlogs = (content) => writeJSON(blogsJSONPath, content)