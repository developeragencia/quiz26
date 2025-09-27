export interface ZodiacSign {
  name: string;
  symbol: string;
  dates: [[number, number], [number, number]];
  key: string;
}

export const zodiacSigns: Record<string, ZodiacSign> = {
  aries: { name: 'Aries', symbol: '♈', dates: [[3, 21], [4, 19]], key: 'aries' },
  taurus: { name: 'Taurus', symbol: '♉', dates: [[4, 20], [5, 20]], key: 'taurus' },
  gemini: { name: 'Gemini', symbol: '♊', dates: [[5, 21], [6, 20]], key: 'gemini' },
  cancer: { name: 'Cancer', symbol: '♋', dates: [[6, 21], [7, 22]], key: 'cancer' },
  leo: { name: 'Leo', symbol: '♌', dates: [[7, 23], [8, 22]], key: 'leo' },
  virgo: { name: 'Virgo', symbol: '♍', dates: [[8, 23], [9, 22]], key: 'virgo' },
  libra: { name: 'Libra', symbol: '♎', dates: [[9, 23], [10, 22]], key: 'libra' },
  scorpio: { name: 'Scorpio', symbol: '♏', dates: [[10, 23], [11, 21]], key: 'scorpio' },
  sagittarius: { name: 'Sagittarius', symbol: '♐', dates: [[11, 22], [12, 21]], key: 'sagittarius' },
  capricorn: { name: 'Capricorn', symbol: '♑', dates: [[12, 22], [1, 19]], key: 'capricorn' },
  aquarius: { name: 'Aquarius', symbol: '♒', dates: [[1, 20], [2, 18]], key: 'aquarius' },
  pisces: { name: 'Pisces', symbol: '♓', dates: [[2, 19], [3, 20]], key: 'pisces' }
};

export function calculateZodiac(birthdate: string): ZodiacSign {
  const date = new Date(birthdate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const [key, zodiac] of Object.entries(zodiacSigns)) {
    const [[startMonth, startDay], [endMonth, endDay]] = zodiac.dates;
    
    if (startMonth <= endMonth) {
      // Normal date range (e.g., March 21 - April 19)
      if ((month === startMonth && day >= startDay) || 
          (month === endMonth && day <= endDay) ||
          (month > startMonth && month < endMonth)) {
        return zodiac;
      }
    } else {
      // Wrap-around date range (e.g., December 22 - January 19)
      if ((month === startMonth && day >= startDay) || 
          (month === endMonth && day <= endDay)) {
        return zodiac;
      }
    }
  }
  
  return zodiacSigns.aries; // Default fallback
}

export const zodiacMessages: Record<string, string> = {
  aries: 'Your fiery Aries spirit means you never back down from a challenge! Try again! 🔥',
  taurus: 'Steady Taurus, your persistence will pay off. Take your time! 🌱',
  gemini: 'Curious Gemini, use your adaptability to find new strategies! ✨',
  cancer: 'Intuitive Cancer, trust your feelings and try a different approach! 🌙',
  leo: 'Confident Leo, your natural charisma will lead you to victory! 👑',
  virgo: 'Detail-oriented Virgo, analyze the patterns and you\'ll succeed! 🔍',
  libra: 'Balanced Libra, find harmony between speed and accuracy! ⚖️',
  scorpio: 'Intense Scorpio, channel your determination into focus! 🦂',
  sagittarius: 'Adventurous Sagittarius, this is just another quest to conquer! 🏹',
  capricorn: 'Ambitious Capricorn, step by step you\'ll reach the top! ⛰️',
  aquarius: 'Innovative Aquarius, think outside the box! 💡',
  pisces: 'Dreamy Pisces, let your intuition guide you! 🐠'
};

export const playfulTips = [
  'Sometimes the best things come to those who keep trying! 😉',
  'Practice makes perfect... and more fun! 💫',
  'Every expert was once a beginner! 🌟',
  'The fun is in the journey, not just the destination! 🎯',
  'Good things come to those who match cards! 🃏',
  'Your next victory is just one flip away! ✨'
];
