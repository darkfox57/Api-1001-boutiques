
export default async function home(req, res) {
 try {
  res.status(201).json('aplicacion activa')
 }
 catch (e) {
  res.status(500).json('something went wrong')
 }
}