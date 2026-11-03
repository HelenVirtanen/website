// Слои внутри изолированного stacking context — от темы не зависят.
const contract = {
  zIndex: {
    ring: null,
    mask: null,
    content: null,
    navOverlay: null,
    navBar: null,
  },
} as const;

const values = {
  zIndex: {
    ring: '1',
    mask: '2',
    content: '3',
    navOverlay: '100',
    navBar: '101',
  },
};

export const zIndex = { contract, values };
