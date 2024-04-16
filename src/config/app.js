import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import routes from '../routes/index.js';


dotenv.config();
const server = express()

server.use(express.json())

server.use((req, res, next) => {
 res.header('Access-Control-Allow-Origin', '*')
 res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
 res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
 res.header('Access-Control-Allow-Credentials', 'false')
 next()
})

server.use(morgan('dev'))
server.use('/', routes)

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
 const status = err.status || 500;
 const message = err.message || err;
 console.error(err);
 res.status(status).send(message);
});

export default server