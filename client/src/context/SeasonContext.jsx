import React, { createContext, useState, useContext, useEffect } from 'react';

const SeasonContext = createContext();

export const SEASONS = {
  SHISHIRA: 'Shishira', // Late Winter (Jan 16 - Mar 15)
  VASANTA: 'Vasanta',   // Spring (Mar 16 - May 15)
  GRISHMA: 'Grishma',   // Summer (May 16 - Jul 15)
  VARSHA: 'Varsha',     // Monsoon (Jul 16 - Sep 15)
  SHARAD: 'Sharad',     // Autumn (Sep 16 - Nov 15)
  HEMANTA: 'Hemanta'    // Early Winter (Nov 16 - Jan 15)
};

export const seasonDetails = {
  [SEASONS.SHISHIRA]: {
    sanskrit: 'शिशिर ऋतु',
    english: 'Late Winter / Dewy',
    months: 'Mid-January to Mid-March',
    description: 'Cold, damp, and windy. Kapha accumulates; Vata remains high. Digestive fire (Agni) is strong, requiring nourishing warm foods.',
    elements: 'Water & Earth',
    doshaImpact: 'Accumulates Kapha, pacifies Pitta, balances Vata.',
    colorClass: 'bg-teal-50 border-teal-200 text-teal-800'
  },
  [SEASONS.VASANTA]: {
    sanskrit: 'वसन्त ऋतु',
    english: 'Spring',
    months: 'Mid-March to Mid-May',
    description: 'Pleasant, transitioning from cold to warm. Kapha liquefies, which can lead to allergies and colds. Agni becomes variable.',
    elements: 'Air & Earth',
    doshaImpact: 'Aggravates Kapha, increases Agni variability, balances Vata.',
    colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-800'
  },
  [SEASONS.GRISHMA]: {
    sanskrit: 'ग्रीष्म ऋतु',
    english: 'Summer',
    months: 'Mid-May to Mid-July',
    description: 'Intense heat, dry wind, and long days. Pitta increases rapidly while Kapha decreases. Body energy is naturally lower, requiring cooling foods and rest.',
    elements: 'Fire & Air',
    doshaImpact: 'Aggravates Pitta, depletes Kapha, accumulates Vata.',
    colorClass: 'bg-amber-50 border-amber-200 text-amber-800'
  },
  [SEASONS.VARSHA]: {
    sanskrit: 'वर्षा ऋतु',
    english: 'Monsoon',
    months: 'Mid-July to Mid-September',
    description: 'Humid, rainy, and damp. Vata becomes highly aggravated due to cold winds and dampness. Agni weakens significantly, requiring light, warm meals.',
    elements: 'Water & Fire',
    doshaImpact: 'Aggravates Vata, accumulates Pitta, weakens digestive fire.',
    colorClass: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  [SEASONS.SHARAD]: {
    sanskrit: 'शरद ऋतु',
    english: 'Autumn',
    months: 'Mid-September to Mid-November',
    description: 'Sunny and warm during the day, cool at night. The sudden sun heat after monsoon aggravates accumulated Pitta. Light, cooling, and bitter foods help soothe.',
    elements: 'Fire & Water',
    doshaImpact: 'Aggravates Pitta, pacifies Vata, balances Kapha.',
    colorClass: 'bg-orange-50 border-orange-200 text-orange-800'
  },
  [SEASONS.HEMANTA]: {
    sanskrit: 'हेमन्त ऋतु',
    english: 'Early Winter',
    months: 'Mid-November to Mid-January',
    description: 'Cold, brisk, and pleasant. Agni (digestive fire) is very strong, and the body requires heavier, sweet, and oily foods to maintain strength. Vata is kept in check by heavy foods.',
    elements: 'Earth & Space',
    doshaImpact: 'Balances Pitta, pacifies Vata, accumulates Kapha.',
    colorClass: 'bg-sky-50 border-sky-200 text-sky-800'
  }
};

const detectSeasonClient = () => {
  const date = new Date();
  const month = date.getMonth();
  const day = date.getDate();

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
  return SEASONS.HEMANTA;
};

export const SeasonProvider = ({ children }) => {
  const [currentSeason, setCurrentSeason] = useState(detectSeasonClient());
  const [isOverridden, setIsOverridden] = useState(false);

  const overrideSeason = (season) => {
    if (Object.values(SEASONS).includes(season)) {
      setCurrentSeason(season);
      setIsOverridden(true);
    }
  };

  const resetSeason = () => {
    setCurrentSeason(detectSeasonClient());
    setIsOverridden(false);
  };

  return (
    <SeasonContext.Provider
      value={{
        currentSeason,
        seasonInfo: seasonDetails[currentSeason],
        isOverridden,
        overrideSeason,
        resetSeason,
        allSeasons: Object.values(SEASONS),
        seasonDetails
      }}
    >
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => useContext(SeasonContext);
export default SeasonContext;
