import { Router } from "express";
import generateAuto from "../controllers/auto-generation/auto-generation.js";
import { generator } from "../controllers/content-generators/generator.js";
import { titan_img } from "../controllers/img-generators/titan.js";
import blogRoute from "./blog.js";
import productRoute from "./products.js";


const router = Router()

router.use('/blog', blogRoute)
router.use('/products', productRoute)
router.use('/img-generate', titan_img);
router.use('/generate', generator);
router.use('/auto', generateAuto)



export default router;

