/* import { body } from "express-validator" */
import { checkSchema, validationResult } from "express-validator"

/* export const blogsValidationMiddleware = [
    body("category").exists().withMessage("Category is a mandatory field!"),
    body("title").exists().withMessage("Title is a mandatory field!"),
    body("name").exists().withMessage("Name is a mandatory field!"), ]*/

    

const schema={
    title:{
  in:['body'],
  isString:{
      errorMessage:'titlevalidation failed, type must be string '
  }      
    },
    category:{
in:['body'],
isString:{
    errorMessage:'category validation failed, type must be string '
}
    },
    content:{
 in:['body'],
 isString:{
     errorMessage:'content validation failed, type must be string '
 }       
    },
    "author.name":{
in:['body'],
isString:{
    errorMessage:'author.name validation failed, type must be string '
}
    },
    "author.avatar":{
        in:['body'],
        isString:{
            errorMessage:'author.avatar validation failed, type must be string '
        }
            },
    "readTime.value":{
in:['body'],
isNumeric:{
    errorMessage: 'readTime.value validation failed, type must be numeric '
}
    },
    "readTime.unit":{
        in:['body'],
        isNumeric:{
            errorMessage: 'readTime.unit validation failed, type must be string '
        }
            },
    cover:{
in:['body'],
isString:{
    errorMessage:'cover validation failed, type must be string '
}
    }
}


export const checkBlogPostSchema=checkSchema(schema)
export const checkValidationResult=(req, res, next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const error=new Error("Blog post validation failed")
        error.status=400
        error.errors=errors.array()
        next(error)

    }
    next()
}