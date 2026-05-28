# RSVP Roguelike — Documento de Diseño Técnico

> **Versión:** Preliminar (esqueleto técnico-narrativo)
> **Propósito:** Guiar el desarrollo del prototipo y la producción de contenido narrativo.

---

## Índice

1. [Concepto](#1-concepto)
2. [Mecánica base (heredada de RSVP)](#2-mecánica-base-heredada-de-rsvp)
3. [Capa roguelike](#3-capa-roguelike)
4. [Mapa bifurcable](#4-mapa-bifurcable)
5. [Sistema generacional](#5-sistema-generacional)
6. [Hilos narrativos](#6-hilos-narrativos)
7. [Meta-progreso (entre runs)](#7-meta-progreso-entre-runs)
8. [Tono y voz](#8-tono-y-voz)
9. [Sistema de escritura modular](#9-sistema-de-escritura-modular)
10. [Contenido a producir](#10-contenido-a-producir)
11. [Riesgos a mitigar](#11-riesgos-a-mitigar)
12. [Próximos pasos sugeridos](#12-próximos-pasos-sugeridos)

---

## 1. Concepto

Juego de cartas tipo puzzle inspirado en **RSVP: The Dinner Party Game** (Pop & Company, ~2006), combinado con estructura roguelike (*Slay the Spire* / *Balatro*) y elecciones de ruta narrativa (*Absolum*).

El jugador anfitriona fiestas donde debe sentar invitados alrededor de mesas; cada invitado es una carta con dos colores y solo es feliz si **todos** los asientos adyacentes (no bloqueados) están ocupados y los bordes compartidos coinciden en color.

La capa narrativa cuenta una **saga generacional** de comedia/drama al estilo *Pilares de la Tierra*, con tono más liviano (Wodehouse, *Amélie*, *Gosford Park*). Cada run cubre **tres generaciones** de una familia/pueblo.

---

## 2. Mecánica base (heredada de RSVP)

> **Fuente:** análisis del juego original en `docs/design_doc.pdf` (Róbert Darida, 2025). Se preservan las dinámicas que lo hacían divertido; los valores numéricos son punto de partida y se afinan con la capa roguelike.

### 2.1 Cartas, asientos, felicidad

- Cada carta = un invitado, **dividida diagonalmente en dos colores (mitad A / mitad B)**. Cada color cubre **dos de los cuatro bordes cardinales** de la carta (por convención fija: A en superior+izquierdo, B en inferior+derecho — la diagonal exacta es detalle de arte). Ver ADR-0001.
- La mesa es una **grilla MxN de celdas**. Cada celda es **libre** (asiento vacío), **anclada** (asiento con carta pre-colocada, inmovible) o **bloqueada** (hueco del layout). Dos asientos son adyacentes si comparten un borde cardinal en la grilla (top/bottom/left/right).
- Un invitado está "feliz" si **cada asiento adyacente** (celda libre ortogonal, no bloqueada) **tiene carta** y, en ese borde compartido, los colores coinciden (o uno es wild). Un asiento vacío adyacente implica infeliz.
- Cartas comodín (*wild*) cuentan como cualquier color en ambas mitades.
- **Objetivo de cada fiesta:** todos los invitados felices al terminar de sentar.

### 2.2 Mano y robo

- El jugador ve **3 cartas a la vez** (la mano visible), tomadas del tope del mazo.
- Al sentar una carta, se roba inmediatamente la siguiente del mazo, manteniendo la mano en 3.
- No se pueden descartar cartas individualmente — el único descarte es el re-deal (§2.3).

### 2.3 Re-deal

- El jugador puede **descartar las 3 cartas visibles** y recibir 3 nuevas del mazo.
- **Límite por fiesta:** 4 re-deals (valor base, modificable por relics o anfitrión).
- **Coste:** cada re-deal resta **5 puntos** del puntaje de la fiesta.

### 2.4 Swaps

- Una carta ya sentada puede moverse a un asiento libre, o intercambiarse con otra ya sentada.
- **Swaps ilimitados mientras el estado sea `playing`** (igual que el original durante la fase activa). Cuando la mesa queda llena, la partida se resuelve inmediatamente en victoria o derrota y ya no se permiten swaps.

### 2.5 Puntaje

Cada carta tiene un valor en una de 6 escalones, asignado por la "rareza" de su combinación de colores:

| Valor | Patrón aproximado en el original |
|------:|----------------------------------|
| **0** | Wilds (3 cartas en el mazo) |
| **5** | Mitad dominante azul/rojo (las más comunes) |
| **10** | Mitad dominante verde |
| **15** | Combinaciones verde-amarillo |
| **20** | Amarillo con otro color |
| **25** | Amarillo-amarillo (las más raras) |

> La distribución completa carta-por-carta vive en el apéndice del design doc original. Los valores no son función pura del color (hay duplicados con valores distintos), pero la correlación rareza→valor se sostiene.

**Reglas de puntaje:**

- Puntos se acreditan **sólo al completar la fiesta** (todos los invitados felices). Perder = 0 puntos en esa mesa.
- `puntaje_fiesta = Σ(valor de cartas sentadas) − 5 · (re-deals usados)`.
- En la capa roguelike, el puntaje base será modificado por relics, invitados especiales y rituales del anfitrión (multiplicadores, bonos por chains, etc.) — diseño detallado en M3.

---

## 3. Capa roguelike

### 3.1 Estructura de la run

- Una run = una "saga familiar" de **3 actos = 3 generaciones**, separadas por elipsis temporales de ~15-20 años.
- **Duración objetivo:** **15-20 min por run** (ADR-0011).
- Cada acto tiene su propio sub-mapa bifurcable de **3 nodos jugables + 1 nodo de cierre** (ADR-0011).
- Entre actos: interludio narrativo en el hub.
- **Modelo de falla: hard-fail 1-strike (ADR-0011).** Cualquier fiesta perdida termina la run inmediatamente. No hay strikes, no hay continuación tras fallar.
- **Meta-progresión: librería persistente entre runs (ADR-0011).** Cada run, completada o cortada, aporta **cartas (extras) y buffs (modifiers)** a una librería que persiste a través de runs. La cantidad escala con cuántas fiestas se sobrevivieron. Futuras runs siembran su **extras inventory** desde esta librería.
- **Cada run = saga nueva.** Nueva familia, nuevo pueblo, roster fresco. La saga anterior fue cortada o concluida. La meta-progresión se justifica narrativamente como **heredads que pasan entre familias** (§7.3).
- **Modelo de mazo: core fijo + extras del jugador (ADR-0008, supersede parte de ADR-0004 y todo ADR-0007).** Cada fiesta tiene un **core obligatorio**: los personajes que deben asistir según el tipo (boda → novia, novio, padres, etc.), tomados del **roster familia/pueblo** de la saga. El generador construye el core de forma **solvable por construcción** sobre la topología del nodo. El jugador no puede quitar ni reemplazar guests del core — sólo añade un budget pequeño de **extras** (guests bonus con efectos) y **modifiers** (buffs / consumibles / items) desde su **extras inventory** acumulada durante la run.
- **Dos pools:** **roster familia/pueblo** (nivel saga, crece con nacimientos/matrimonios) vs **extras inventory** (nivel run, crece con recompensas de nodos).
- **Protecciones (ADR-0006):** (1) cada guest del roster es un personaje único — sin duplicados; (2) en la selección de extras sólo se ve el **tipo de fiesta** (etiqueta narrativa), no la topología; (3) las reglas mecánicas internas del generador (VIPs, cuotas) viven dentro del core construido, no como gate público.

### 3.2 Mejoras durante la run

| Mejora | Descripción |
|--------|-------------|
| **Invitados especiales** | Cartas con efectos (camaleón, alma de la fiesta, tímido, chismoso, etc.) que se suman al **extras inventory** del jugador (ADR-0008). Se invitan como "+1" a las fiestas, fuera del core obligatorio. |
| **Relics** | Efectos pasivos permanentes para la run (+1 descarte, ver próximas cartas, wild gratis al iniciar, etc.). |
| **Consumibles** | Usos únicos (cambiar color de una mitad, rotar carta sentada, brindis = wild instantáneo). |
| **Rituales del Anfitrión** | Habilidad activa que se carga jugando bien y se descarga en momentos clutch. Define el "estilo de juego" de la run. |

### 3.3 Generación procedural de mesas

**Parámetros del generador:**

- **Topología:** grilla MxN con **patrón de celdas bloqueadas** generado proceduralmente (ADR-0001). Toda la variedad visual y mecánica viene de qué celdas se bloquean. Layouts típicos: anillo perimetral (centro bloqueado), anillo con cola, anillo doble, forma de H, mesa con isla central, ramificaciones (puentes finos entre regiones), filas independientes, etc.
- **Mazo:** cantidad de colores en juego, proporciones, wilds, especiales.
- **Restricciones:** asientos anclados (carta pre-colocada, inmovible — ver ADR-0016), sillas rotas (bloqueos adicionales), asientos vacíos obligatorios.

**Estrategia de solvability:**

- *Construcción inversa* para mesa base: generar una solución válida y derivar el mazo desde ahí. Garantiza solvability.
- *Generate-and-test* para validar modificadores raros (relics que alteran el generador).

**Calibración de dificultad** (métricas para clasificar mesas):

- Cantidad de soluciones válidas
- Grado promedio del grafo
- Ratio wilds/asientos
- Cuellos de botella topológicos

> El generador apunta a un *target* de dificultad y rechaza fuera de rango.

---

## 4. Mapa bifurcable

### 4.1 Estructura

- Cada acto = sub-mapa propio.
- 5-8 nodos jugables + 1 nodo de cierre por acto.
- Nodos conectados por aristas; el jugador elige ruta.
- **Visualización temática:** página de diario de sociedad de época (cada nodo es un recorte/columna).

### 4.2 Tipos de nodo

| Tipo | Descripción |
|------|-------------|
| **Fiesta canónica** | Mesa estándar a resolver. |
| **Encuentro íntimo** | 1-2 personajes, decisión narrativa, modifica relaciones. |
| **Evento del pueblo** | Boda, funeral, festival; mesa con reglas especiales temáticas. |
| **Crisis** | Algo se rompe (financiero, romántico, moral), fuerza acción. |
| **Chisme** | Información pura, muestra Estado del Mundo, dispara opciones futuras. |
| **Cierre de acto** | Evento grande que define qué carga la siguiente generación. |

---

## 5. Sistema generacional

> ⚠️ **Sistema familiar/narrativo completo diferido a M4 (ADR-0003).** En MVP/M2 no existe sistema generacional. **M3 sí lleva una versión esqueletal (ADR-0014):** personajes nombrados con relaciones mínimas (cónyuge, padres, hijos), efectos narrativos puros disparados por éxito binario en mesas (bodas → matrimonio; bautismos → hijo; funerales → muerte). El resto — tensión entre familias, beats narrativos en bordes de actos, consecuencias relacionales en Encuentros/Chismes, efectos de Crisis — vive en M4 sobre los mismos datos. Narrativas guionadas (sagas de tutorial, escenarios temáticos) componen sobre la base procedural sin cambiar contratos (ADR-0014, layer 1-3). El contenido de abajo es el **diseño objetivo para M4**.

### 5.1 Carta-Persona con tres estados

Cada personaje recurrente existe como tres cartas distintas (**joven / adulto / anciano**), pero comparten una identidad única. El sistema rastrea lo hecho con esa identidad para modificar las versiones siguientes.

### 5.2 Linaje

- Decisiones del Acto I generan cartas nuevas para Acto II (**hijos**).
- Decisiones del Acto II generan cartas para Acto III (**nietos**).
- Los hijos heredan rasgos de ambos padres como modificadores mecánicos.

### 5.3 Estado del Mundo

Variables persistentes que la run trackea entre actos:

- Prestigio por familia
- Estado de cada hilo narrativo activo
- Etiquetas acumuladas por carta-persona (traicionado, enamorado, humillado, deudor, etc.)
- Hijos/nietos generados
- Objetos heredables obtenidos
- Muertes ocurridas (y cuándo)
- Rumores activos / deudas pendientes

> No se muestran como stats; se describen narrativamente ("Los Veillard están en bancarrota silenciosa").

### 5.4 Memoria mecánica

Personajes adultos/ancianos tienen efectos modificados por lo ocurrido cuando eran jóvenes. Cada carta-persona lleva **1-3 etiquetas** que modifican el efecto base.

### 5.5 Interludio entre actos

Pantalla narrativa breve que resume los 15-20 años de elipsis. Texto generado a partir del Estado del Mundo. Muestra envejecimientos, muertes, mudanzas, nacimientos.

---

## 6. Hilos narrativos

Tramas troncales que cruzan los actos. **Limitar a 4-5 hilos por run**; el jugador no puede perseguir todos.

**Estructura de cada hilo:**

- **Trigger inicial:** qué nodo lo abre.
- **2-3 puntos de decisión** a lo largo de los actos.
- **Payoff final:** qué desbloquea, qué carta entrega, qué consecuencia tiene.

**Estados de hilo al cierre de cada acto:**

- Resuelto a favor
- Resuelto en contra
- Abierto (modificado en el acto siguiente)

---

## 7. Meta-progreso (entre runs)

> **Filosofía:** 80% *Slay the Spire* (variedad), 20% *Hades* (cosmético/narrativo). No stats permanentes que escalen.

### 7.1 Capas

1. **Desbloqueo de contenido (librería acotada, ADR-0013):** ~50 extras + ~50 buffs, autorados; descubrimiento permanente al ganarlos por primera vez. Después de completar la librería, todas las recompensas de "carta" se auto-convierten a Vaticinios.
2. **Anfitriones (personajes jugables):** comprables con **Vaticinios** en el hub (ADR-0013). Cada uno con reglas de partida distintas. *Carve-out explícito al "Vaticinios no compran poder":* un host es una *variante de juego* (distinta forma, mismo piso de dificultad), no power scaling.
3. **Ascensiones:** modificadores permanentes más duros tras ganar con un host. Para hardcore.
4. **Vaticinios** (currency suave persistente): gastable en cosméticos, skins, mini-historias, hosts. No afecta poder mecánico (excepto el carve-out de hosts).

### 7.2 Currencies (ADR-0013)

| Currency | Origen | Uso | Persistencia |
|----------|--------|-----|--------------|
| **Rumores** | Recompensas de nodos en la run (Chisme, Encuentro, Fiesta/Evento opcional, Crisis) | Compras durante la run: relics, consumibles, shops | Se pierde al terminar la run |
| **Vaticinios** | Auto-conversión cuando una recompensa daría una carta ya en la librería | Cosméticos + hosts (en el hub) | Persistente |

> Glosa narrativa de Vaticinios: el jugador ya ha "presagiado" / vivido estos escenarios en sagas previas; el meta-conocimiento se acumula como Vaticinios entre familias.

**Recompensas por tipo de nodo (§4.2):**

| Nodo | Riesgo | Recompensa |
|---|---|---|
| Fiesta canónica / Evento del pueblo | Mesa-puzzle (falla = run over) | Carta O Rumores (visible en el mapa) |
| Chisme | Seguro (narrativo) | Rumores (fit temático: chisme = rumor) |
| Encuentro íntimo | Seguro (narrativo) | Rumores pequeños vía outcome de diálogo |
| Crisis | Mesa-puzzle alto-riesgo | Recompensa alta — carta rara O Rumores grandes |
| Cierre de acto | Variable (cualquier tipo) | Recompensa grande |

**Safe-route gate (ADR-0013):** el generador M2 garantiza que **toda ruta a través del sub-mapa de un acto contiene ≥1 nodo mesa-puzzle**. Evita rutas degeneradas de puros nodos seguros. Mínimo garantizado: 3 mesas-puzzle por run (1 por acto), independientemente de la ruta.

### 7.3 Persistencia narrativa

- **Libro de visitas** en el hub que registra todas las generaciones jugadas.
- **Objetos heredables** que persisten entre runs (ej. reloj de pie disputado).
- **"Finales descubiertos"** como desbloqueos (ADR-0005). Cada final único — categorizado en bandas fuzzy (triunfante / mixto / oscuro / catastrófico / terminal) — desbloquea contenido meta. El jugador apunta a dos vectores: vertical (subir la jerarquía) y lateral (descubrir variedad).

---

## 8. Tono y voz

> **Regla de oro:** las situaciones son cómicas, las emociones son sinceras.

**Referencias de tono:**

- *Amélie* — ternura visual, absurdo cotidiano.
- *Gosford Park* — observación social.
- *Death of Stalin* — comedia política entre poderosos pequeños.
- *Cien años de soledad* — la familia que se repite.
- *Wodehouse* — diálogos donde nadie dice lo que quiere decir.

**Narrador omnisciente** con voz seca y melancólica. Aparece en interludios.

---

## 9. Sistema de escritura modular

Para no morir produciendo texto:

### 9.1 Arquetipos sobre identidades

8-10 arquetipos (El Snob, La Heredera, El Diplomático, La Femme Fatale, El Bohemio, etc.). Cada arquetipo tiene:

- **Postura social:** cómo se relaciona.
- **Debilidad cómica:** qué lo hace ridículo.

> Los personajes específicos son **arquetipo + nombre + rasgo distintivo**.

### 9.2 Eventos modulares con slots

**Contrato formal: ADR-0015.** Dos pools de plantillas:

- **One-liners por tipo de fiesta (ADR-0015):** ~60-80 strings de **una sola línea**, 8-10 por tipo, con slots `[BRIDE.name]`, `[CHAR.family]`, etc. Se rellenan proceduralmente desde el `SagaState`. Sagas guionadas (tutoriales, unlocks temáticos) usan overrides per-node sobre los mismos contratos.
- **Interludios y beats multi-línea (M4):** los ~50-80 eventos de 3-6 líneas originales viven en pools separados con su propio budget — interludios entre actos, beats de tensión, efectos de Encuentros/Chismes.

> One-liner por fiesta: *"[BRIDE.name] se casa con un forastero; los viejos lo miran de reojo."*
> Interludio multi-línea (M4): *"[INVITADO_A] se acerca con cara de querer contarte algo sobre [INVITADO_B]…"*

El mismo evento se siente fresco con diferentes nombres porque los arquetipos (§9.1) tienen rasgos definidos.

### 9.3 Memoria persistente del mundo

Aunque cada run es nueva, el hub recuerda patrones del jugador:

> "Esta es la tercera temporada que invitás a Lady Ashbourne. Empieza a sospechar que te interesa."

---

## 10. Contenido a producir

Para una versión jugable inicial:

- [ ] 8-10 arquetipos con postura social y debilidad cómica
- [ ] 30-40 nombres de familia/personaje específicos
- [ ] 50-80 eventos cortos modulares
- [ ] 4-5 hilos narrativos troncales con puntos de decisión
- [ ] 6 textos de interludio plantilla (variaciones de Estado del Mundo)
- [ ] Voz del narrador omnisciente: tono, tics, vocabulario base
- [ ] 10-15 invitados especiales mecánicos
- [ ] 8-12 relics
- [ ] 4-6 topologías de mesa base
- [ ] 1 anfitrión jugable inicial

> **Orden recomendado de escritura:** arquetipos → voz del narrador → primeros eventos → hilos troncales.

---

## 11. Riesgos a mitigar

| Riesgo | Mitigación |
|--------|-----------|
| **Repetición de runs** | Si las mesas se memorizan, muere la rejugabilidad → fuerte generación procedural. |
| **Texto excesivo** | Matar el ritmo del juego → eventos de 10-15 segundos de lectura máx. |
| **Decisiones sin consecuencia mecánica** | Si elegir bando no cambia nada visible, se siente vacío. |
| ~~**Tiempo de run muy largo**~~ | ~~Una corrida perdida no debería costar 45 min de fáciles para volver al jefe.~~ **Resuelto por ADR-0011** — runs de 15-20 min + meta-progresión hacen tolerable el hard-fail. |
| **Power creep meta** | Stats permanentes acumulables matan la curva de dificultad → desbloquear variedad, no poder. |

---

## 12. Próximos pasos sugeridos

1. Definir arquetipos y voz narrativa (escritura).
2. Prototipo jugable mínimo del puzzle base + generación procedural de una mesa.
3. Sistema de estado del mundo y etiquetas en carta-persona (técnico).
4. Primer hilo narrativo completo como vertical slice.
5. Iterar.
