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
    estuco1: 0xe8e4d8,  // estuco original crema
    siding2: 0x8a8470,  // siding beige oliva
    marco: 0x4a4a4a,    // marcos estándar
    techo: 0x2a2a2a,    // teja asfáltica negra/grafito
    cubo: 0xffffff,
    cuboBand: 0xeeeeee,
    zocalo: 0xd8d0be
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
