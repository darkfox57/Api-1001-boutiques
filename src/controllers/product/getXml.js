import axios from 'axios';
import xml2js from 'xml2js';
import { saveProduct } from '../../db/saveProduct.js';

const url = 'https://export.shopping-feed.com/stream/f41397a07553474257b5ca17b71725cc';

export async function getXml(req, res) {
    try {
        const response = await axios.get(url);
        const xml = response.data;

        xml2js.parseString(xml, async (err, result) => {
            if (err) {
                console.error('Error al convertir XML a JSON:', err);
                res.status(500).json({ error: 'Error al convertir XML a JSON' });
                return;
            }

            const products = result?.products?.catalogo || [];
            console.log('depurando productos', products);

            const savedProducts = await saveProducts(products);
            res.status(200).json(savedProducts);
        });
    } catch (error) {
        console.error('Error al realizar la solicitud HTTP:', error);
        res.status(500).json({ error: 'Error al realizar la solicitud HTTP' });
    }
}

async function saveProducts(products) {
    const concurrencyLimit = 5; // Limita el número de operaciones concurrentes
    const savePromises = [];
    for (let i = 0; i < products.length; i += concurrencyLimit) {
        const chunk = products.slice(i, i + concurrencyLimit).map(product =>
            saveProduct(product).catch(error => {
                console.error('Error al guardar el producto en la base de datos:', error);
                return null; // Devuelve null en caso de error para continuar con los otros productos
            })
        );
        const chunkResults = await Promise.all(chunk);
        savePromises.push(...chunkResults);
    }
    return savePromises.filter(product => product !== null); // Filtra los productos que no fueron guardados
}
