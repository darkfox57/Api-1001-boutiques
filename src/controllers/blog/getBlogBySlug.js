import dotenv from 'dotenv';
import models from '../../db.js';



dotenv.config();



const getBlogBySlug = async (req, res) => {
 const { slug } = req.params;
 try {

  const data = await models.Blog.findOne({
   where: {
    slug: slug
   }
  })

  if (!data) {
   res.status(201).json('Blog not found')
  }

  res.status(201).json(data)

 } catch (error) {
  console.error("Error al consultar los blogs:", error);
  throw new Error("Error al consultar los blogs");
 }
}


export default getBlogBySlug