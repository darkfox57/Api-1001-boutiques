import dotenv from 'dotenv';
import { Op } from 'sequelize';
import models from '../../db.js';

dotenv.config();

const getProductByTag = async (req, res) => {
 const { tags } = req.query;
 try {
  let data = []

  data = await models.Product.findAll({
   where: {
    brand: tags[0]
   },
   limit: 8
  });
  if (data.length === 0) {
   data = await models.Product.findAll({
    where: {
     name: {
      [Op.or]: tags.split(',').map(tag => ({ [Op.like]: `%${tag}%` }))
     }
    },
    limit: 8
   });
  }
  res.status(200).json(data);
 } catch (error) {
  console.error("Error al consultar los productos:", error);
  res.status(500).json({ error: "Error al consultar los productos" });
 }
}



export default getProductByTag