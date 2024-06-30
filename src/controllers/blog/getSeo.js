import { seoGenerator } from "../../lib/seoGenerator.js";

const getSeo = async (req, res) => {
 const { name, type } = req.query

 try {
  const seo = await seoGenerator(encodeURIComponent(name), encodeURIComponent(type))
  res.status(201).json(seo)

 } catch (error) {
  console.error("Error", error);
  throw new Error("Error");
 }
}


export default getSeo
