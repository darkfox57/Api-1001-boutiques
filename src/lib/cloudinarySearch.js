import cloudinary from "./cloudinaryUpload.js";

export default async function imgSearch(brand, collection, type) {
  try {
    const searchImage = async (exp) => {
      const res = await cloudinary.search.expression(exp).fields('secure_url').fields('tags').execute();
      if (res.resources.length > 0) {
        let filteredResources = res.resources;
        if (collection && brand) {
          filteredResources = res.resources.filter((item) =>
            item.asset_folder === brand && item.tags.includes(collection)
          );
          if (filteredResources.length < 1) {
            filteredResources = res.resources.filter((item) =>
              item.asset_folder === brand);
          }
        }
        if (brand && !collection) {
          filteredResources = res.resources.filter((item) => item.asset_folder === brand);
        }
        const randomIndex = Math.floor(Math.random() * filteredResources.length);
        return filteredResources[randomIndex].secure_url;
        // return filteredResources
      }
      return null;
    };

    let exp = `resource_type=image`;

    if (collection) exp += ` AND (tags=${collection}*)`;

    if (brand && !collection) exp += ` AND folder=${brand}*`;

    if (!brand && !collection && !type) exp = `folder=Z8SHOPPING AND resource_type:image`

    let img = await searchImage(exp);

    if (!img && brand) {
      exp = `resource_type:image AND tags=${brand}*`;
      img = await searchImage(exp);
    }
    if (!img && type) {
      exp = `resource_type:image AND tags=${type}*`;
      img = await searchImage(exp);
    }
    if (!img) {
      exp = `folder=Z8SHOPPING AND resource_type:image`;
      img = await searchImage(exp);
    }
    return img;

  } catch (error) {
    console.error('Error al buscar imágenes:', error);
    throw error;
  }
}
