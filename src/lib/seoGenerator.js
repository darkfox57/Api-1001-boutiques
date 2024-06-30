
import { claude } from "../controllers/content-generators/claude.js";

export async function seoGenerator(name, type) {

  const prompt = `
    As an SEO expert, your task is to create a meta title, meta description, and meta keywords optimized for SEO for a luxury lingerie blog named 'Marques de Lingerie'. The blog specifically covers brands, collections and types of garments from luxury lingerie brands for both men and women. 

    meta_title: Generate a catchy and SEO-friendly title for the blog listing page.
    meta_desc: Write a compelling meta description that accurately summarizes the article's listing content and entices readers to engage with it.
    meta_keywords: Provide a list of relevant keywords related to the article's listing subject matter.

     Once you have completed the task, format the output as a JSON object with the following structure:
    { 
    meta_title: 'Your optimized meta title here', 
    meta_desc: 'Your optimized meta description here', 
    meta_keywords: 'Your optimized meta keywords here' 
    }. 
    Additionally, the blog focuses on a specific ${type}, which is ${name}. Ensure that the JSON object you create is highly optimized for SEO in French and return only de json object.
    `

  try {
    const response = await claude(prompt)

    const data = JSON.parse(response)

    function formatText(text) {
      return text.replace(/\s+:/g, ':');
    }

    const post = {
      meta_title: formatText(data.meta_title),
      meta_desc: formatText(data.meta_desc),
      meta_keywords: data.meta_keywords,
    };
    return post
  } catch (error) {
    console.log(error.message);
    return { message: error.message }
  }

}


