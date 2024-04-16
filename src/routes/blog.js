import { Router } from "express";
import getAllBlogs from "../controllers/blog/getAllBlogs.js";

const blogRoute = Router()

blogRoute.get('/get-all', getAllBlogs)

export default blogRoute