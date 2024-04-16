
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { saveToDatabase } from "../../db/saveBlog.js";
import { geminiGenerator } from './gemini.js';



dotenv.config();

const openAIInstance = new OpenAI({ apiKey: process.env.OPEN_IA_API });

export async function openaiGenerator(req, res) {
 try {
  const seo = await openAIInstance.chat.completions.create({
   messages: [
    {
     role: "system",
     content: `you are a helpful assistant designet to output JSON.`,
    },
    {
     role: "user", content: `Let's turbocharge your blog articles for SEO success! Choose a topic from the exciting world of technology, artificial intelligence, machine learning, data science, or programming. Now, craft a title that not only captures the essence of your article but also includes important keywords to attract search engine traffic.

     For the description, think of it as a sneak peek into the treasure trove of knowledge awaiting your readers. Keep it concise, informative, and packed with relevant keywords to improve your article's visibility in search results.
     
     Next, the slug – this is your article's URL, so make it count! Choose a slug that's short, descriptive, and includes key keywords. It should give readers a clear idea of what your article is about and entice them to click through.
     
     And finally, the tags – these are your article's best friends for categorization and discoverability. Choose tags that accurately represent the topics covered in your article, making it easier for readers to find and for search engines to index.
     
     Once you have all these elements ready, package them neatly into a JSON object format. With your SEO-optimized metadata in place, your blog articles will be ready to conquer the digital landscape and attract waves of eager readers. Let's make your content shine!`
    },
   ],
   // prompt: `transform this to json: ${response}`,
   model: "gpt-3.5-turbo-0125",
   response_format: { type: "json_object" },
  });

  const text = JSON.parse(seo.choices[0].message.content)

  const article = await geminiGenerator(text)

  const post = {
   title: text.title,
   description: text.description,
   tags: text.tags,
   slug: text.slug,
   content: article
  }

  await saveToDatabase(post)

  res.status(201).json(post)

 } catch (e) {
  res.status(500).send(error.message)
 }

} 