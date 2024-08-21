import dotenv from 'dotenv';
import models from '../../db.js';
import { saveBlog } from "../../db/saveBlog.js";
import imgSearch from '../../lib/cloudinarySearch.js';
import { claude } from "./claude.js";

dotenv.config();


export async function generator(req, res) {
  const { keywords, lang, brand, collection, type } = req.query;

  const prompt = `You are a talented and versatile content writer tasked with generating a comprehensive blog article by the topic: ${keywords}. Your article should include the following elements:

    Title: Generate a catchy and SEO-friendly title for the blog article. it's important to avoid using of the words confort and elegance.
    Slug: Create a URL-friendly slug based on the title.
    Description: Write a compelling meta description that accurately summarizes the article's content and entices readers to engage with it.
    Tags: Provide a list of relevant tags or keywords related to the article's subject matter. If there is a brand name or collection, place it first in the tags, followed by the rest of the tags.
    Category: Assign the article to an appropriate category.
    brand: If brand is empty return null
    collection: If collection is empty return null
    type: If type is empty return null
    Content: Write the main body of the article in HTML format with at least 700 words and max 2000 words, including headings (do not generate h1 tags), paragraphs, lists, and any other relevant elements. The content should be informative, well-researched, and engaging for the target audience. keep in mind that this is an string that's going to be in javascript, wrapped in double quotation marks, it must be save it as an string. Do not generate blank spaces between html tags.
    
    Once you have completed the article, format the output as a JSON object with the following structure:
    
    {
      "title": "...",
      "slug": "...",
      "description": "...",
      "brand": ${brand},
      "collection": ${collection},
      "type": ${type},
      "tags": [...],
      "category": "...",
      "content": "...", 
    }
    
    Please ensure that the content is well-structured, free of grammatical errors, and adheres to best practices for web content writing and writen in ${lang}.
  `;

  try {
    const response = await claude(prompt);
    const data = JSON.parse(response);

    const image = await imgSearch(data.brand, data.collection, data.type);

    function formatText(text) {
      return text.replace(/\s+:/g, ':');
    }

    const post = {
      title: formatText(data.title),
      description: formatText(data.description),
      brand: data.brand,
      collection: data.collection,
      type: data.type,
      tags: data.tags,
      category: data.category,
      slug: data.slug,
      content: formatText(data.content),
      published: true,
      img: image,
    };

    await saveBlog(post);


    // Verifica la existencia de keywords en la base de datos antes de actualizar
    const keywordEntry = await models.Search_keywords.findOne({ where: { keyword: keywords } });
    if (keywordEntry) { // Verificación de existencia
      await models.Search_keywords.update(
        { published: true },
        { where: { keyword: keywords } }
      );
    }

    res.status(201).json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
}
