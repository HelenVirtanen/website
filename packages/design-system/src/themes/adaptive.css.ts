import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';
import { vars } from '../contract';
import { adaptive } from '../adaptive';
import { adaptiveScale, mediaOverrides } from '../scale';

createGlobalTheme(':root', vars.adaptive, adaptive.values.adaptive);

globalStyle(':root', { '@media': mediaOverrides(vars.adaptive, adaptiveScale) });
