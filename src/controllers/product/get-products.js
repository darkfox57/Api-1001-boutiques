import dotenv from 'dotenv';
import models from '../../db.js';



dotenv.config();



const getProducts = async (req, res) => {
 console.log('todos los blogs');
 try {

  const data = await models.Product.findAll()

  res.status(201).json(data)

 } catch (error) {
  console.error("Error al consultar los blogs:", error);
  throw new Error("Error al consultar los blogs");
 }
}


export default getProducts







