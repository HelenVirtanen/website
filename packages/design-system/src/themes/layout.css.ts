import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';
import { vars } from '../contract';
import { layout } from '../layout';
import { layoutSpace, mediaOverrides } from '../scale';

createGlobalTheme(':root', vars.display, layout.values.display);
createGlobalTheme(':root', vars.position, layout.values.position);
createGlobalTheme(':root', vars.alignItems, layout.values.alignItems);
createGlobalTheme(':root', vars.justifyContent, layout.values.justifyContent);
createGlobalTheme(':root', vars.flexDirection, layout.values.flexDirection);
createGlobalTheme(':root', vars.inset, layout.values.inset);
createGlobalTheme(':root', vars.layout, layout.values.layout);

// Растущие поля и промежутки (ADR-002): база выше, ступени по ширине — из layoutSpace.
globalStyle(':root', { '@media': mediaOverrides(vars.layout.inset, layoutSpace.inset) });
globalStyle(':root', { '@media': mediaOverrides(vars.layout.gap, layoutSpace.gap) });
