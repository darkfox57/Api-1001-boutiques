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
  }

  // Realizar la consulta a la base de datos con las condiciones construidas
  const data = await models.Product.findAll({
   where: whereConditions,
   order: Sequelize.literal('RAND()'),  // Seleccionar productos aleatoriamente
   limit: 12  // Limitar el número de resultados a 8
  });

  res.status(200).json(data);
 } catch (error) {
  console.error("Error al consultar los productos:", error);
  res.status(500).json({ error: "Error al consultar los productos" });
 }
};

export default getProductByTag;
