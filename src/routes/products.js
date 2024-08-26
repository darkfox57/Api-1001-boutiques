import { Router } from "express";
import getProducts from "../controllers/product/get-products.js";
import { getXml } from "../controllers/product/getXml.js";
import getProductWithTypeForm from "../controllers/product/searchWithTypeForm.js";
import getProductWithoutTypeForm from "../controllers/product/searchWithoutTypeForm.js";

const productRoute = Router()

productRoute.get('/get-xml', getXml)
productRoute.get("/get-all", getProducts)
productRoute.get('/get-without-typeform', getProductWithoutTypeForm)
productRoute.get('/get-with-typeform', getProductWithTypeForm)

export default productRoute