// Движение: длительности и кривые. Модуль без побочных эффектов — его читают и
// темы (.css.ts), и клиентские скрипты.
const contract = {
  motion: {
    duration: {
      fast: null,
      base: null,
      fall: null,
    },
    easing: {
      standard: null,
      fall: null,
    },
  },
} as const;

const values = {
  motion: {
    duration: {
      fast: '120ms',
      base: '200ms',
      fall: '900ms',
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      // Значение 1.3 > 1 даёт отскок при падении плашек.
      fall: 'cubic-bezier(0.33, 1.3, 0.6, 1)',
    },
  },
};

export const motion = { contract, values };
