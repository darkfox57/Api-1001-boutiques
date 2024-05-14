import { Router } from "express";
import { getXml } from "../controllers/product/getXml.js";
import getProducts from "../controllers/product/get-products.js";

const productRoute = Router()

productRoute.get('/get-xml', getXml)
productRoute.get("/get-all", getProducts)

export default productRoute