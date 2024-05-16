import imgSearch from '../../lib/cloudinarySearch.js';

const getImg = async (req, res) => {
 const { tags } = req.query
 try {
  const searchTags = tags.split(',')
  const img = await imgSearch(searchTags)
  res.status(201).json(img)

 } catch (error) {
  console.error("Error al consultar los blogs:", error);
  throw new Error("Error al consultar los blogs");
 }
}


export default getImg
