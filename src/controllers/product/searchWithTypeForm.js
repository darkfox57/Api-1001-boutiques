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

 // Verificar que `type_form` esté presente, ya que es obligatorio para este archivo
 if (!type_form) {
  return res.status(400).json({ error: "type_form is required" });
 }

 try {
  // Inicializar condiciones de búsqueda con `type_form` como filtro obligatorio
  let whereConditions = {
   type_form: { [Op.like]: `%${type_form}%` }
  };

  // Construir condiciones de búsqueda adicionales basadas en los parámetros proporcionados
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

  // Realizar la consulta principal con las condiciones construidas usando `raw: true`
  let data = await models.Product.findAll({
   where: whereConditions,
   order: Sequelize.literal('RAND()'),
   limit: 12,
   raw: true, // Devolver objetos planos
  });

  let resultsCount = data.length;

  // Si no se encontraron productos que coincidan con todos los filtros proporcionados
  if (resultsCount < 12) {
   const countToComplete = 12 - resultsCount;
   let additionalData = [];

   // Si hay `brand`, `collection` y `type`, pero no suficientes resultados, ignorar `type`
   if (brand && collection && type) {
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

   // Si aún faltan productos y hay `brand` y `collection`, buscar solo por `brand` y `type_form`
   if (resultsCount < 12 && brand && collection) {
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

   // Si aún faltan productos y hay `type`, buscar solo por `type` y `type_form` en otras marcas
   if (resultsCount < 12 && type) {
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

   // Si aún no hay suficientes productos, buscar solo por `type_form`
   if (resultsCount < 12) {
    const additionalCount = 12 - resultsCount;
    additionalData = await models.Product.findAll({
     where: {
      type_form: { [Op.like]: `%${type_form}%` },
      id: { [Op.notIn]: data.map(product => product.id) }
     },
     order: Sequelize.literal('RAND()'),
     limit: additionalCount,
     raw: true, // Devolver objetos planos
    });

    data = data.concat(additionalData);
   }

   // Enviar la respuesta con los datos encontrados
   res.status(200).json(data);
   return;
  }

  // Enviar la respuesta con los datos encontrados
  res.status(200).json(data);
 } catch (error) {
  console.error("Error al consultar los productos:", error);
  res.status(500).json({ error: "Error al consultar los productos" });
 }
};

export default getProductWithTypeForm;
