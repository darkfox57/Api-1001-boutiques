import { Router } from "express";
import blogRoute from "./blog.js";
import content_Generation from "./content-generation.js";


const router = Router()

router.use('/generate', content_Generation);
router.use('/blog', blogRoute)

export default router;

