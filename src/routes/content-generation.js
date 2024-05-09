import { Router } from "express";
import { openaiGenerator } from "../controllers/content-generators/openai.js";

const content_Generation = Router()

content_Generation.get('/', openaiGenerator)

export default content_Generation
