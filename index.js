import server from "./src/config/app.js";
import { conn } from './src/db.js';
const PORT = process.env.PORT;


conn.sync({ force: false }).then(() => {
 server.listen(PORT, () => {
  console.log(
   `your application runing! check here 🔥  => http://localhost:${PORT}`
  );
 });
})

