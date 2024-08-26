import dotenv from 'dotenv';
import { Op, Sequelize } from 'sequelize';
import models from '../../db.js';

dotenv.config();

const getProductWithTypeForm = async (req, res) => {
 // Obtener los parámetros de la solicitud
 let { brand, collection, type, type_form } = req.query;

 // Transformar las cadenas 'null' a valores null
 brand = brand === 'null' ? null : brand;
 collection = collection === 'null' ? null : collection;
 type = type === 'null' ? null : type;
 type_form = type_form === 'null' ? null : type_form;

 if (!type_form) {
  return res.status(400).json({ error: "type_form is required" });
 }

 try {
  let whereConditions = {
   type_form: { [Op.like]: `%${type_form}%` }
  };

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
    // Completado en la misma marca y type_form pero ignorando type
    additionalData = await models.Product.findAll({
     where: {
      brand: brand,
      collection: collection,
      type_form: { [Op.like]: `%${type_form}%` },
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
    // Completado en la misma marca pero ignorando collection y manteniendo type_form
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      brand: brand,
      type_form: { [Op.like]: `%${type_form}%` },
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
    // Completado buscando solo por type y type_form en otras marcas
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      type: { [Op.like]: `%${type}%` },
      type_form: { [Op.like]: `%${type_form}%` },
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: additionalCount,
     raw: true, // Devolver objetos planos
    });

    data = data.concat(additionalData);
    resultsCount = data.length;
   }

   // No realizar una búsqueda sin filtro si hay type_form y no se completaron los 12
   res.status(200).json(data);
   return;
  }

  res.status(200).json(data);
 } catch (error) {
  console.error("Error al consultar los productos:", error);
  res.status(500).json({ error: "Error al consultar los productos" });
 }
};

export default getProductWithTypeForm;
