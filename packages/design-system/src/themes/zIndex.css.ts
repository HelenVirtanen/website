import { createGlobalTheme } from '@vanilla-extract/css';
import { vars } from '../contract';
import { zIndex } from '../zIndex';

createGlobalTheme(':root', vars.zIndex, zIndex.values.zIndex);
