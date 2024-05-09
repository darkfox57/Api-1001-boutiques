import {
 AccessDeniedException,
 BedrockRuntimeClient,
 InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export async function titan_img(req, res) {

 const { text } = req.query

 console.log(text);


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
  const response = await client.send(command);

  console.log(response);

  // const decodedResponseBody = new TextDecoder().decode(response.body);
  // const responseBody = JSON.parse(decodedResponseBody);

  // const { text } = responseBody.content[0];

  // return text

 } catch (err) {
  if (err instanceof AccessDeniedException) {
   console.error(
    `Access denied. Ensure you have the correct permissions to invoke ${modelId}.`,
   );
  } else {
   throw err;
  }
 }
};
