import dotenv from 'dotenv';
import slugify from 'slugify';
import models from '../db.js';
import { seoGenerator } from '../lib/seoGenerator.js';

dotenv.config();

const generateSlug = (name) => {
 return slugify(name, { lower: true, strict: true });
};

const findOrCreateWithSeo = async (Model, name, type) => {
 const slug = generateSlug(name);
 let record = await Model.findOne({ where: { slug } });
 if (!record) {
  const { meta_title, meta_desc, meta_keywords } = await seoGenerator(name, type);
  record = await Model.create({ name, slug, meta_title, meta_desc, meta_keywords });
 }
 return record;
};

export const saveBlog = async (post) => {
 try {
  const { title, description, slug, img, content, brand, collection, type, tags, category, published } = post;

  const existingBlog = await models.Blog.findOne({ where: { slug } });
  if (existingBlog) {
   return { message: 'Este artículo ya ha sido publicado' };
  }

  const brandRecord = brand ? await findOrCreateWithSeo(models.Brand, brand, 'brand') : null;
  let collectionRecord = null;
  if (collection) {
   collectionRecord = await findOrCreateWithSeo(models.Collection, collection, 'collection');
   if (brandRecord) {
    await collectionRecord.update({ brandId: brandRecord.id });
   }
  }
  const typeRecord = type ? await findOrCreateWithSeo(models.Type, type, 'type of garment') : null;

  const newBlog = await models.Blog.create({
   title,
   description,
   slug,
   img,
   content,
   brandId: brandRecord ? brandRecord.id : null,
   collectionId: collectionRecord ? collectionRecord.id : null,
   typeId: typeRecord ? typeRecord.id : null,
   published,
   userId: 2
  });

  const categorySlug = generateSlug(category);
  let categoryRecord = await models.Category.findOne({ where: { slug: categorySlug } });
  if (!categoryRecord) {
   const { meta_title, meta_description, meta_keywords } = await seoGenerator(category, 'category');
   categoryRecord = await models.Category.create({ name: category, slug: categorySlug, meta_title, meta_description, meta_keywords });
  }

  await newBlog.addCategory(categoryRecord);

  for (const tag of tags) {
   let tagRecord = await models.Tag.findOne({ where: { name: tag } });
   if (!tagRecord) {
    tagRecord = await models.Tag.create({ name: tag });
   }
   await newBlog.addTag(tagRecord);
  }

  return newBlog;

 } catch (error) {
  console.error('Error guardando la información del blog:', error);
  throw error;
 }
};
