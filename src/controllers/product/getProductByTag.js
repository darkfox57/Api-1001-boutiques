import dotenv from 'dotenv';
import { Op, Sequelize } from 'sequelize';
import models from '../../db.js';

dotenv.config();

const getProductByTag = async (req, res) => {
 const { brand, collection, type, type_form } = req.query;

 try {
  let whereConditions = {};

  // 1. Construir condiciones de búsqueda basadas en los parámetros proporcionados
  if (brand) {
   whereConditions.brand = brand;

   if (collection) {
    whereConditions.collection = collection;
   }

   if (type) {
    whereConditions.type = { [Op.like]: `%${type}%` };
   }

   if (!collection && type_form) {
    // Si hay type_form pero no collection, incluirlo
    whereConditions.type_form = { [Op.like]: `%${type_form}%` };
   }

  } else if (type) {
   whereConditions.type = { [Op.like]: `%${type}%` };

   if (type_form) {
    whereConditions.type_form = { [Op.like]: `%${type_form}%` };
   }

  } else if (type_form) {
   whereConditions.type_form = { [Op.like]: `%${type_form}%` };
  }

  // 2. Realizar la consulta principal con las condiciones construidas usando `raw: true`
  let data = await models.Product.findAll({
   where: whereConditions,
   order: Sequelize.literal('RAND()'),
   limit: 12,
   raw: true,  // Devolver objetos planos
  });

  let resultsCount = data.length;

  // 3. Lógica para completar los resultados si son menos de 12
  if (resultsCount < 12) {
   const countToComplete = 12 - resultsCount;
   let additionalData = [];

   // Jerarquía de búsqueda para completar
   if (brand && collection && type) {
    // Si se buscan por brand, collection y type, completar con la misma colección primero
    additionalData = await models.Product.findAll({
     where: {
      collection: collection,
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: countToComplete,
     raw: true,  // Devolver objetos planos
    });

    data = data.concat(additionalData);
    resultsCount = data.length;
   }

   if (resultsCount < 12 && brand && collection) {
    // Si aún faltan productos, completar con otros productos de la misma marca
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      brand: brand,
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: additionalCount,
     raw: true,  // Devolver objetos planos
    });

    data = data.concat(additionalData);
    resultsCount = data.length;
   }

   if (resultsCount < 12 && brand && type && type_form) {
    // Completar con productos que coincidan solo con type_form
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      type_form: { [Op.like]: `%${type_form}%` },
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: additionalCount,
     raw: true,  // Devolver objetos planos
    });

    data = data.concat(additionalData);
    resultsCount = data.length;
   }

   if (resultsCount < 12 && type && type_form) {
    // Completar con productos que coincidan solo con type_form
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      type_form: { [Op.like]: `%${type_form}%` },
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: additionalCount,
     raw: true,  // Devolver objetos planos
    });

    data = data.concat(additionalData);
    resultsCount = data.length;
   }

   if (resultsCount < 12 && type) {
    // Completar con productos que coincidan solo con type
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      type: { [Op.like]: `%${type}%` },
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: additionalCount,
     raw: true,  // Devolver objetos planos
    });

    data = data.concat(additionalData);
    resultsCount = data.length;
   }

   if (resultsCount < 12 && type_form) {
    // Completar con productos que coincidan solo con type_form
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      type_form: { [Op.like]: `%${type_form}%` },
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: additionalCount,
     raw: true,  // Devolver objetos planos
    });

    data = data.concat(additionalData);
    resultsCount = data.length;
   }

   if (resultsCount < 12 && brand) {
    // Si aún faltan productos, completar con otros productos de la misma marca
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      brand: brand,
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: additionalCount,
     raw: true,  // Devolver objetos planos
    });

    data = data.concat(additionalData);
    resultsCount = data.length;
   }

   // Si después de todas las búsquedas aún no se han encontrado 12 productos, completar sin ningún filtro adicional
   if (resultsCount < 12) {
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: additionalCount,
     raw: true,  // Devolver objetos planos
    });

    data = data.concat(additionalData);
   }
  }

  res.status(200).json(data);
 } catch (error) {
  console.error("Error al consultar los productos:", error);
  res.status(500).json({ error: "Error al consultar los productos" });
 }
};

export default getProductByTag;
