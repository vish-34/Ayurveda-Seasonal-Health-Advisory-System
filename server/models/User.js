import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    occupation: { type: String, required: true },
    lifestyle: { type: String, required: true }, // Sedentary, Active, Moderately Active, etc.
    dietType: { type: String, required: true },  // Vegetarian, Vegan, Non-Vegetarian, etc.
    sleepTime: { type: String, required: true },
    wakeTime: { type: String, required: true },
    disclaimerAccepted: { type: Boolean, required: true, default: false },
    role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
    
    // Dosha Assessment Profile
    doshaProfile: {
      vataScore: { type: Number, default: 0 },
      pittaScore: { type: Number, default: 0 },
      kaphaScore: { type: Number, default: 0 },
      dominantDosha: { type: String, default: null }, // 'Vata', 'Pitta', 'Kapha'
      assessedAt: { type: Date }
    },

    // Daily Water Tracking (demostration widget)
    waterLog: [
      {
        date: { type: String }, // YYYY-MM-DD
        amount: { type: Number, default: 0 } // in ml
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
