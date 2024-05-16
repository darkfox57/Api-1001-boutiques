import { Router } from "express";
import getProducts from "../controllers/product/get-products.js";
import getProductByTag from "../controllers/product/getProductByTag.js";
import { getXml } from "../controllers/product/getXml.js";

const productRoute = Router()

productRoute.get('/get-xml', getXml)
productRoute.get("/get-all", getProducts)
productRoute.get('/get-by-tag', getProductByTag)

export default productRoute