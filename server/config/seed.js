import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Advisory from '../models/Advisory.js';
import Herb from '../models/Herb.js';
import Article from '../models/Article.js';

dotenv.config();

// Seeding data
const users = [
  {
    name: 'Admin Ayurveda',
    email: 'admin@ayurveda.com',
    password: 'admin123', // Will be hashed in Schema pre-save
    age: 35,
    gender: 'Other',
    country: 'India',
    state: 'Kerala',
    city: 'Trivandrum',
    occupation: 'Ayurvedic Doctor',
    lifestyle: 'Moderately Active',
    dietType: 'Vegetarian',
    sleepTime: '22:00',
    wakeTime: '05:30',
    disclaimerAccepted: true,
    role: 'admin',
    doshaProfile: {
      vataScore: 33,
      pittaScore: 34,
      kaphaScore: 33,
      dominantDosha: 'Pitta',
      assessedAt: new Date()
    }
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    password: 'user123',
    age: 26,
    gender: 'Male',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    occupation: 'Software Engineer',
    lifestyle: 'Sedentary',
    dietType: 'Non-Vegetarian',
    sleepTime: '23:30',
    wakeTime: '07:30',
    disclaimerAccepted: true,
    role: 'user',
    doshaProfile: {
      vataScore: 60,
      pittaScore: 30,
      kaphaScore: 10,
      dominantDosha: 'Vata',
      assessedAt: new Date()
    }
  }
];

const herbs = [
  {
    name: 'Ashwagandha',
    description: 'A powerful adaptogenic herb known as "Indian Ginseng." It helps the body manage stress, boosts energy, and strengthens the immune system.',
    benefits: [
      'Reduces stress and anxiety levels by lowering cortisol.',
      'Improves muscle mass, strength, and physical endurance.',
      'Enhances memory, cognitive function, and sleep quality.'
    ],
    howToUse: 'Take 1/2 teaspoon of Ashwagandha powder (Churna) with warm milk or water before sleep, or take 1 capsule twice daily.',
    doshaAffinity: ['Vata', 'Kapha'],
    seasons: ['Shishira', 'Hemanta', 'Sharad']
  },
  {
    name: 'Tulsi (Holy Basil)',
    description: 'Considered the "Queen of Herbs," Tulsi is highly revered in Ayurveda for its purifying and respiratory-supportive properties.',
    benefits: [
      'Boosts respiratory health and relieves cough, cold, and asthma.',
      'Possesses powerful antimicrobial and anti-inflammatory properties.',
      'Helps detoxify the body and relieves emotional stress.'
    ],
    howToUse: 'Brew 4-5 fresh leaves in hot water for Tulsi tea, or take 15-20 drops of Tulsi juice/extract in morning.',
    doshaAffinity: ['Vata', 'Kapha'],
    seasons: ['Vasanta', 'Varsha', 'Shishira']
  },
  {
    name: 'Triphala',
    description: 'A traditional Ayurvedic formulation consisting of three fruits: Amalaki, Bibhitaki, and Haritaki. It is the premier digestive cleanser.',
    benefits: [
      'Gently detoxifies the entire digestive tract and relieves constipation.',
      'Supports healthy digestion, nutrient absorption, and metabolism.',
      'Rich in antioxidants, helping to protect cells from damage.'
    ],
    howToUse: 'Mix 1/2 to 1 teaspoon of Triphala powder in a cup of warm water and drink it 30 minutes before bedtime.',
    doshaAffinity: ['Vata', 'Pitta', 'Kapha'],
    seasons: ['Shishira', 'Vasanta', 'Grishma', 'Varsha', 'Sharad', 'Hemanta']
  },
  {
    name: 'Amalaki (Amla)',
    description: 'Indian Gooseberry is one of the richest natural sources of Vitamin C and a premier rasayana (rejuvenator) for cooling Pitta.',
    benefits: [
      'Promotes glowing skin, hair growth, and strengthens eyesight.',
      'Boosts liver function, purifies blood, and aids digestion.',
      'Powerful natural immunomodulator.'
    ],
    howToUse: 'Take 1 teaspoon of Amla powder with warm water in the morning, or consume fresh amla juice daily.',
    doshaAffinity: ['Pitta', 'Vata'],
    seasons: ['Sharad', 'Grishma', 'Hemanta']
  },
  {
    name: 'Brahmi',
    description: 'A renowned brain tonic that revitalizes brain cells, supports nervous system health, and enhances mental clarity.',
    benefits: [
      'Improves concentration, learning capability, and memory retention.',
      'Calms the nervous system and reduces mental fatigue.',
      'Aids in managing ADHD, anxiety, and sleep disorders.'
    ],
    howToUse: 'Take 1 capsule twice daily, or consume 1/2 teaspoon of Brahmi powder mixed with warm ghee or water.',
    doshaAffinity: ['Pitta', 'Vata', 'Kapha'],
    seasons: ['Grishma', 'Sharad', 'Vasanta']
  },
  {
    name: 'Ginger (Ardraka)',
    description: 'Known as the "Universal Medicine" (Vishwabhesaja), ginger stokes the digestive fire (Agni) and destroys toxins (Ama).',
    benefits: [
      'Relieves nausea, motion sickness, and digestive upset.',
      'Alleviates joint pain due to its anti-inflammatory properties.',
      'Clears mucus congestion and promotes healthy circulation.'
    ],
    howToUse: 'Drink fresh ginger tea before or after meals, or chew a small slice of ginger with a pinch of rock salt.',
    doshaAffinity: ['Vata', 'Kapha'],
    seasons: ['Varsha', 'Shishira', 'Hemanta']
  }
];

const articles = [
  {
    title: 'Understanding Ritucharya: The Ayurvedic Science of Seasonal Living',
    content: `In Ayurveda, health is defined as a state of dynamic balance between our internal environment and the external world. Ritucharya (Ritu = season, Charya = regimen) is the ancient Ayurvedic guide to adapting our diet, lifestyle, and routines to the changes in seasons. 

### Why Seasonal Regimens Matter
As seasons change, the elements (earth, water, fire, air, space) in nature fluctuate. Since we are part of nature, our bodies and minds experience these same shifts. For instance, the hot dry winds of Summer (Grishma) increase dry, heat elements in our bodies, which can accumulate Pitta. The rainy, damp Monsoon (Varsha) aggravates Vata.

By adopting seasonal guidelines, we can:
1. Prevent the accumulation of excess Doshas (Vata, Pitta, Kapha).
2. Maintain strong immunity (Ojas) and digestive fire (Agni).
3. Align our biological clocks with natural cycles, avoiding seasonal allergies, fatigue, and mood changes.

### The Six Seasons (Ritus)
Ayurveda divides the year into two halves (Ayanas), each containing three seasons:
1. **Uttarayan (Northern Solstice - Energy depleting)**: Shishira (Late Winter), Vasanta (Spring), and Grishma (Summer).
2. **Dakshinayan (Southern Solstice - Energy replenishing)**: Varsha (Monsoon), Sharad (Autumn), and Hemanta (Early Winter).

Learn more about your specific Dosha requirements by visiting the main Dashboard.`,
    author: 'Dr. Vasant Lad, BAMS',
    tags: ['Ritucharya', 'Seasonal Health', 'Ayurveda Basics'],
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    readTime: '6 mins'
  },
  {
    title: 'Demystifying the Three Doshas: Vata, Pitta, and Kapha',
    content: `According to Ayurveda, every individual is born with a unique blueprint of energies known as the Doshas. These three fundamental forces control all physical and mental processes:

### 1. Vata (Air + Space)
Vata is the energy of movement. It governs breathing, heartbeat, muscle contractions, and nervous system impulses. 
- **Characteristics**: Dry, light, cold, rough, subtle, mobile.
- **In Balance**: Creative, enthusiastic, flexible, quick learner.
- **Out of Balance**: Anxious, forgetful, dry skin, constipation, insomnia, bloating.

### 2. Pitta (Fire + Water)
Pitta is the energy of digestion and metabolism. It governs digestion, absorption, temperature regulation, and intellect.
- **Characteristics**: Hot, sharp, light, oily, spreading.
- **In Balance**: Intelligent, focused, courageous, strong digestion, good leader.
- **Out of Balance**: Irritable, angry, acid reflux, skin rashes, inflammatory issues.

### 3. Kapha (Water + Earth)
Kapha is the energy of lubrication, structure, and cohesion. It forms the skeleton, muscles, tendons, and provides fluid balance.
- **Characteristics**: Heavy, slow, cool, oily, smooth, stable.
- **In Balance**: Loving, patient, forgiving, stable, high endurance, strong immune system.
- **Out of Balance**: Lethargic, gains weight easily, sinus congestion, attachment, depression.

Identifying your dominant Dosha helps you make tailored choices in food, yoga, and lifestyle. Take the Dosha Assessment on our app to discover your unique constitution!`,
    author: 'Ayurveda Advisory Board',
    tags: ['Doshas', 'Mind-Body', 'Constitution'],
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    readTime: '5 mins'
  },
  {
    title: 'The Ayurvedic Routine (Dinacharya) for Daily Vitality',
    content: `While Ritucharya governs seasonal cycles, Dinacharya (Dina = day, Charya = regimen) covers daily routines. Standardizing your daily routine acts as a powerful anchor for the nervous system and stokes the digestive fire.

### Recommended Daily Order:
1. **Wake Up (Brahma Muhurta)**: Wake up 45-60 minutes before sunrise. This time is rich in pure energy.
2. **Cleanse**: Wash face, rinse eyes, brush teeth, and use a copper tongue scraper to remove toxins (Ama) accumulated overnight.
3. **Drink Warm Water**: Sip a glass of warm water to stimulate bowel movements.
4. **Oil Massage (Abhyanga)**: Massage warm sesame or coconut oil over your body to calm Vata, lubricate joints, and improve circulation.
5. **Exercise / Yoga**: Engage in light yoga or physical activity to build strength and endurance.
6. **Bathe**: Bathe in warm water to wash off excess oil and refresh the mind.
7. **Meditate**: Spend 10-15 minutes in silent breathing or meditation to set a calm tone for the day.
8. **Eat a Balanced Breakfast**: Have breakfast aligned with your dominant Dosha.

Consistency in these steps builds Ojas (vitality) and minimizes stress. Try adding just one or two steps to your routine this week!`,
    author: 'Dr. Harish Johari',
    tags: ['Dinacharya', 'Daily Routine', 'Self-Care'],
    coverImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    readTime: '7 mins'
  }
];

// Helper to generate the 18 combinations programmatically with high quality text
const generateAdvisories = () => {
  const doshas = ['Vata', 'Pitta', 'Kapha'];
  const seasons = ['Shishira', 'Vasanta', 'Grishma', 'Varsha', 'Sharad', 'Hemanta'];
  const categories = ['Diet', 'Herbs', 'Yoga', 'Daily Routine', 'Precautions'];

  const seedAdvisories = [];

  // Content databases for seasons and doshas to compile rich texts
  const seasonDesc = {
    Shishira: 'Late Winter (cold and dry)',
    Vasanta: 'Spring (warming and damp)',
    Grishma: 'Summer (intense dry heat)',
    Varsha: 'Monsoon (damp, cold, and humid)',
    Sharad: 'Autumn (sudden heat after rains)',
    Hemanta: 'Early Winter (brisk and cold)'
  };

  doshas.forEach((dosha) => {
    seasons.forEach((season) => {
      categories.forEach((category) => {
        let title = '';
        let content = [];
        let tags = [dosha, season, category];

        if (category === 'Diet') {
          title = `${dosha} Pacifying Diet for ${season} Ritu`;
          if (dosha === 'Vata') {
            if (['Shishira', 'Hemanta', 'Varsha'].includes(season)) {
              content = [
                'Prioritize warm, freshly cooked, moist foods like vegetable soups, stews, and kitchari cooked with ghee.',
                'Emphasize sweet, sour, and salty tastes to counter Vata dry-coldness. Avoid dry, raw, and cold foods.',
                'Cook with warming spices: ginger, cumin, black pepper, cardamom, cinnamon, and asafoetida (hing).',
                'Incorporate healthy fats: sesame oil, ghee, olive oil, and soaked almonds/cashews.'
              ];
            } else { // Spring/Summer/Autumn
              content = [
                'Choose warm, cooked, easy-to-digest grains like oats, rice, and quinoa.',
                'Include moderately lubricating items: cooked zucchini, sweet potatoes, and carrots.',
                'Drink warm water or ginger-cardamom tea throughout the day. Avoid carbonated and ice-cold drinks.',
                'Eat sweet, ripe fruits like bananas, avocados, and mangoes. Limit dry fruits unless soaked.'
              ];
            }
          } else if (dosha === 'Pitta') {
            if (['Grishma', 'Sharad'].includes(season)) { // High heat seasons
              content = [
                'Prioritize cooling, sweet, bitter, and astringent foods to balance hot Pitta.',
                'Drink fresh coconut water, mint infusion, or cucumber juice. Avoid alcohol, caffeine, and spicy drinks.',
                'Include cooling vegetables: cucumbers, asparagus, sweet potatoes, celery, and leafy greens.',
                'Cook with cooling spices: fennel, coriander, cardamom, and fresh cilantro. Avoid hot chili and garlic.'
              ];
            } else {
              content = [
                'Favor grains like basmati rice, barley, and oats to stabilize digestion.',
                'Use cooling oils like coconut oil or ghee in moderate amounts for cooking.',
                'Enjoy sweet, ripe fruits like apples, pears, melons, and grapes. Avoid sour citrus fruits.',
                'Keep meals regular; do not skip lunch when Pitta digestive fire (Agni) peaks.'
              ];
            }
          } else if (dosha === 'Kapha') {
            if (['Vasanta', 'Varsha', 'Shishira'].includes(season)) { // Cold/damp seasons
              content = [
                'Prioritize warm, light, dry, and spicy food. Avoid cold, heavy, sweet, and oily dishes.',
                'Emphasize bitter, pungent, and astringent tastes to dry out excess dampness and Kapha mucus.',
                'Incorporate warming spices generously: ginger, garlic, cayenne pepper, mustard seeds, and turmeric.',
                'Favor light grains like millet, barley, rye, and buckwheat. Limit rice and wheat consumption.'
              ];
            } else {
              content = [
                'Eat light, steamed vegetables (broccoli, cabbage, cauliflower, leafy greens) with minimal oil.',
                'Drink warm ginger-basil tea or warm water. Avoid ice creams and dairy products, especially at night.',
                'Use honey as a sweetener in moderation (never heated). Avoid white sugar and artificial sweeteners.',
                'Take light breakfasts or practice intermittent fasting if you do not feel hungry in the morning.'
              ];
            }
          }
        } 
        
        else if (category === 'Herbs') {
          title = `Recommended Herbs for ${dosha} in ${season}`;
          if (dosha === 'Vata') {
            content = [
              'Ashwagandha: A premier rejuvenating herb to calm the nervous system and build strength in cold seasons.',
              'Triphala: Taken at night with warm water to support bowel movements and keep Vata digestion moving.',
              'Ginger: Stokes the digestive fire and relieves seasonal gas or bloating.'
            ];
          } else if (dosha === 'Pitta') {
            content = [
              'Amalaki (Amla): Extremely rich in Vitamin C, cools the hot digestive tract and controls acid reflux.',
              'Brahmi: Calms the hot, analytical Pitta mind and reduces stress-induced irritability.',
              'Shatavari: Cools, hydrates, and rejuvenates delicate tissues during dry, hot seasons.'
            ];
          } else if (dosha === 'Kapha') {
            content = [
              'Tulsi: Clears excess Kapha mucus from the chest and sinus tracts during damp seasons.',
              'Trikatu (Ginger, Black Pepper, Pippali): Boosts slow Kapha metabolism and burns digestive toxins (Ama).',
              'Turmeric (Haridra): Anti-inflammatory and drying, ideal for balancing Kapha stagnation.'
            ];
          }
        } 
        
        else if (category === 'Yoga') {
          title = `Pranayama & Asanas for ${dosha} during ${season}`;
          if (dosha === 'Vata') {
            content = [
              'Practice grounding, slow, and stabilizing hatha yoga. Hold poses longer rather than flowing quickly.',
              'Emphasize poses that press on the lower abdomen: Child pose (Balasana), Forward bends (Paschimottanasana), and Wind relieving pose (Pawanmuktasana).',
              'Practice Nadi Shodhana (Alternate Nostril Breathing) for 5-10 minutes to calm the restless Vata mind.',
              'Always finish with a long Savasana (Corpse pose) covering yourself with a warm blanket.'
            ];
          } else if (dosha === 'Pitta') {
            content = [
              'Practice cool, non-competitive, and relaxing asanas. Keep your eyes closed and avoid overexerting.',
              'Focus on twisting poses and chest openers: Cobra (Bhujangasana), Bow (Dhanurasana), and Fish (Matsyasana).',
              'Practice Sheetali or Sitkari (Cooling Breath) to quickly lower body temperature and release anger.',
              'Perform yoga in the cool hours of early morning. Avoid hot yoga or heated rooms.'
            ];
          } else if (dosha === 'Kapha') {
            content = [
              'Practice active, dynamic, and stimulating yoga sequences (Vinyasa flow, faster Sun Salutations).',
              'Incorporate chest openers and backbends to expand lungs: Camel pose (Ustrasana), Bridge (Setu Bandhasana), and Warrior poses (Virabhadrasana).',
              'Practice Bhastrika (Bellows Breath) or Kapalabhati (Skull Shining Breath) to warm up and clear mucus.',
              'Maintain an energetic, sweating pace to counter Kapha inertia and sluggishness.'
            ];
          }
        } 
        
        else if (category === 'Daily Routine') {
          title = `Optimal Lifestyle & Dinacharya for ${dosha} in ${season}`;
          if (dosha === 'Vata') {
            content = [
              'Perform Abhyanga (self-massage) daily with warm sesame oil before bathing to soothe dry skin and calm Vata.',
              'Maintain strict, consistent timings for waking, eating, and sleeping. Vata thrives on routine.',
              'Sleep early (by 10:00 PM) to ensure deep, restorative rest. Avoid screen time 1 hour before sleep.',
              'Keep the body warm and protected from drafts, cold winds, and air conditioners.'
            ];
          } else if (dosha === 'Pitta') {
            content = [
              'Perform self-massage with cooling coconut oil or sandalwood oil. Avoid heating oils like sesame.',
              'Enjoy walks in the cool moonlight. Avoid direct midday sun exposure, especially in summer.',
              'Keep work hours balanced; take breaks and avoid excessive stress or over-scheduling.',
              'Wash face and eyes with cool rose water to soothe irritation and visual fatigue.'
            ];
          } else if (dosha === 'Kapha') {
            content = [
              'Practice Garshana (dry massage using raw silk gloves or dry brushing) to stimulate lymphatic flow.',
              'Wake up early before sunrise (around 5:30 - 6:00 AM) when Kapha energy dominates the morning.',
              'Avoid daytime sleeping at all costs; it slows metabolism and increases lethargy and congestion.',
              'Engage in regular physical activities and active hobbies to keep mental and physical sluggishness away.'
            ];
          }
        } 
        
        else if (category === 'Precautions') {
          title = `Crucial Health Precautions for ${dosha} in ${season}`;
          if (dosha === 'Vata') {
            content = [
              'Avoid dry, cold, raw, and frozen foods, as they aggravate Vata dryness immediately.',
              'Do not skip meals, overexert, or fast excessively, as Vata needs grounding nourishment.',
              'Limit multi-tasking, high-intensity cardio, and excessive travel during Vata-aggravating seasons.',
              'Guard against constipation by eating fiber-rich foods and staying warm.'
            ];
          } else if (dosha === 'Pitta') {
            content = [
              'Strictly limit sour, spicy, salty, fried, and fermented foods (vinegar, yogurt, pickles).',
              'Avoid working or exercising during the hottest hours of the day (10:00 AM - 3:00 PM).',
              'Refrain from keeping hunger waiting; eat when you are hungry to prevent acid build-up.',
              'Monitor skin for breakouts or rashes and limit exposure to toxic chemical skin products.'
            ];
          } else if (dosha === 'Kapha') {
            content = [
              'Minimize intake of cold milk, heavy cheeses, ice creams, and deep-fried carbohydrates.',
              'Avoid damp, drafty, and unventilated rooms. Keep your living space dry and warm.',
              'Limit sedentary habits; sitting for long hours accumulates stagnation and causes weight gain.',
              'Be cautious of seasonal allergies, congestion, and asthma attacks during wet/spring transitions.'
            ];
          }
        }

        seedAdvisories.push({
          dosha,
          season,
          category,
          title,
          content,
          tags,
          status: 'published'
        });
      });
    });
  });

  return seedAdvisories;
};

const seedDB = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected! Cleaning old records...');

    // Clean existing
    await User.deleteMany();
    await Herb.deleteMany();
    await Article.deleteMany();
    await Advisory.deleteMany();

    console.log('Seeding Users...');
    // We need to iterate and trigger 'save' for encryption OR hash here.
    // Our User model has a pre-save hook, so calling User.create() will hash passwords!
    for (let u of users) {
      await User.create(u);
    }
    console.log('Users seeded!');

    console.log('Seeding Herbs...');
    await Herb.insertMany(herbs);
    console.log('Herbs seeded!');

    console.log('Seeding Articles...');
    await Article.insertMany(articles);
    console.log('Articles seeded!');

    console.log('Generating and Seeding 18 Dosha-Season Advisories (90 documents)...');
    const advisories = generateAdvisories();
    await Advisory.insertMany(advisories);
    console.log('Advisories seeded successfully!');

    console.log('=== Database Seeding Complete! ===');
    console.log('Credentials:');
    console.log('Admin Email: admin@ayurveda.com | Password: admin123');
    console.log('User Email: rahul@gmail.com | Password: user123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed: ', error);
    process.exit(1);
  }
};

seedDB();
