import cloudinary from "./cloudinaryUpload.js";

export default async function imgSearch(searchTags) {
 try {
  console.log(searchTags);
  // Construir la expresión de búsqueda con la lógica OR para las etiquetas y el nombre del archivo
  const expresion = `folder:AICONTENT AND resource_type:image AND (${searchTags.map(tag => `tags=${tag}`).join(' OR ')})`;

  const res = await cloudinary.search.expression(expresion).execute();
  if (res.resources.length > 0) {
   const randomIndex = Math.floor(Math.random() * res.resources.length);
   const img = res.resources[randomIndex].url;
   return img;

  } else {
   // return 'https://res.cloudinary.com/dv47lvckg/image/upload/v1699833597/17_Services_SpaBeauty-BeautyServices_1_1095235c73.jpg'
   const generic = await cloudinary.search.expression("folder:SHOPPING resource_type:image").execute()
   const randomIndex = Math.floor(Math.random() * generic.resources.length);
   const img = generic.resources[randomIndex].url;
   return img;
  }

 } catch (error) {
  console.error('Error al buscar imágenes:', error);
  throw error;
 }
}




