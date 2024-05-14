import {
 AccessDeniedException,
 BedrockRuntimeClient,
 InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import dotenv from 'dotenv';
import fs from 'fs/promises';
import jimp from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from "../../lib/cloudinaryUpload.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function titan_img(req, res) {

 const { text } = req.query

 const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
 })

 const payload = {
  textToImageParams: {
   text: `you need to generate a featured image for this article ${text}`
  },
  taskType: "TEXT_IMAGE",
  imageGenerationConfig: {
   cfgScale: 8,
   seed: 0,
   quality: "standard",
   width: 1408,
   height: 640,
   numberOfImages: 1
  }
 };

 const command = new InvokeModelCommand({
  body: JSON.stringify(payload),
  contentType: "application/json",
  accept: "application/json",
  modelId: "amazon.titan-image-generator-v1"
 });
 try {
  const { body } = await client.send(command);
  const base64Data = body.toString('base64');

  // Decodificar la cadena base64 y guardar como archivo temporal
  const imagePath = path.join(__dirname, 'temp', `image-${Date.now()}.png`);
  const imageBuffer = Buffer.from(base64Data, 'base64');
  await fs.mkdir(path.dirname(imagePath), { recursive: true });
  await fs.writeFile(imagePath, imageBuffer);

  console.log(imagePath, imageBuffer);

  // Cargar el archivo temporal en Cloudinary
  const uploadResponse = await cloudinary.uploader.upload(imagePath, {
   folder: "ai-blog"
  });

  // Eliminar el archivo temporal
  await fs.unlink(imagePath);

  res.status(201).json(uploadResponse);

 } catch (error) {
  return res.status(500).json({ message: error.message })
 }
};
