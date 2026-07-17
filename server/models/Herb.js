import mongoose from 'mongoose';

const herbSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    benefits: { type: [String], required: true },
    howToUse: { type: String, required: true },
    image: { type: String, default: '' }, // URL path or placeholder
    doshaAffinity: { type: [String], default: [] }, // ['Vata', 'Pitta', 'Kapha']
    seasons: { type: [String], default: [] } // ['Shishira', 'Vasanta', etc.]
  },
  {
    timestamps: true
  }
);

const Herb = mongoose.model('Herb', herbSchema);
export default Herb;
