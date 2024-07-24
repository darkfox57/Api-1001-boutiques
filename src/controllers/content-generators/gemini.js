// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from 'dotenv';
// dotenv.config();

// const api_key = process.env.GOOGLE_API_KEY;
// const genAI = new GoogleGenerativeAI(api_key);
// const generationConfig = { temperature: 0.9, topP: 1, topK: 50, maxOutputTokens: 4096 };

// const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

// export async function geminiGenerator({ content }) {
//   try {
//     const prompt = `
//     You're a seasoned copywriter tasked with revamping an existing blog post. Your mission? To craft a masterpiece that not only engages readers but also dominates search engine results.

//     Here's what you need to do:

//     Content Audit: Start by thoroughly analyzing the current article. What are its strengths and weaknesses? Are there any knowledge gaps or outdated information?
//     Structure & Flow: Revamp the structure for optimal readability. Consider catchy headlines, subheadings, bullet points, and numbered lists to break up text and guide readers.
//     Tone & Voice: Infuse the content with a captivating tone that aligns with the target audience. Is it informative and professional? Playful and conversational? Tailor it to resonate with your readers.
//     SEO Optimization: Integrate relevant keywords naturally throughout the text. Utilize meta descriptions and header tags strategically to boost search engine ranking.
//     Content Expansion (Optional): Don't be afraid to add fresh content! This could include new data, case studies, expert quotes, or even multimedia elements like infographics or videos to enhance user experience.
//     Deliverables:

//     Polished and SEO-optimized blog post (minimum 2000 words) and return it in html format, you dont need to generate de html, head and body tag just the content tags (this is very important).
//     Bonus Points:

//     By following these guidelines, you'll transform the blog post into a powerful tool that attracts, informs, and converts readers. Good luck!

//     this is the text you need to review:
//     ${content}
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     const article = text.toString();

//     return article

//   } catch (err) {
//     console.log(err.message);
//   }
// }