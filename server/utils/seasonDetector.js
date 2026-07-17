// Ayurveda Season (Ritu) Detector
// Based on traditional Vedic calendar mapped to Gregorian months

export const SEASONS = {
  SHISHIRA: 'Shishira', // Late Winter / Dewy (Jan 16 - Mar 15)
  VASANTA: 'Vasanta',   // Spring (Mar 16 - May 15)
  GRISHMA: 'Grishma',   // Summer (May 16 - Jul 15)
  VARSHA: 'Varsha',     // Monsoon (Jul 16 - Sep 15)
  SHARAD: 'Sharad',     // Autumn (Sep 16 - Nov 15)
  HEMANTA: 'Hemanta'    // Early Winter (Nov 16 - Jan 15)
};

export const getSeasonDetails = (seasonName) => {
  const details = {
    [SEASONS.SHISHIRA]: {
      sanskrit: 'शिशिर ऋतु',
      english: 'Late Winter / Dewy',
      months: 'Mid-January to Mid-March',
      description: 'Cold, damp, and windy. Kapha accumulates; Vata remains high. Digestive fire (Agni) is strong, requiring nourishing warm foods.',
      elements: 'Water & Earth',
      doshaImpact: 'Accumulates Kapha, pacifies Pitta, balances Vata.'
    },
    [SEASONS.VASANTA]: {
      sanskrit: 'वसन्त ऋतु',
      english: 'Spring',
      months: 'Mid-March to Mid-July', // Wait, mid-march to mid-may
      description: 'Pleasant, transitioning from cold to warm. Kapha liquefies, which can lead to allergies and colds. Agni becomes variable.',
      elements: 'Air & Earth',
      doshaImpact: 'Aggravates Kapha, increases Agni variability, balances Vata.'
    },
    [SEASONS.GRISHMA]: {
      sanskrit: 'ग्रीष्म ऋतु',
      english: 'Summer',
      months: 'Mid-May to Mid-July',
      description: 'Intense heat, dry wind, and long days. Pitta increases rapidly while Kapha decreases. Body energy is naturally lower, requiring cooling foods and rest.',
      elements: 'Fire & Air',
      doshaImpact: 'Aggravates Pitta, depletes Kapha, accumulates Vata.'
    },
    [SEASONS.VARSHA]: {
      sanskrit: 'वर्षा ऋतु',
      english: 'Monsoon',
      months: 'Mid-July to Mid-September',
      description: 'Humid, rainy, and damp. Vata becomes highly aggravated due to cold winds and dampness. Agni weakens significantly, requiring light, warm meals.',
      elements: 'Water & Fire',
      doshaImpact: 'Aggravates Vata, accumulates Pitta, weakens digestive fire.'
    },
    [SEASONS.SHARAD]: {
      sanskrit: 'शरद ऋतु',
      english: 'Autumn',
      months: 'Mid-September to Mid-November',
      description: 'Sunny and warm during the day, cool at night. The sudden sun heat after monsoon aggravates accumulated Pitta. Light, cooling, and bitter foods help soothe.',
      elements: 'Fire & Water',
      doshaImpact: 'Aggravates Pitta, pacifies Vata, balances Kapha.'
    },
    [SEASONS.HEMANTA]: {
      sanskrit: 'हेमन्त ऋतु',
      english: 'Early Winter',
      months: 'Mid-November to Mid-January',
      description: 'Cold, brisk, and pleasant. Agni (digestive fire) is very strong, and the body requires heavier, sweet, and oily foods to maintain strength. Vata is kept in check by heavy foods.',
      elements: 'Earth & Space',
      doshaImpact: 'Balances Pitta, pacifies Vata, accumulates Kapha.'
    }
  };

  // Correction in Vasanta months details
  if (seasonName === SEASONS.VASANTA) {
    details[SEASONS.VASANTA].months = 'Mid-March to Mid-May';
  }

  return details[seasonName] || null;
};

export const detectSeason = (dateInput = new Date()) => {
  const date = new Date(dateInput);
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  const day = date.getDate();

  // Map to one of the six seasons based on day + month
  // Jan 16 - Mar 15: Shishira
  // Mar 16 - May 15: Vasanta
  // May 16 - Jul 15: Grishma
  // Jul 16 - Sep 15: Varsha
  // Sep 16 - Nov 15: Sharad
  // Nov 16 - Jan 15: Hemanta

  if ((month === 0 && day >= 16) || month === 1 || (month === 2 && day <= 15)) {
    return SEASONS.SHISHIRA;
  }
  if ((month === 2 && day >= 16) || month === 3 || (month === 4 && day <= 15)) {
    return SEASONS.VASANTA;
  }
  if ((month === 4 && day >= 16) || month === 5 || (month === 6 && day <= 15)) {
    return SEASONS.GRISHMA;
  }
  if ((month === 6 && day >= 16) || month === 7 || (month === 8 && day <= 15)) {
    return SEASONS.VARSHA;
  }
  if ((month === 8 && day >= 16) || month === 9 || (month === 10 && day <= 15)) {
    return SEASONS.SHARAD;
  }
  // All other dates fall in Hemanta (Nov 16 - Dec 31, or Jan 1 - Jan 15)
  return SEASONS.HEMANTA;
};
