import dotenv from 'dotenv';
import models from '../db.js';

dotenv.config();


// Function to save the response to the database
export const saveBlog = async (post) => {
 try {

  // Create a new Post instance based on the post object
  const newPost = await models.Blog.create({
   ...post
  });

  return newPost

 } catch (error) {
  console.error('Error saving blog post information:', error);
  res.status(500).json({ error: 'Internal Server Error' });
 }
};



