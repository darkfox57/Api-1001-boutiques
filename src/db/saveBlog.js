import dotenv from 'dotenv';
import { Op } from 'sequelize';
import models from '../db.js';

dotenv.config();


export const saveBlog = async (post) => {
 try {

  const { title, description, slug, img, content, tags, category, published } = post;

  const existingBlog = await models.Blog.findOne({ where: { slug } });
  if (existingBlog) {
   return { message: 'This article has already been published' }
  }

  // Guardar el blog
  const newBlog = await models.Blog.create({
   title,
   description,
   slug,
   img,
   content,
   tags,
   published,
  });



  const existingCategories = await models.Category.findAll({
   where: {
    name: category.map(c => c),
   },
  });


  const existingCategoryNames = existingCategories.map(c => c.name);

  // Crear las categorías que no existen
  const newCategories = category.filter(c => !existingCategoryNames.includes(c));
  const createdCategories = await models.Category.bulkCreate(newCategories.map(name => ({ name })));

  // Combinar las categorías existentes y recién creadas
  const allCategories = [...existingCategories, ...createdCategories];

  // Asociar las categorías al nuevo blog
  await newBlog.addCategory(allCategories);



  return newBlog;

 } catch (error) {
  console.error('Error guardando la información del blog:', error);
  throw error; // Re-lanzar el error para que sea manejado por el controlador
 }
};




