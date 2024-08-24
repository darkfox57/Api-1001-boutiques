import dotenv from 'dotenv';
import { Op, Sequelize } from 'sequelize';
import models from '../../db.js';

dotenv.config();

const getProductByTag = async (req, res) => {
 const { brand, collection, type, type_form } = req.query;

 try {
  let whereConditions = {};

  // 1. Buscar por brand, collection y type
  if (brand) {
   whereConditions.brand = brand;

   if (collection) {
    whereConditions.collection = collection;
   }

   if (type) {
    whereConditions.type = { [Op.like]: `%${type}%` };
   }

  } else if (type) {
   // 2. Buscar por type y type_form
   whereConditions.type = { [Op.like]: `%${type}%` };

   if (type_form) {
    whereConditions.type_form = { [Op.like]: `%${type_form}%` };
   }

  } else if (type_form) {
   // 3. Buscar solo por type_form
   whereConditions.type_form = { [Op.like]: `%${type_form}%` };
  }

  // Realizar la consulta principal a la base de datos con las condiciones construidas
  let data = await models.Product.findAll({
   where: whereConditions,
   order: Sequelize.literal('RAND()'),
   limit: 12,
  });

  const resultsCount = data.length;

  // Completar resultados si son menos de 12
  if (resultsCount < 12) {
   const countToComplete = 12 - resultsCount;
   let additionalData = [];

   if (brand && collection && type) {
    // Completar con productos de la misma colección
    additionalData = await models.Product.findAll({
     where: {
      collection: collection,
      id: { [Op.notIn]: data.map((product) => product.id) },
     },
     order: Sequelize.literal('RAND()'),
     limit: countToComplete,
    });

   } else if (brand && collection) {
    // Completar con productos de la misma marca
    additionalData = await models.Product.findAll({
     where: {
      brand: brand,
      id: { [Op.notIn]: data.map((product) => product.id) },
     },
     order: Sequelize.literal('RAND()'),
     limit: countToComplete,
    });

   } else if (type && type_form) {
    // Completar con productos que coincidan con type_form
    additionalData = await models.Product.findAll({
     where: {
      type_form: { [Op.like]: `%${type_form}%` },
      id: { [Op.notIn]: data.map((product) => product.id) },
     },
     order: Sequelize.literal('RAND()'),
     limit: countToComplete,
    });

   } else if (type) {
    // Completar con productos que coincidan con type
    additionalData = await models.Product.findAll({
     where: {
      type: { [Op.like]: `%${type}%` },
      id: { [Op.notIn]: data.map((product) => product.id) },
     },
     order: Sequelize.literal('RAND()'),
     limit: countToComplete,
    });

   } else if (type_form) {
    // Completar con productos que coincidan con type_form
    additionalData = await models.Product.findAll({
     where: {
      type_form: { [Op.like]: `%${type_form}%` },
      id: { [Op.notIn]: data.map((product) => product.id) },
     },
     order: Sequelize.literal('RAND()'),
     limit: countToComplete,
    });
   }

   // Concatenar los resultados adicionales
   data = data.concat(additionalData);
  }

  res.status(200).json(data);
 } catch (error) {
  console.error("Error al consultar los productos:", error);
  res.status(500).json({ error: "Error al consultar los productos" });
 }
};

export default getProductByTag;
