# RSVP Roguelike — Alcance del MVP

> **Objetivo:** validar que el puzzle base de sentar invitados es divertido por sí solo, antes de invertir en las capas caras (saga generacional, hilos narrativos, meta-progreso).
> **Stack:** Web — React + TypeScript.
> **Documento padre:** ver [`Context.md`](./Context.md) para el diseño completo.

---

## 1. Filosofía del recorte

El diseño completo describe un juego grande. El MVP **deliberadamente no lo construye todo**. La regla es:

> Si el puzzle de una sola mesa no engancha, ninguna capa narrativa lo salva. Validamos el corazón primero.

**Dentro del MVP:** la mecánica base de RSVP (sección 2 de `Context.md`), jugable sobre una mesa.
**Fuera del MVP (por ahora):** generación procedural, runs, relics, sistema generacional, narrativa, meta-progreso.

---

## 2. Alcance del MVP (Milestone 1)

### 2.1 Incluido

- Modelo de datos del puzzle: cartas (2 colores con bordes cardinales), wilds, mesa como **grilla con celdas bloqueadas** (ADR-0001).
- **Dos topologías fijas hechas a mano** (Q2: path-primero, ambas):
  1. **Path** — 1x6 (fila simple, 6 asientos en cadena). Es el caso más cercano al row-segment del original y el más simple para arrancar.
  2. **Ring** — 3x3 con la celda central bloqueada → 8 asientos en anillo perimetral. "Happy Hour Lite": misma idea que el Level 1 del original pero más chico.
- **Un mazo hecho a mano por mesa**, con solución conocida (garantiza solvability sin generador). Composición:
  - **4 colores** (rojo, azul, verde, amarillo) — fiel al original.
  - **1 wild** por mazo — testea la mecánica de wild a pequeña escala.
  - **Tamaño = #asientos + 6** — buffer suficiente para que los 4 re-deals tengan utilidad real. Path 1x6 → mazo de 12; ring 3x3 → mazo de 14.
- **Mano de 3 cartas visibles** (top del mazo); al sentar una, se roba otra automáticamente.
- Interacción de jugador:
  - Sentar una carta de la mano en un asiento.
  - Hacer *swap* entre dos cartas sentadas, o mover una sentada a un asiento libre (ilimitado).
  - **Re-deal**: descartar las 3 cartas de la mano y robar 3 nuevas (límite de 4 por fiesta).
- Cálculo de "felicidad" por invitado y resaltado visual de vecinos en conflicto.
- Detección de victoria: mesa llena y todos los invitados felices.
- Estado de derrota: mesa llena pero algún invitado infeliz.

### 2.2 Explícitamente NO incluido

- Generación procedural de mesas (Milestone 2).
- Múltiples mesas / estructura de run / relics (Milestone 3).
- Cualquier texto narrativo, eventos, arquetipos (Milestone 4).
- Sistema generacional y Estado del Mundo (el más caro, va último).
- Persistencia, cuentas, audio, meta-progreso.

---

## 3. Decisiones técnicas (React + TS)

### 3.1 Separación lógica / UI

La lógica del puzzle vive en **TypeScript puro, sin React**, en un módulo aislado:

- Funciones puras y tipos: `Color`, `Card`, `Seat`, `TableGraph`, `GameState`.
- Reglas: `isGuestHappy(seat, state)`, `isSolved(state)`, `applyMove(state, move)`.
- Esto permite testear la lógica con Vitest sin renderizar nada, y reusarla cuando entre el generador.

### 3.2 Estado

- `useReducer` para el estado del juego (movimientos como acciones puras). Evita acoplar reglas a componentes.
- Sin librería de estado global todavía (no hace falta para una mesa).

### 3.3 Render

- Mesa dibujada con **SVG** (asientos como nodos, aristas como líneas). Más simple que Canvas para empezar y permite click handlers nativos por asiento.
- Drag & drop: empezar con **click-para-seleccionar + click-para-colocar** (más simple y testeable que DnD real). DnD se evalúa después.

### 3.4 Herramientas

- Vite + React + TypeScript.
- Vitest para tests de la lógica pura.
- Sin backend.

### 3.5 Web ahora, mobile después (Capacitor)

Decisión: **React web puro durante M1-M3, y envolver con Capacitor cuando se quiera ir a mobile.** No usamos React Native.

**Por qué no React Native:** RN renderiza con componentes nativos de UI (pensado para apps tipo listas/formularios), no para render custom de un tablero de juego con animaciones. Hacer un juego en RN obliga a meter `react-native-skia` o un canvas y pelear contra el framework. La web ya tiene SVG/Canvas/WebGL de primera, que es donde viven los juegos 2D.

| | React web + Capacitor | React Native |
|---|---|---|
| Render de tablero/cartas | SVG/Canvas/WebGL nativo del browser | Necesita Skia/canvas extra |
| Animaciones de juego | Maduras (CSS, Pixi, Framer Motion) | Más fricción para game-feel |
| Iterar rápido | Recargar el browser; deploy = una URL | Build nativo más pesado |
| Compartir prototipo | Mandar un link | Hay que instalar app |
| Llegar a iOS/Android | Capacitor envuelve el build web | Nativo de entrada |
| Ecosistema de juegos 2D | Pixi, Phaser, etc. | Pobre |

**Plan:**
- **M1-M3:** React web puro. Se itera en el browser y se comparte por link; cero costo mobile.
- **Cuando se quiera mobile:** envolver el mismo build con **Capacitor** (o Tauri si además se quiere desktop). No se reescribe nada — es la app web corriendo en un WebView con acceso a APIs nativas.

**Implicancia para M1:** diseñar el layout **responsive y touch-first** (que funcione con dedo, no solo mouse) desde el inicio, para que el wrapper a mobile sea trivial. Encaja con la interacción "click/tap-para-colocar" ya elegida en §3.3.

---

## 4. Modelo de datos propuesto (borrador)

```ts
type Color = 'red' | 'blue' | 'green' | 'yellow' | 'wild';

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
  cardId: string | null;    // sólo válido si state === 'free'
  fixedColor?: Color;       // VIP (fuera de MVP, pero el campo existe)
}

interface GameState {
  rows: number;
  cols: number;
  cells: Cell[];                      // longitud = rows*cols, indexado por row*cols + col
  hand: Card[];                       // mano visible: siempre 3 cartas mientras quede mazo
  deck: Card[];
  placedCards: Record<string, Card>;  // cartas sentadas; clave = card.id
  redealsLeft: number;                // descarte de la mano completa (no por carta)
  status: 'playing' | 'won' | 'lost';
}
```

**Zonas de cartas (deck → hand → mesa):**

Cada carta vive en exactamente una zona a la vez. `deck` y `hand` guardan los objetos `Card` completos; la mesa guarda sólo referencias (`cell.cardId`). Al sentar una carta, se saca de `hand`, se registra en `placedCards[card.id]`, y se asigna `cell.cardId`. Sin `placedCards`, los datos de color de una carta sentada se pierden al salir de `hand`/`deck`. Los swaps mueven ids entre celdas; los objetos permanecen en `placedCards`.

**Helpers derivados (no estado):**

- `neighborsOf(cell, state)` → hasta 4 celdas libres adyacentes en la grilla.
- `edgeColor(card, side)` → color del borde `top|bottom|left|right` según la convención A/B.
- `getCard(state, id)` → busca en `placedCards`, luego `hand`, luego `deck`.
- `isHappy(cell, state)` → todos los bordes compartidos con vecinos sentados coinciden (o uno es wild).

> El modelo deja "huecos" baratos (`fixedColor`) para no rehacerlo cuando crezca, pero no implementa nada más allá del MVP.

---

## 5. Criterio de "hecho" del MVP

- [ ] Puedo abrir la app y ver una mesa con asientos y mi mano.
- [ ] Puedo sentar, swapear y descartar respetando los límites.
- [ ] El juego marca visualmente quién está feliz y quién no.
- [ ] El juego detecta victoria cuando todos están felices.
- [ ] La lógica del puzzle tiene tests unitarios que pasan.
- [ ] La mesa de ejemplo es resoluble y la puedo resolver a mano.

---

## 6. Roadmap incremental (después del MVP)

| Milestone | Foco | Qué desbloquea |
|-----------|------|----------------|
| **M1 — MVP** | Una mesa fija jugable | Validar diversión del puzzle base. |
| **M2 — Generador** | Generación procedural por construcción inversa (Context §3.3) | Rejugabilidad; clasificación de dificultad. |
| **M3 — Run** | 3-4 mesas encadenadas + relics simples + recursos | El loop roguelike mínimo. |
| **M4 — Narrativa mínima** | Eventos modulares con slots (Context §9.2) sobre un acto | Da el ángulo único; bajo costo. |
| **M5 — Generacional** | Carta-Persona, etiquetas, Estado del Mundo (Context §5) | La identidad del juego; el sistema más caro, va al final. |

---

## 7. Riesgo asumido conscientemente

Posponer la saga generacional (M5) significa que durante M1-M4 el proyecto se parece a "otro roguelike de cartas" sin su sello distintivo. Lo aceptamos a cambio de **validar la diversión base con poco esfuerzo** antes de comprometernos al sistema más complejo del diseño.
