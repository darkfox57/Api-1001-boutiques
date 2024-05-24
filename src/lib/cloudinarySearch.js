import cloudinary from "./cloudinaryUpload.js";

export default async function imgSearch(searchTags) {
 try {
  // Construir la expresión de búsqueda con la lógica OR para las etiquetas y el nombre del archivo
  const expresion = `folder: AICONTENT resource_type:image AND (${searchTags.map(tag => `tags=${tag}`).join(' OR ')})`;

  const res = await cloudinary.search.expression(expresion).execute();
  if (res.resources.length > 0) {

   const img = res.resources[0].url
   return img;
  } else {
   return 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80';
  }
 } catch (error) {
  console.error('Error al buscar imágenes:', error);
  throw error;
 }
}




