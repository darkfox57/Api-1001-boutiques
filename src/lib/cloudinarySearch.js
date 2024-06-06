import cloudinary from "./cloudinaryUpload.js";

export default async function imgSearch(brand, collection) {
 console.log({ collection: collection, brand: brand });
 try {
     let res;
     let searchBrand = brand.toUpperCase(brand).replace(" ", "%20")
     let searchCollection = brand.toUpperCase(collection).replace(" ", "%20")

  if (collection && collection.length > 0) {
   // Buscar dentro del folder AICONTENT y con las etiquetas proporcionadas
   let expresion = `folder:AICONTENT/${searchBrand} AND resource_type:image AND (tags=${collection})`;
   res = await cloudinary.search.expression(expresion).execute();

   if (res.resources.length > 0) {
    // Buscar dentro del folder y etiquetas específicas
    expresion = `folder:AICONTENT AND resource_type:image AND (tags=${brand} OR tags=${collection})`;
    res = await cloudinary.search.expression(expresion).execute();

    if (res.resources.length > 0) {
     const randomIndex = Math.floor(Math.random() * res.resources.length);
     const img = res.resources[randomIndex].url;
     return img;
    }
   }
  }

  if (brand && brand.length > 0) {
   let expresion = `folder:AICONTENT AND resource_type:image AND (tags=${brand})`;
   res = await cloudinary.search.expression(expresion).execute();

   if (res.resources.length > 0) {
    // Buscar dentro del folder y etiquetas específicas
    expresion = `folder:AICONTENT AND resource_type:image AND (tags=${brand} OR tags=${collection})`;
    res = await cloudinary.search.expression(expresion).execute();

    if (res.resources.length > 0) {
     const randomIndex = Math.floor(Math.random() * res.resources.length);
     const img = res.resources[randomIndex].url;
     return img;
    }
   }
  }

  // Si no se encontraron resultados, buscar una imagen genérica dentro del folder SHOPPING
  const generic = await cloudinary.search.expression("folder:SHOPPING AND resource_type:image").execute();
  const randomIndex = Math.floor(Math.random() * generic.resources.length);
  const img = generic.resources[randomIndex].url;
  return img;

 } catch (error) {
  console.error('Error al buscar imágenes:', error);
  throw error;
 }
}







