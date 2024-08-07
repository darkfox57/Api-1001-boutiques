import dotenv from 'dotenv';
import models from '../../db.js';



dotenv.config();



const getAllBlogs = async (req, res) => {
 try {

  const data = await models.Blog.findAll({
   attributes: ['id', 'title', 'slug', 'description',], include: models.Category
  })

  res.status(201).json(data)

 } catch (error) {
  console.error("Error al consultar los blogs:", error);
  throw new Error("Error al consultar los blogs");
 }
}


export default getAllBlogs







