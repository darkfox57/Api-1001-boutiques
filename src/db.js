import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
 host: DB_HOST,
 dialect: 'mysql',
 logging: false
});

const __dirname = path.dirname(import.meta.url);
const basename = path.basename(import.meta.url);

const modelDefiners = [];

const modelFiles = readdirSync(path.join('./src/models/sql')).filter(
 (file) => file.endsWith('.js') && file !== basename
);

for (const file of modelFiles) {
 const modelPath = path.join(__dirname, './models/sql', file);
 const modelDefiner = await import(modelPath);
 modelDefiners.push(modelDefiner.default);
}

for (const modelDefiner of modelDefiners) {
 modelDefiner(sequelize);
}

const entries = Object.entries(sequelize.models);
const capEntries = entries.map(([key, value]) => [key.charAt(0).toUpperCase() + key.slice(1), value]);
sequelize.models = Object.fromEntries(capEntries);

const models = {};
for (const [key, value] of Object.entries(sequelize.models)) {
 models[key] = value;
}

export const conn = sequelize;
export default models;




