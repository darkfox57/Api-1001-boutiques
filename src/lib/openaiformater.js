
import dotenv from 'dotenv';
import OpenAI from 'openai';



dotenv.config();

const openAIInstance = new OpenAI({ apiKey: process.env.OPEN_IA_API });

export async function openaiFormater(text) {
 try {
  const seo = await openAIInstance.chat.completions.create({
   messages: [
    {
     role: "system",
     content: `you are a helpful assistant designet to output JSON.`,
    },
    {
     role: "user", content: `You need to take this string ${text} and fix it to work as a javascript object`
    },
   ],
   // prompt: `transform this to json: ${response}`,
   model: "gpt-4-turbo",
   response_format: { type: "json_object" },
  });



  const res = JSON.parse(seo.choices[0].message.content)



  return res

 } catch (e) {
  res.status(500).send(e.message)
 }

} 