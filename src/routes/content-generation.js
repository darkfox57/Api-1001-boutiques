import { Router } from "express";
import { claude } from "../controllers/content-generators/claude.js";
import { openaiGenerator } from "../controllers/content-generators/openai.js";
import { titan_img } from "../controllers/img-generators/titan.js";

const content_Generation = Router()

content_Generation.get('/', openaiGenerator)
content_Generation.get('/img', titan_img)

export default content_Generation
