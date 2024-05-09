import {
 AccessDeniedException,
 BedrockRuntimeClient,
 InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import axios from "axios";
import dotenv from 'dotenv';


dotenv.config();


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
   width: 1024,
   height: 1024,
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
  const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
   file: `data:image/png;base64,${base64Data}`,
   upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
   folder: 'ai-blog'
  });
  if (response.status !== 200) {
   throw new Error('Failed to upload image to Cloudinary');
  }


  res.status(201).json(response.data.secure_url);


 } catch (error) {
  return res.status(500).json({ message: error.message })
 }
};
