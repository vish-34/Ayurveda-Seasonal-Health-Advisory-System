// 10 Curated Ayurveda Dosha Questions
export const DOSHA_QUESTIONS = [
  {
    id: 1,
    text: 'How would you describe your physical body frame and weight?',
    options: [
      { text: 'Thin, light-boned, tall or very short, difficult to gain weight', value: 'Vata' },
      { text: 'Medium build, muscular, stable weight, gains or loses weight easily', value: 'Pitta' },
      { text: 'Broad, heavy build, sturdy, gains weight easily, difficult to lose weight', value: 'Kapha' }
    ]
  },
  {
    id: 2,
    text: 'What is the general texture and temperature of your skin?',
    options: [
      { text: 'Dry, rough, cool to touch, thin, prominent veins', value: 'Vata' },
      { text: 'Soft, warm, sensitive, prone to redness, freckles, or acne', value: 'Pitta' },
      { text: 'Thick, oily, cool, smooth, pale, well-hydrated', value: 'Kapha' }
    ]
  },
  {
    id: 3,
    text: 'Describe your hair type and appearance.',
    options: [
      { text: 'Dry, frizzy, thin, coarse, dark, curly', value: 'Vata' },
      { text: 'Fine, soft, thinning, early graying or balding, reddish/blonde tones', value: 'Pitta' },
      { text: 'Thick, oily, strong, shiny, wavy, abundant', value: 'Kapha' }
    ]
  },
  {
    id: 4,
    text: 'How is your appetite and digestion?',
    options: [
      { text: 'Variable and irregular; I get hungry at odd times and prone to bloating/gas', value: 'Vata' },
      { text: 'Strong and sharp; I cannot skip meals without feeling irritable or hot', value: 'Pitta' },
      { text: 'Constant but slow; I can easily skip meals and often feel heavy after eating', value: 'Kapha' }
    ]
  },
  {
    id: 5,
    text: 'Which weather/climate do you find most uncomfortable?',
    options: [
      { text: 'Cold, dry, and windy weather; I prefer warm, sunny days', value: 'Vata' },
      { text: 'Hot, humid weather; I crave cool breeze, air conditioning, and cold drinks', value: 'Pitta' },
      { text: 'Cold, damp, rainy, and cloudy weather; I prefer dry warmth', value: 'Kapha' }
    ]
  },
  {
    id: 6,
    text: 'How would you describe your sleep patterns?',
    options: [
      { text: 'Light, interrupted, easily disturbed by noise, prone to insomnia (5-7 hours)', value: 'Vata' },
      { text: 'Sound and moderate; I sleep well but can wake up if hot (6-8 hours)', value: 'Pitta' },
      { text: 'Heavy, deep, and long; I hate being woken up and feel sleepy in morning (8+ hours)', value: 'Kapha' }
    ]
  },
  {
    id: 7,
    text: 'How do you learn and process new information?',
    options: [
      { text: 'I learn very quickly but also forget quickly; I have a restless, creative mind', value: 'Vata' },
      { text: 'I am analytical, sharp, and structured; I learn logically and retain well', value: 'Pitta' },
      { text: 'I learn slowly but once I grasp it, I never forget; I have a calm, steady mind', value: 'Kapha' }
    ]
  },
  {
    id: 8,
    text: 'How do you react emotionally under stress or pressure?',
    options: [
      { text: 'I become anxious, fearful, worried, and start overthinking', value: 'Vata' },
      { text: 'I get frustrated, angry, irritable, impatient, and competitive', value: 'Pitta' },
      { text: 'I remain calm, slow down, avoid conflict, and can become stubborn or lethargic', value: 'Kapha' }
    ]
  },
  {
    id: 9,
    text: 'How would you describe your speech and communication style?',
    options: [
      { text: 'Fast, talkative, jumping between topics, gesturing frequently', value: 'Vata' },
      { text: 'Sharp, precise, convincing, direct, sometimes argumentative', value: 'Pitta' },
      { text: 'Slow, steady, pleasant, gentle, polite, and listening more than talking', value: 'Kapha' }
    ]
  },
  {
    id: 10,
    text: 'What are your activity and energy levels throughout the day?',
    options: [
      { text: 'High energy in quick bursts, but I fatigue easily and love constant change', value: 'Vata' },
      { text: 'Moderate, goal-oriented, competitive, with strong focus and drive', value: 'Pitta' },
      { text: 'Slow, steady pace with high endurance; I prefer a relaxed routine', value: 'Kapha' }
    ]
  }
];

export const calculateDosha = (answers) => {
  // answers is an array of values like: ['Vata', 'Pitta', 'Vata', 'Kapha', ...]
  let vata = 0;
  let pitta = 0;
  let kapha = 0;

  answers.forEach((ans) => {
    if (ans === 'Vata') vata++;
    else if (ans === 'Pitta') pitta++;
    else if (ans === 'Kapha') kapha++;
  });

  const total = vata + pitta + kapha;
  
  // Calculate percentages
  const vataPercent = Math.round((vata / total) * 100);
  const pittaPercent = Math.round((pitta / total) * 100);
  const kaphaPercent = Math.round((kapha / total) * 100);

  // Determine dominant dosha (highest score)
  let dominant = 'Vata';
  let maxScore = vata;

  if (pitta > maxScore) {
    dominant = 'Pitta';
    maxScore = pitta;
  }
  if (kapha > maxScore) {
    dominant = 'Kapha';
    maxScore = kapha;
  }

  // Handle double-dosha ties (optional but nice)
  // For simplicity of college project, we return the highest single dominant.

  return {
    vataScore: vataPercent,
    pittaScore: pittaPercent,
    kaphaScore: kaphaPercent,
    dominantDosha: dominant
  };
};
