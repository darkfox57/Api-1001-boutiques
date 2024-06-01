import cloudinary from "./cloudinaryUpload.js";

export default async function imgSearch(searchTags, brand, collection) {
 try {
  // Primero, buscar dentro de la colección especificada
  let expresion = `collections=${collection} AND resource_type:image`;
  let res = await cloudinary.search.expression(expresion).execute();

  if (res.resources.length > 0) {
   // Buscar dentro de la colección por etiquetas
   expresion = `collections=${collection} AND resource_type:image AND (${searchTags.map(tag => `tags=${tag}`).join(' AND ')})`;
   res = await cloudinary.search.expression(expresion).execute();

   if (res.resources.length > 0) {
    const randomIndex = Math.floor(Math.random() * res.resources.length);
    const img = res.resources[randomIndex].url;
    return img;
   }
  }

  // Si no se encontraron resultados, buscar solo por etiquetas dentro del folder AICONTENT
  expresion = `folder:AICONTENT AND resource_type:image AND (${searchTags.map(tag => `tags=${tag}`).join(' AND ')})`;
  res = await cloudinary.search.expression(expresion).execute();

  if (res.resources.length > 0) {
   const randomIndex = Math.floor(Math.random() * res.resources.length);
   const img = res.resources[randomIndex].url;
   return img;
  } else {
   // Si no se encontraron resultados, buscar una imagen genérica dentro del folder SHOPPING
   const generic = await cloudinary.search.expression("folder:SHOPPING AND resource_type:image").execute();
   const randomIndex = Math.floor(Math.random() * generic.resources.length);
   const img = generic.resources[randomIndex].url;
   return img;
  }

 } catch (error) {
  console.error('Error al buscar imágenes:', error);
  throw error;
 }
}





