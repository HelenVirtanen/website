import { createGlobalTheme } from '@vanilla-extract/css';
import { vars } from '../contract';
import { spacing } from '../spacing';

// Отступы, промежутки и радиусы постоянны на всех ширинах и от темы не зависят.
// Растущие величины — в themes/layout.css.ts.
createGlobalTheme(':root', vars.padding, spacing.values.padding);
createGlobalTheme(':root', vars.spacing, spacing.values.spacing);
createGlobalTheme(':root', vars.radius, spacing.values.radius);
createGlobalTheme(':root', vars.size, spacing.values.size);
