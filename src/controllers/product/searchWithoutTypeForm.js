import dotenv from 'dotenv';
import { Op, Sequelize } from 'sequelize';
import models from '../../db.js';

dotenv.config();

const getProductWithoutTypeForm = async (req, res) => {
 // Obtener los parámetros de la solicitud
 let { brand, collection, type } = req.query;

 // Transformar las cadenas 'null' a valores null
 brand = brand === 'null' ? null : brand;
 collection = collection === 'null' ? null : collection;
 type = type === 'null' ? null : type;

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
  } else if (type) {
   whereConditions.type = { [Op.like]: `%${type}%` };
  }

  // 2. Realizar la consulta principal con las condiciones construidas usando `raw: true`
  let data = await models.Product.findAll({
   where: whereConditions,
   order: Sequelize.literal('RAND()'),
   limit: 12,
   raw: true, // Devolver objetos planos
  });

  let resultsCount = data.length;

  // 3. Lógica para completar los resultados si son menos de 12
  if (resultsCount < 12) {
   const countToComplete = 12 - resultsCount;
   let additionalData = [];

   if (brand && collection && type) {
    // Completado ignorando type
    additionalData = await models.Product.findAll({
     where: {
      brand: brand,
      collection: collection,
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: countToComplete,
     raw: true, // Devolver objetos planos
    });

    data = data.concat(additionalData);
    resultsCount = data.length;
   }

   if (resultsCount < 12 && brand && collection) {
    // Completado ignorando collection
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      brand: brand,
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: additionalCount,
     raw: true, // Devolver objetos planos
    });

    data = data.concat(additionalData);
    resultsCount = data.length;
   }

   if (resultsCount < 12 && type) {
    // Completado buscando solo por type en otras marcas
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      type: { [Op.like]: `%${type}%` },
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: additionalCount,
     raw: true, // Devolver objetos planos
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
     raw: true, // Devolver objetos planos
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

export default getProductWithoutTypeForm;
