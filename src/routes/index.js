import { Router } from "express";
import blogRoute from "./blog.js";
import content_Generation from "./content-generation.js";
import productRoute from "./products.js";


const router = Router()

router.use('/generate', content_Generation);
router.use('/blog', blogRoute)
router.use('/products', productRoute)

export default router;

