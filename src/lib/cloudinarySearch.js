import cloudinary from "./cloudinaryUpload.js";

export default async function imgSearch(brand, collection, type) {

 try {
  const searchImage = async (exp) => {
   const res = await cloudinary.search.expression(exp).execute();
   if (res.resources.length > 0) {
    const randomIndex = Math.floor(Math.random() * res.resources.length);
    return res.resources[randomIndex].url;
   }
   return null;
  };

  let exp = `resource_type:image`;

  if (collection) exp += ` AND (tags=${collection})`;
  if (brand) exp += ` AND (tags=${brand} OR tags=${collection})`;

  let img = await searchImage(exp);
  if (!img && brand) {
   exp = `resource_type:image AND tags=${brand}`;
   img = await searchImage(exp);
  }
  if (!img && type) {
   exp = `resource_type:image AND tags=${type}`;
   img = await searchImage(exp);
  }
  if (!img) {
   exp = `folder:SHOPPING AND resource_type:image`;
   img = await searchImage(exp);
  }
  return img;

 } catch (error) {
  console.error('Error al buscar imágenes:', error);
  throw error;
 }
}
