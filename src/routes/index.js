import { Router } from "express";
import { generator } from "../controllers/content-generators/generator.js";
import blogRoute from "./blog.js";
import content_Generation from "./content-generation.js";
import productRoute from "./products.js";


const router = Router()


router.use('/generate', (req, res, next) => {
 if (!Object.keys(req.query).length) {
  content_Generation(req, res, next); // Si no hay query
 } else {
  next(); // Si hay query, pasa la solicitud al siguiente middleware
 }
});
router.use('/generate', generator);

router.use('/blog', blogRoute)
router.use('/products', productRoute)

export default router;

