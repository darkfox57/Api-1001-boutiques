import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const api_key = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(api_key);
const generationConfig = { temperature: 0.9, topP: 1, topK: 50, maxOutputTokens: 4096 };

const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

export async function geminiGenerator({ content }) {
  try {
    const prompt = `
    You are a copywriter who needs to improve an already written blog article. You want to enhance the tone, structure, and optimize it for SEO. You are free to modify the text, add new paragraphs, lists, titles, etc. You have to return the article in HTML format (you dont need to add html, head or body tags, just the content tags). The article must contain a minimum of 2000 words.
    this is the text you need to check:
    ${content}
    
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const article = text.toString();

    return article

  } catch (err) {
    console.log(err.message);
  }
}