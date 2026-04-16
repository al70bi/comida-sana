export interface FoodExchange {
  name: string;
  amount: string;
  equivalent: string;
}

export const EXCHANGES: FoodExchange[] = [
  { name: "Pan", amount: "20g", equivalent: "50g de patata" },
  { name: "Arroz", amount: "20g (crudo)", equivalent: "20g de pasta o legumbre" },
  { name: "Aceite de Oliva", amount: "10ml", equivalent: "15g de frutos secos" },
  { name: "Fruta", amount: "150g", equivalent: "1 yogur natural sin azúcar" },
];

export interface AdherenceQuestion {
  id: number;
  question: string;
  points: number;
}

export const PREDIMED_TEST: AdherenceQuestion[] = [
  { id: 1, question: "¿Usa usted el aceite de oliva como principal grasa para cocinar?", points: 1 },
  { id: 2, question: "¿Consume usted 4 o más cucharadas soperas de aceite de oliva al día?", points: 1 },
  { id: 3, question: "¿Consume usted 2 o más raciones de verdura al día?", points: 1 },
  { id: 4, question: "¿Consume usted 3 o más piezas de fruta al día?", points: 1 },
  { id: 5, question: "¿Consume usted menos de 1 ración de carnes rojas o embutidos al día?", points: 1 },
  { id: 6, question: "¿Consume usted menos de 1 ración de mantequilla, margarina o nata al día?", points: 1 },
  { id: 7, question: "¿Consume usted menos de 1 ración de bebidas azucaradas al día?", points: 1 },
  { id: 8, question: "¿Bebe usted 7 o más vasos de vino a la semana?", points: 1 },
  { id: 9, question: "¿Consume usted 3 o más raciones de legumbres a la semana?", points: 1 },
  { id: 10, question: "¿Consume usted 3 o más raciones de pescado o marisco a la semana?", points: 1 },
  { id: 11, question: "¿Consume usted menos de 2 raciones de repostería comercial a la semana?", points: 1 },
  { id: 12, question: "¿Consume usted 3 o más raciones de frutos secos a la semana?", points: 1 },
  { id: 13, question: "¿Consume usted preferentemente carne de pollo, pavo o conejo en vez de ternera o cerdo?", points: 1 },
  { id: 14, question: "¿Consume usted 2 o más veces a la semana verduras cocinadas, pasta, arroz u otros platos aderezados con sofrito?", points: 1 },
];

export const MENU_1800_KCAL = {
  desayuno: "Café con leche desnatada, 40g de pan integral con aceite de oliva virgen extra y tomate.",
  mediaManana: "Una pieza de fruta de temporada (ej. naranja o manzana).",
  comida: "Lentejas estofadas con verduras (calabaza, laurel), pescado a la plancha con ensalada variada, y fruta.",
  merienda: "Yogur natural con un puñado de nueces (30g).",
  cena: "Crema de calabaza y zanahoria, tortilla francesa de dos huevos con espinacas, y una infusión.",
};

export const MENU_1500_KCAL = {
  desayuno: "Café con leche desnatada, 30g de pan integral con tomate.",
  mediaManana: "Una pieza de fruta.",
  comida: "Ensalada de garbanzos con pimientos y cebolla, pechuga de pollo a la plancha, y fruta.",
  merienda: "Yogur natural desnatado.",
  cena: "Verduras al horno (berenjena, calabacín), pescado blanco al vapor, y una infusión.",
};
