import { createGlobalTheme } from '@vanilla-extract/css';
import { vars } from '../contract';
import { border } from '../border';

createGlobalTheme(':root', vars.border, border.values.border);
