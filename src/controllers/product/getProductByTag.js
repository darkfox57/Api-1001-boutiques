import dotenv from 'dotenv';
import { Op, Sequelize } from 'sequelize';
import models from '../../db.js';

dotenv.config();

const getProductByTag = async (req, res) => {
 // Obtener los parámetros de la solicitud
 let { brand, collection, type, type_form } = req.query;

 // Transformar las cadenas 'null' a valores null
 brand = brand === 'null' ? null : brand;
 collection = collection === 'null' ? null : collection;
 type = type === 'null' ? null : type;
 type_form = type_form === 'null' ? null : type_form;
 console.log(brand, collection, type, type_form);


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

   if (type_form) {
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
   raw: true, // Devolver objetos planos
  });

  let resultsCount = data.length;

  // 3. Lógica para completar los resultados si son menos de 12
  if (resultsCount < 12) {
   const countToComplete = 12 - resultsCount;
   let additionalData = [];

   // Condición de búsqueda específica: buscar por brand, collection, type y type_form
   if (brand && collection && type && type_form) {
    // Completado con productos en la misma marca pero manteniendo el type y type_form
    if (resultsCount < 12) {
     additionalData = await models.Product.findAll({
      where: {
       brand: brand,
       type: { [Op.like]: `%${type}%` },
       type_form: { [Op.like]: `%${type_form}%` },
       collection: { [Op.ne]: collection }, // Excluir la colección actual
       id: { [Op.notIn]: data.map(product => product.id) }
      },
      order: Sequelize.literal('RAND()'),
      limit: countToComplete,
      raw: true, // Devolver objetos planos
     });

     data = data.concat(additionalData);
     resultsCount = data.length;
    }

    // Si no son suficientes, completado con productos que mantengan type y type_form sin importar la marca
    if (resultsCount < 12) {
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
   }

   // Completado cuando solo hay type y/o type_form
   if (!brand && !collection && (type || type_form)) {
    // Si hay type y type_form o solo uno de ellos, completado manteniendo lo que esté presente
    const whereAdditional = {};

    if (type) {
     whereAdditional.type = { [Op.like]: `%${type}%` };
    }
    if (type_form) {
     whereAdditional.type_form = { [Op.like]: `%${type_form}%` };
    }

    if (resultsCount < 12) {
     const additionalCount = 12 - resultsCount;
     additionalData = await models.Product.findAll({
      where: {
       ...whereAdditional,
       id: { [Op.notIn]: data.map(product => product.id) }
      },
      order: Sequelize.literal('RAND()'),
      limit: additionalCount,
      raw: true, // Devolver objetos planos
     });

     data = data.concat(additionalData);
     resultsCount = data.length;
    }
   }

   // Si después de todas las búsquedas aún no se han encontrado 12 productos y no hay `type_form`, completar sin ningún filtro adicional
   if (resultsCount < 12 && !type_form) {
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

export default getProductByTag;
