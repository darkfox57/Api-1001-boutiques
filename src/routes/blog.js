import { Router } from "express";
import getAllBlogs from "../controllers/blog/getAllBlogs.js";
import getBlogBySlug from "../controllers/blog/getBlogBySlug.js";
import getImg from "../controllers/blog/getImg.js";
import getSeo from "../controllers/blog/getSeo.js";
import getKeywords from "../controllers/keywords/keywords.js";

const blogRoute = Router()

blogRoute.get('/get-all', getAllBlogs)
blogRoute.get('/get-blog/:slug', getBlogBySlug)
blogRoute.get('/get-image', getImg)
blogRoute.get('/get-seo', getSeo)
blogRoute.get('/get-keywords', getKeywords)


export default blogRoute