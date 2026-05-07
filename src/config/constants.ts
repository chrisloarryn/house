export const L = {
  lote: { frente: 7.82, fondoIzq: 17.0, fondoDer: 17.0 },
  antejardinMin: 3.0,
  casa: {
    ancho: 6.30, fondo: 9.73, alto1: 2.7, alto2: 2.5,
    volIzq: { ancho: 3.45, fondo: 9.73, gableAlt: 1.45 },
    volDer: { ancho: 2.85, fondo: 9.73, gableAlt: 0.72 },
    techoMainAlt: 1.50,
    gableFrenteIzq: { x: 0.22, ancho: 3.35, fondo: 1.28, alt: 1.50 },
    gableFrenteDer: { x: 3.57, ancho: 2.95, fondo: 1.05, alt: 0.58 },
    gablePosterior: null,
  },
  techo: { alt: 1.20 },
};

// Calculate common coordinates
export const cx = (L.lote.frente - L.casa.ancho) / 2; // 0.76
export const cz = L.antejardinMin; // 3.0

export const TOPE_DFL2 = 140.0;
export const M2_ACTUAL = 103.77;
