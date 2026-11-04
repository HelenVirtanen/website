// Слои внутри изолированного stacking context — от темы не зависят.
const contract = {
  zIndex: {
    ring: null,
    content: null,
    floatingCta: null,
    navOverlay: null,
    navBar: null,
  },
} as const;

const values = {
  zIndex: {
    ring: '1',
    content: '3',
    floatingCta: '50',
    navOverlay: '100',
    navBar: '101',
  },
};

export const zIndex = { contract, values };
