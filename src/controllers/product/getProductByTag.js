import dotenv from 'dotenv';
import { Op, Sequelize } from 'sequelize';
import models from '../../db.js';

dotenv.config();

const getProductByTag = async (req, res) => {
 const { brand, collection, type, type_form } = req.query;

 try {
  let whereConditions = {};

  // 1. Si hay marca, buscar por marca
  if (brand) {
   whereConditions.brand = brand;

   // 2. Si hay colección, buscar por marca y colección
   if (collection) {
    whereConditions.collection = collection;
   }

   // 3. Si hay tipo, buscar por marca, colección y tipo
   if (type) {
    whereConditions.type = { [Op.like]: `%${type}%` };
   }
  } else if (type) {
   // 4. Si no hay marca pero hay tipo, buscar por tipo
   whereConditions.type = { [Op.like]: `%${type}%` };

   // 5. Si hay type_form, buscar por tipo y type_form
   if (type_form) {
    whereConditions.type_form = { [Op.like]: `%${type_form}%` };
   }
  } else if (type_form) {
   whereConditions.type_form = { [Op.like]: `%${type_form}%` };
  }

  // Realizar la consulta a la base de datos con las condiciones construidas
  let data = await models.Product.findAll({
   where: whereConditions,
   order: Sequelize.literal('RAND()'),  // Seleccionar productos aleatoriamente
   limit: 12  // Limitar el número de resultados a 12
  });

  const resultsCount = data.length;

  // Completar resultados si son menos de 12
  if (resultsCount < 12) {
   const countToComplete = 12 - resultsCount;
   let additionalData = [];

   if (brand && collection && type) {
    // Completar con otros productos de la misma colección
    additionalData = await models.Product.findAll({
     where: {
      collection: collection,
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: countToComplete
    });
   } else if (brand && collection) {
    // Completar con otros productos de la misma marca
    additionalData = await models.Product.findAll({
     where: {
      brand: brand,
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: countToComplete
    });
   } else if (type && type_form) {
    // Completar con otros productos que coincidan con type
    additionalData = await models.Product.findAll({
     where: {
      type: { [Op.like]: `%${type}%` },
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: countToComplete
    });
   }

   data = data.concat(additionalData);
  }

  res.status(200).json(data);
 } catch (error) {
  console.error("Error al consultar los productos:", error);
  res.status(500).json({ error: "Error al consultar los productos" });
 }
};

export default getProductByTag;
