
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { saveBlog } from "../../db/saveBlog.js";
// import { geminiGenerator } from './gemini.js';



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
     role: "user", content: `{
      "title": "Title of the article",
      "descripcion": "Description of the item (maximum 160 characters)",
      "slug": "article-slug",
      "tags": ["tag1", "tag2", "tag3"],
      "content": "# Article title
     
     ## Introduction
     
     Write the introduction of the article here.
     
     ## Subtitle 1
     
     Write the content of subtitle 1 here.
     
     ### Subtitle 1.1
     
     Write the content of subtitle 1.1 here.
     
     ## Subtitle 2
     
     Write the content of subtitle 2 here.
     
     ### Subtitle 2.1
     
     Write the content of subtitle 2.1 here.
     
     ## Conclusion
     
     Write the conclusion of the article here.
     
     *Note:* You can add more subheadings and sections as needed.
     "
     }
     
     Instructions:
     Choose one of the following themes: lingerie, underwear, fashion, lingerie tips
     Fill in the "title", "description", "slug" and "tags" fields of the JSON.
     Write the content of the article with at least 2000 words in markdown format in the "content" field.
     Use relevant keywords in the title, description, tags, and article content.
     Make sure the title is catchy and the description is informative.
     Use a clear and organized structure in the content of the article.
     Include images in the middle of the content to improve the user experience.
     Finally it returns only the JSON, write all the content, title, description, slug and tags in french`
    },
   ],
   // prompt: `transform this to json: ${response}`,
   model: "gpt-4-turbo",
   response_format: { type: "json_object" },
  });



  const text = JSON.parse(seo.choices[0].message.content)

  // const article = await geminiGenerator(text)

  const post = {
   title: text.title,
   description: text.description,
   tags: text.tags,
   slug: text.slug,
   content: text.content
  };

  // Verificar si alguno de los elementos del objeto está vacío
  const emptyFields = Object.entries(post)
   .filter(([key, value]) => value === undefined || value === null || value === '')
   .map(([key, value]) => key);

  if (emptyFields.length > 0) {
   const errorMessage = `Los siguientes campos están incompletos: ${emptyFields.join(', ')}`;
   throw new Error(errorMessage);
  } else {
   await saveBlog(post);
   res.status(201).json(post);
  }

 } catch (e) {
  res.status(500).send(e.message)
 }

} 