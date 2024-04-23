
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { saveBlog } from "../../db/saveBlog.js";



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
      "category": "article category"
      "tags": ["tag1", "tag2", "tag3"],
      "content": "# Article title
     
         
     Write the introduction of the article here.
     
     <h2> Subtitle 1 </h2>
     
     Write the content of subtitle 1 here.
     
     <h3> Subtitle 1.1</h3>
     
     Write the content of subtitle 1.1 here.
     
     <h4> Subtitle 2 </h4>
     
     Write the content of subtitle 2 here.
     
     <h4> Subtitle 2.1 </h4>
     
     Write the content of subtitle 2.1 here.
     
     <h4> Conclusion </h4>
     
     Write the conclusion of the article here.
     
     *Note:* You can add more subheadings and sections as needed.
     "
     }
     
     Instructions:
     Choose one of the following themes: lingerie, underwear, fashion, lingerie tips
     Fill in the "title", "description", "slug", "category" and "tags" fields of the JSON.
     Write the content of the article with at least 2000 words in html format in the "content" field.
     Use relevant keywords in the title, description, tags, and article content.
     Make sure the title is catchy and the description is informative.
     Use a clear and organized structure in the content of the article. freely include lists, dates and everything you need.
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

  // res.status(201).json(article);

  const post = {
   title: text.title,
   description: text.description,
   tags: text.tags,
   category: text.category,
   slug: text.slug,
   content: text.content,
   published: true,
   img: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'

  };

  // console.log(post);

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