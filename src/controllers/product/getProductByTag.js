import dotenv from 'dotenv';
import { Op, Sequelize } from 'sequelize';
import models from '../../db.js';

dotenv.config();

const getProductByTag = async (req, res) => {
 const { brand, collection } = req.query;

 try {
  let data = []

  const exactMatch = await models.Product.findAll({
   where: {
    [Op.and]: [
     Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('collection')), {
      [Op.like]: `%${collection.toLowerCase()}%`
     }),
     Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('brand')), {
      [Op.like]: `%${brand.toLowerCase()}%`
     })
    ]
   },
   order: Sequelize.literal('rand()'),
   limit: 8
  });

  // Si se encuentra una coincidencia exacta, se agrega a los resultados
  if (exactMatch.length > 0) {
   data = exactMatch;
  } else {
   // Si no se encuentra una coincidencia exacta, busca productos que contengan todas las etiquetas en el nombre
   data = await models.Product.findAll({
    where: {
     brand: brand,
     // name: {
     //  [Op.like]: collection
     // }
    },
    order: Sequelize.literal('rand()'),
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