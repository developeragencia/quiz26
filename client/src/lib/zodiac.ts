export interface ZodiacSign {
  name: string;
  symbol: string;
  dates: [[number, number], [number, number]];
  key: string;
}

export const zodiacSigns: Record<string, ZodiacSign> = {
  aries: { name: 'Áries', symbol: '♈', dates: [[3, 21], [4, 19]], key: 'aries' },
  taurus: { name: 'Touro', symbol: '♉', dates: [[4, 20], [5, 20]], key: 'taurus' },
  gemini: { name: 'Gêmeos', symbol: '♊', dates: [[5, 21], [6, 20]], key: 'gemini' },
  cancer: { name: 'Câncer', symbol: '♋', dates: [[6, 21], [7, 22]], key: 'cancer' },
  leo: { name: 'Leão', symbol: '♌', dates: [[7, 23], [8, 22]], key: 'leo' },
  virgo: { name: 'Virgem', symbol: '♍', dates: [[8, 23], [9, 22]], key: 'virgo' },
  libra: { name: 'Libra', symbol: '♎', dates: [[9, 23], [10, 22]], key: 'libra' },
  scorpio: { name: 'Escorpião', symbol: '♏', dates: [[10, 23], [11, 21]], key: 'scorpio' },
  sagittarius: { name: 'Sagitário', symbol: '♐', dates: [[11, 22], [12, 21]], key: 'sagittarius' },
  capricorn: { name: 'Capricórnio', symbol: '♑', dates: [[12, 22], [1, 19]], key: 'capricorn' },
  aquarius: { name: 'Aquário', symbol: '♒', dates: [[1, 20], [2, 18]], key: 'aquarius' },
  pisces: { name: 'Peixes', symbol: '♓', dates: [[2, 19], [3, 20]], key: 'pisces' }
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
  aries: 'Seu espírito fogoso de Áries significa que você nunca recua de um desafio! Tente novamente! 🔥',
  taurus: 'Firme Touro, sua persistência será recompensada. Vá com calma! 🌱',
  gemini: 'Curioso Gêmeos, use sua adaptabilidade para encontrar novas estratégias! ✨',
  cancer: 'Intuitivo Câncer, confie em seus sentimentos e tente uma abordagem diferente! 🌙',
  leo: 'Confiante Leão, seu carisma natural te levará à vitória! 👑',
  virgo: 'Detalhista Virgem, analise os padrões e você terá sucesso! 🔍',
  libra: 'Equilibrado Libra, encontre harmonia entre velocidade e precisão! ⚖️',
  scorpio: 'Intenso Escorpião, canalize sua determinação para o foco! 🦂',
  sagittarius: 'Aventureiro Sagitário, esta é apenas mais uma missão para conquistar! 🏹',
  capricorn: 'Ambicioso Capricórnio, passo a passo você chegará ao topo! ⛰️',
  aquarius: 'Inovador Aquário, pense fora da caixa! 💡',
  pisces: 'Sonhador Peixes, deixe sua intuição te guiar! 🐠'
};

export const playfulTips = [
  'Às vezes as melhores coisas vêm para quem continua tentando! 😉',
  'A prática leva à perfeição... e mais diversão! 💫',
  'Todo especialista já foi iniciante! 🌟',
  'A diversão está na jornada, não apenas no destino! 🎯',
  'Coisas boas vêm para quem encontra os pares! 🃏',
  'Sua próxima vitória está a apenas uma virada de distância! ✨'
];
