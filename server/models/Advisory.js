import mongoose from 'mongoose';

const advisorySchema = new mongoose.Schema(
  {
    dosha: {
      type: String,
      required: true,
      enum: ['Vata', 'Pitta', 'Kapha']
    },
    season: {
      type: String,
      required: true,
      enum: ['Shishira', 'Vasanta', 'Grishma', 'Varsha', 'Sharad', 'Hemanta']
    },
    category: {
      type: String,
      required: true,
      enum: ['Diet', 'Herbs', 'Yoga', 'Daily Routine', 'Precautions']
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: [String], // Array of advisory points for flexibility and presentation
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published'
    }
  },
  {
    timestamps: true
  }
);

// Compounding unique index to avoid duplicates of categories per dosha+season
advisorySchema.index({ dosha: 1, season: 1, category: 1 }, { unique: true });

const Advisory = mongoose.model('Advisory', advisorySchema);
export default Advisory;
