export const L = {
  lote: { frente: 10.78, fondoIzq: 17.10, fondoDer: 17.10, chaflanDer: { frente: 1.05, fondo: 1.0 } },
  antejardinMin: 3.0,
  casa: {
    ancho: 6.11, fondo: 9.73, alto1: 2.7, alto2: 2.5,
    volIzq: { ancho: 3.45, fondo: 9.73, gableAlt: 1.45 },
    volDer: { ancho: 2.66, fondo: 9.73, gableAlt: 0.72 },
    techoMainAlt: 1.50,
    gableFrenteIzq: { x: 0.12, ancho: 3.35, fondo: 1.28, alt: 1.50 },
    gableFrenteDer: { x: 3.45, ancho: 2.66, fondo: 1.05, alt: 0.58 },
    gablePosterior: null,
  },
  techo: { alt: 1.20 },
};

// Casa 366: ancho total 10.78 m; laterales 2.60 m y 2.07 m mirando de frente.
export const cx = 2.60;
export const cz = L.antejardinMin; // 3.0

export const TOPE_DFL2 = 140.0;
export const M2_ACTUAL = 103.77;
export const M2_PRIMER_PISO = 49.90;
export const M2_SEGUNDO_PISO = 53.87;

export const PLAN3D = {
  upperFloor: {
    // Lectura desde elevacion principal del PDF: izquierda visual = techo menor y adelantado.
    leftSmall: {
      x: 0,
      ancho: 3.45,
      zFront: -0.12,
      fondo: L.casa.fondo - 1.35,
      roofAlt: L.casa.gableFrenteIzq.alt * 0.76,
    },
    // Derecha visual = volumen principal con ventana, mas retrasado y mas profundo.
    rightMain: {
      x: 2.35,
      ancho: L.casa.ancho - 2.35,
      zFront: 0.44,
      fondo: L.casa.fondo - 0.08,
      roofAlt: L.casa.gableFrenteIzq.alt * 1.12,
    },
  },
};

export const PLAN_FACTS = {
  proyecto: 'Vivienda Laurel 2020',
  conjunto: 'Altos del Maitén Etapa 7',
  constructora: 'MALPO',
  regimen: 'D.F.L. N°2',
  antejardinMin: 3.0,
  escalaPlantas: '1:50',
  escalaSuperficies: '1:100',
  superficieTerrenoAprox: 121,
};
