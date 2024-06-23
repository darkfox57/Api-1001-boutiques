import cloudinary from "../../lib/cloudinaryUpload.js";

export async function cloudinarySearch() {
 try {
  // const res = await cloudinary.search.expression('resource_type:image AND tags=Aubade').execute();
  // return res.resources
  return { message: 'funciona' }

 } catch (error) {
  console.error('Error al buscar imágenes:', error);
  throw error;
 }
}
