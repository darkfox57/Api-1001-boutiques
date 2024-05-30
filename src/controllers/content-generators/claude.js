import {
 AccessDeniedException,
 BedrockRuntimeClient,
 InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";


export async function claude(prompt) {


 const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
 })

 const bodyAi21Labs = {
  prompt: prompt,
  maxTokens: 400,
  temperature: 0.9,
  topP: 0.9,
  stopSequences: [],
  countPenalty: { scale: 0 },
  presencePenalty: { scale: 0 },
  frequencyPenalty: { scale: 0 }
 }
 const payloadAI21Labs = {
  modelId: "ai21.j2-ultra-v1",
  contentType: "application/json",
  accept: "application/json",
  body: JSON.stringify(bodyAi21Labs)
 };

 const bodyTitan = { inputText: prompt }

 const payloadTitan = {
  modelId: "amazon.titan-embed-text-v1",
  contentType: "application/json",
  accept: "application/json",
  body: JSON.stringify(bodyTitan)
 }


 const bodyAnthropic = {
  messages: [
   {
    "role": "user",
    "content": [
     {
      "type": "text",
      "text": prompt
     }
    ]
   }
  ],
  max_tokens: 4096,
  top_k: 500,
  temperature: 0.5,
  top_p: 0.9,
  anthropic_version: "bedrock-2023-05-31",
  stop_sequences: ['Human']
 }

 const payloadAnthropic = {
  contentType: "application/json",
  accept: "application/json",
  modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
  body: JSON.stringify(bodyAnthropic),
 };

 const command = new InvokeModelCommand(payloadAnthropic);
 try {
  const response = await client.send(command);
  const decodedResponseBody = new TextDecoder().decode(response.body);
  const responseBody = JSON.parse(decodedResponseBody);

  const { text } = responseBody.content[0];

  return text

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
