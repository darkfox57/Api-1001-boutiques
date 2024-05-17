import dotenv from 'dotenv';
import { Op } from 'sequelize';
import models from '../../db.js';

dotenv.config();

const getProductByTag = async (req, res) => {
 const { tags } = req.query;
 const tagList = tags.replace('collection', '').split(',')
 try {
  let data = []

  const exactMatch = await models.Product.findAll({
   where: {
    name: {
     [Op.like]: `%${tagList.join(' ')}%`
    }
   }
  });

  // Si se encuentra una coincidencia exacta, se agrega a los resultados
  if (exactMatch.length > 0) {
   data = exactMatch;
  } else {
   // Si no se encuentra una coincidencia exacta, busca productos que contengan todas las etiquetas en el nombre
   data = await models.Product.findAll({
    where: {
     brand: tagList[0],
     name: {
      [Op.like]: `%${tagList[1]}%`
     }
    },
    limit: 8
   });
   if (data.length === 0) {
    data = await models.Product.findAll({
     where: {
      name: {
       [Op.or]: tagList.map(tag => ({ [Op.like]: `%${tag}%` }))
      }
     },
     limit: 8
    });
   }
  }




  res.status(200).json(data);
 } catch (error) {
  console.error("Error al consultar los productos:", error);
  res.status(500).json({ error: "Error al consultar los productos" });
 }
}



export default getProductByTag