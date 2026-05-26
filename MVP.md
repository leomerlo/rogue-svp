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

- Modelo de datos del puzzle: cartas (2 colores), wilds, mesa como grafo de asientos.
- **Una topología fija hecha a mano**: anillo simple (6-8 asientos).
- **Un mazo hecho a mano** con solución conocida (garantiza solvability sin generador).
- Interacción de jugador:
  - Sentar una carta de la mano en un asiento.
  - Hacer *swap* entre dos cartas sentadas (con límite de swaps).
  - Descartar una carta (con límite de descartes).
- Cálculo de "felicidad" por invitado y resaltado visual de vecinos en conflicto.
- Detección de victoria: todos los invitados felices.
- Estado de derrota: sin swaps/descartes y mesa no resuelta.

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

---

## 4. Modelo de datos propuesto (borrador)

```ts
type Color = 'red' | 'blue' | 'green' | 'yellow' | 'wild';

interface Card {
  id: string;
  left: Color;   // mitad diagonal A
  right: Color;  // mitad diagonal B
}

interface Seat {
  id: string;
  neighbors: string[];      // ids de asientos adyacentes
  cardId: string | null;    // carta sentada, si hay
  fixedColor?: Color;       // VIP (fuera de MVP, pero el campo existe)
}

interface GameState {
  table: Record<string, Seat>;
  hand: Card[];
  deck: Card[];
  swapsLeft: number;
  discardsLeft: number;
  status: 'playing' | 'won' | 'lost';
}
```

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
