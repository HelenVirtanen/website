// Толщина и стиль рамки — пространственные токены, от темы не зависят.
const contract = {
  border: {
    width: {
      thin: null,
      medium: null,
      thick: null,
      superThick: null,
    },
    style: {
      solid: null,
      dashed: null,
    },
  },
} as const;

const values = {
  border: {
    width: {
      thin: '0.0625rem', // 1px
      medium: '0.125rem', // 2px
      thick: '0.25rem', // 4px
      superThick: '0.5rem', // 8px
    },
    style: {
      solid: 'solid',
      dashed: 'dashed',
    },
  },
};

export const border = { contract, values };