type Color = 'red' | 'blue' | 'green' | 'yellow' | 'wild';

type Side = 'top' | 'bottom' | 'left' | 'right';

// La carta tiene dos colores. Por convención fija, colorA cubre los bordes
// superior+izquierdo de la carta y colorB los bordes inferior+derecho.
// El matching entre dos cartas adyacentes en la grilla compara el borde
// específico que se tocan (no las "mitades" de forma abstracta).
interface Card {
  id: string;
  colorA: Color;   // cubre bordes top + left
  colorB: Color;   // cubre bordes bottom + right
}

type CellState = 'free' | 'blocked';

interface Cell {
  row: number;
  col: number;
  state: CellState;
  cardId: string | null;
  fixedColor: Color | null;
}

interface GameState {
  rows: number;
  cols: number;
  cells: Cell[];
  hand: Card[];
  deck: Card[];
  redealsLeft: number;
  placedCards: Record<string, Card>;
  status: 'playing' | 'won' | 'lost';
}

type Move = { type: 'place'; cardId: string; row: number; col: number }

export type { Card, Cell, Color, GameState, Move, Side };