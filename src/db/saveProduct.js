import dotenv from 'dotenv';
import models from '../db.js';

dotenv.config();


// Function to save the response to the database
export const saveProduct = async ({ name, description, meta_title, image1, link, short_description, meta_description, price }) => {
 try {

  let data

  data = {
   name: name[0],
   description: description[0],
   meta_title: meta_title[0],
   meta_description: meta_description[0],
   image1: image1[0],
   link: link[0],
   short_description: short_description[0],
   price: price[0]

  }
  // Verificar si el enlace del producto ya existe en la base de datos
  const existingProduct = await models.Product.findOne({
   where: {
    link: link[0]
   }
  });

  // Si el producto ya existe, retornar null indicando que no se ha guardado
  if (existingProduct) {
   console.log(`El producto con el enlace '${link[0]}' ya existe en la base de datos.`);
   return null;
  }
  // Create a new Post instance based on the post object
  const newProduct = await models.Product.create({
   ...data
  });

  return newProduct

 } catch (error) {
  console.error('Error saving blog post information:', error);
  res.status(500).json({ error: 'Internal Server Error' });
 }
};
