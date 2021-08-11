import { body } from "express-validator"

export const blogsValidationMiddleware = [
    body("category").exists().withMessage("Category is a mandatory field!"),
    body("title").exists().withMessage("Title is a mandatory field!"),
    /*  body("email").exists("Email is a mandatory field!").isEmail().withMessage("Please send a valid email!"), */
]
