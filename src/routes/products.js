import { Router } from "express";
import { getXml } from "../controllers/product/getXml.js";

const productRoute = Router()

productRoute.get('/get-xml', getXml)

export default productRoute