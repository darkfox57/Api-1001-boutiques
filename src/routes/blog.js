import { Router } from "express";
import getAllBlogs from "../controllers/blog/getAllBlogs.js";
import getBlogBySlug from "../controllers/blog/getBlogBySlug.js";

const blogRoute = Router()

blogRoute.get('/get-all', getAllBlogs)
blogRoute.get('/get-blog/:slug', getBlogBySlug)


export default blogRoute