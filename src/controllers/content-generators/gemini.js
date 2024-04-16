import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { saveToDatabase } from "../../db/saveBlog.js";
import { openaiGenerator } from "./openai.js";
dotenv.config();

const api_key = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(api_key);
const generationConfig = { temperature: 0.9, topP: 1, topK: 50, maxOutputTokens: 4096 };

const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

export async function geminiGenerator(text) {
  console.log(text);
  try {
    const prompt = ` 
    Let's dive into crafting an epic blog article! Your mission, should you choose to accept it, is to write an article with a minimum of 2000 words. The article should be titled with something captivating like ${text.title} and have a description that hooks readers from the get-go: ${text.description}.

Now, unleash your creativity and delve deep into the topic, leaving no stone unturned. Cover every angle, provide valuable insights, adding images for reference and engage your readers with compelling storytelling. Remember, the goal is to educate, entertain, and inspire.

Once your masterpiece is complete, it's time to give it the perfect finishing touch – format it in Markdown. Add headings, subheadings, bullet points, and whatever else you need to make your article visually appealing and easy to read.

With your article polished and ready to go, it's time to share your wisdom with the world. Publish it on your website and watch as your audience is captivated by your words. Let's make magic happen!
  `;

    const result = await model.generateContent(prompt);
    console.log(result.response.candidates[0]);
    // const response = result.response.candidates[0].content.parts[0].text;

    // // console.log(response);
    // const article = response.toString();

    // return article

  } catch (err) {
    console.log(err.message);
  }
}