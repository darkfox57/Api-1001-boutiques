import dotenv from 'dotenv';
import models from '../db.js';

dotenv.config();


// Function to save the response to the database
export const saveToDatabase = async (post) => {
 try {


  // Create a new Post instance based on the post object
  const newPost = await models.Blog.create({
   ...post
  });

  res.status(201).json(newPost)

 } catch (error) {
  console.error('Error saving blog post information:', error);
 }
};




