import dotenv from 'dotenv';
import { saveBlog } from "../../db/saveBlog.js";
import { openaiFormater } from '../../lib/openaiformater.js';
import { claude } from "./claude.js";


dotenv.config();

export async function generator(req, res) {

  const { keywords, lang } = req.query

  const prompt = `You are a talented and versatile content writer tasked with generating a comprehensive blog article by the topic: ${keywords}. Your article should include the following elements:

 Title: Generate a catchy and SEO-friendly title for the blog article.
 
 Slug: Create a URL-friendly slug based on the title.
 
 Description: Write a compelling meta description that accurately summarizes the article's content and entices readers to engage with it.
 
 Tags: Provide a list of relevant tags or keywords related to the article's subject matter.
 
 Category: Assign the article to an appropriate category or categories.
 
 Content: Write the main body of the article in HTML format with at least 700 words and max 2000 words, including headings, paragraphs, lists, and any other relevant elements. The content should be informative, well-researched, and engaging for the target audience. keep in mind that this is an string that's going to be in javascript, wrap the content into backticks.
 
 Once you have completed the article, format the output as a JSON object with the following structure:
 
 {
   "title": "...",
   "slug": "...",
   "description": "...",
   "tags": [...],
   "category": "...",
   "content": ...
 }
 
 Please ensure that the content is well-structured, free of grammatical errors, and adheres to best practices for web content writing and writen in ${lang}.
`

  try {
    const response = await claude(prompt)


    const text = response.replace('\n', '')
      .replace('\', ').replace('\n\n\n"', '').replace(/\n\s*/g, '').replace(/^{\s*|\s*}$/g, '').replace(/([a-zA-Z_]+):/g, '"$1":').replace(/`/g, '"').replace('-', ' ').replace(/\\u200b/g, '').replace(/\\"/g, '\\"')

    const data = await openaiFormater(text)

    const post = {
      title: data.title,
      description: data.description,
      tags: data.tags,
      category: [data.category],
      slug: data.slug,
      content: data.content,
      published: true,
      img: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    };

    await saveBlog(post)

    res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

}