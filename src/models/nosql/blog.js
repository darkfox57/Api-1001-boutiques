import mongoose from 'mongoose';

// Define el esquema del blog
const blogSchema = new mongoose.Schema({
 title: {
  type: String,
 },
 description: {
  type: String,
 },
 slug: {
  type: String,
 },
 content: {
  type: String,
 },
 tags: [{ type: String }]
},
 {
  timestamps: true,
  versionKey: false
 });


const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

