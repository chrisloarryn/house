export type PaletteKey = 'actual' | 'idea' | 'med';

export interface Palette {
  estuco1: number;
  siding2: number;
  marco: number;
  techo: number;
  cubo: number;
  cuboBand: number;
  zocalo: number;
  vidrio?: number;
  teja?: number;
}

export const PAL: Record<PaletteKey, Palette> = {
  actual: {
    estuco1: 0xf0eee5,  // estuco claro como fachada real
    siding2: 0xb8ad91,  // siding beige/taupe real
    marco: 0x2c2c2c,    // marcos y reja oscuros
    techo: 0x111315,    // cubierta asfáltica negra
    cubo: 0xffffff,
    cuboBand: 0xeeeeee,
    zocalo: 0xd9d2c2,
    vidrio: 0x8fa3aa
  },
  idea: {
    estuco1: 0xcccccc,  // gris claro
    siding2: 0xaaaaaa,  // gris medio
    marco: 0x333333,
    techo: 0x222222,
    cubo: 0xd8d8d8,
    cuboBand: 0x555555,
    zocalo: 0xa0a0a0
  },
  med: {
    estuco1: 0xece9e1,  // blanco hueso cálido
    siding2: 0xdfd9cc,  // crema más oscuro para piso 2
    marco: 0xdcd8cd,    // marcos claros o madera
    techo: 0xb55a30,    // teja de arcilla terracota
    cubo: 0xece9e1,     // cubo frontal mismo estuco
    cuboBand: 0xdfd9cc, // cornisa ligeramente distinta
    zocalo: 0xc89878,   // zócalo terracota o piedra cálida
    vidrio: 0x7a9ab8,
    teja: 0xc2623a      // tejados nuevos
  }
};
