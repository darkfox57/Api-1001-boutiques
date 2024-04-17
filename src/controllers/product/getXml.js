import axios from 'axios';
import xml2js from 'xml2js';
import { saveProduct } from '../../db/saveProduct.js';

const url = 'https://export.shopping-feed.com/stream/f41397a07553474257b5ca17b71725cc'

export async function getXml(req, res) {
 try {

  // Realizar la solicitud HTTP
  const response = await axios.get(url);

  // Obtener el contenido XML de la respuesta
  const xml = response.data;

  // Parsear el XML a JSON
  xml2js.parseString(xml, async (err, result) => {
   if (err) {
    console.error('Error al convertir XML a JSON:', err);
    res.status(500).json({ error: 'Error al convertir XML a JSON' });
    return;
   }
   // Enviar el JSON como respuesta
   const products = result?.products?.catalogo || [];

   console.log('depurando productos', products);

   for (const product of products) {
    try {
     await saveProduct(product);
    } catch (error) {
     console.error('Error al guardar el producto en la base de datos:', error);
    }
   }

   res.status(200).json(result);
  });
 } catch (error) {
  console.error('Error al realizar la solicitud HTTP:', error);
  res.status(500).json({ error: 'Error al realizar la solicitud HTTP' });
 }
}