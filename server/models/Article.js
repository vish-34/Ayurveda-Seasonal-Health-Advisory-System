import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // Markdown or plain text content
    author: { type: String, required: true, default: 'Ayurveda Advisory Board' },
    tags: { type: [String], default: [] },
    coverImage: { type: String, default: '' },
    readTime: { type: String, default: '5 mins' }
  },
  {
    timestamps: true
  }
);

const Article = mongoose.model('Article', articleSchema);
export default Article;
