import dotenv from 'dotenv';
import models from '../db.js';

dotenv.config();

export const saveProduct = async ({ name, brand, image1, link, price, old_price, variable, category, Forme, Gamme, description, Type }) => {
 try {
  const data = {
   name: name[0],
   brand: brand[0],
   collection: Gamme[0],
   type: Forme[0],
   category: category[0],
   description: description[0],
   image1: image1[0],
   link: link[0],
   pricepercentreduction: variable[0],
   price: price[0],
   old_price: old_price[0],
   type_form: Type[0]
  };

  const existingProduct = await models.Product.findOne({
   where: { link: link[0] }
  });

  if (existingProduct) {
   console.log(`El producto con el enlace '${link[0]}' ya existe en la base de datos.`);
   const updatedProduct = await existingProduct.update(data);
   return updatedProduct;
  }

  const newProduct = await models.Product.create(data);
  return newProduct;
 } catch (error) {
  console.error('Error saving product information:', error);
  throw error;
 }
};
