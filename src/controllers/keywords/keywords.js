import axios from 'axios';
import csvParser from 'csv-parser';
import * as fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import models from '../../db.js';

export default async function getKeywords(req, res) {
 const sheetUrl = 'https://docs.google.com/spreadsheets/d/1Utf_ZWgA7gSSJfwCOt6ZHcaBz1hOJf7sMs_TFg42hkc/export?format=csv';
 const data = [];
 try {
  const response = await axios.get(sheetUrl, { responseType: 'stream' });
  const csvPath = path.join(process.cwd(), 'data.csv');
  const writer = fs.createWriteStream(csvPath);

  response.data.pipe(writer);
  await new Promise((resolve, reject) => {
   writer.on('finish', resolve);
   writer.on('error', reject);
  });

  const stream = fs.createReadStream(csvPath);
  await new Promise((resolve, reject) => {
   stream.pipe(csvParser())
    .on('data', (row) => {
     data.push(row);
    })
    .on('end', resolve)
    .on('error', reject);
  });

  // Proceso de guardado en la base de datos
  for (const item of data) {
   const { QUESTION, BRAND, COLLECTION, SHAPE } = item;

   // Verifica si el keyword ya existe
   const exists = await models.Search_keywords.findOne({
    where: { keyword: QUESTION }
   });

   // Si no existe, guarda el nuevo registro
   if (!exists) {
    await models.Search_keywords.create({
     keyword: QUESTION,
     brand: BRAND,
     collection: COLLECTION,
     type: SHAPE,
     published: false,
    });
    console.log(`Keyword created: ${QUESTION}`);
   } else {
    console.log(`Keyword already exists: ${QUESTION}`);
   }
  }

  res.status(201).json({ message: 'Keywords processed and saved successfully' });
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
}
