import dotenv from 'dotenv';
import { Op } from 'sequelize';
import slugify from 'slugify';
import models from '../db.js';

dotenv.config();

// Función para generar el slug
const generateSlug = (name) => {
 return slugify(name, { lower: true, strict: true });
};

export const saveBlog = async (post) => {
 try {
  const { title, description, slug, img, content, brand, collection, type, tags, category, published } = post;

  const existingBlog = await models.Blog.findOne({ where: { slug } });
  if (existingBlog) {
   return { message: 'Este artículo ya ha sido publicado' };
  }

  // Función para encontrar o crear una relación
  const findOrCreate = async (Model, name) => {
   const slug = generateSlug(name);
   let record = await Model.findOne({ where: { slug } });
   if (!record) {
    record = await Model.create({ name, slug });
   }
   return record;
  };

  // Encontrar o crear Brand, Collection y Type si no son null
  const brandRecord = brand ? await findOrCreate(models.Brand, brand) : null;
  const collectionRecord = collection ? await findOrCreate(models.Collection, collection) : null;
  const typeRecord = type ? await findOrCreate(models.Type, type) : null;

  // Guardar el blog
  const newBlog = await models.Blog.create({
   title,
   description,
   slug,
   img,
   content,
   brandId: brandRecord ? brandRecord.id : null,
   collectionId: collectionRecord ? collectionRecord.id : null,
   typeId: typeRecord ? typeRecord.id : null,
   tags,
   published,
   userId: 2
  });

  // Manejar la categoría como un string
  const categorySlug = generateSlug(category);
  let categoryRecord = await models.Category.findOne({ where: { slug: categorySlug } });
  if (!categoryRecord) {
   categoryRecord = await models.Category.create({ name: category, slug: categorySlug });
  }

  // Asociar la categoría al nuevo blog
  await newBlog.addCategory(categoryRecord);

  return newBlog;

 } catch (error) {
  console.error('Error guardando la información del blog:', error);
  throw error; // Re-lanzar el error para que sea manejado por el controlador
 }
};
