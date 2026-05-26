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

El jugador anfitriona fiestas donde debe sentar invitados alrededor de mesas; cada invitado es una carta con dos colores y solo es feliz si sus vecinos coinciden en color.

La capa narrativa cuenta una **saga generacional** de comedia/drama al estilo *Pilares de la Tierra*, con tono más liviano (Wodehouse, *Amélie*, *Gosford Park*). Cada run cubre **tres generaciones** de una familia/pueblo.

---

## 2. Mecánica base (heredada de RSVP)

- Cada carta = un invitado, dividida diagonalmente en dos colores.
- La mesa es un **grafo de asientos**; cada asiento tiene vecinos.
- Un invitado está "feliz" si todos sus vecinos comparten color con la mitad correspondiente de su carta.
- Cartas comodín (*wild*) cuentan como cualquier color.
- **Objetivo de cada fiesta:** todos los invitados felices al terminar de sentar.
- **Recursos por fiesta:** descartes limitados, swaps limitados.

---

## 3. Capa roguelike

### 3.1 Estructura de la run

- Una run = una "saga familiar" de **3 actos = 3 generaciones**, separadas por elipsis temporales de ~15-20 años.
- **Duración objetivo:** 35-45 min por run.
- Cada acto tiene su propio sub-mapa bifurcable de **5-8 nodos jugables + 1 nodo de cierre**.
- Entre actos: interludio narrativo en el hub.

### 3.2 Mejoras durante la run

| Mejora | Descripción |
|--------|-------------|
| **Invitados especiales** | Cartas con efectos (camaleón, alma de la fiesta, tímido, chismoso, etc.) que se suman al mazo. |
| **Relics** | Efectos pasivos permanentes para la run (+1 descarte, ver próximas cartas, wild gratis al iniciar, etc.). |
| **Consumibles** | Usos únicos (cambiar color de una mitad, rotar carta sentada, brindis = wild instantáneo). |
| **Rituales del Anfitrión** | Habilidad activa que se carga jugando bien y se descarga en momentos clutch. Define el "estilo de juego" de la run. |

### 3.3 Generación procedural de mesas

**Parámetros del generador:**

- **Topología:** grafo de asientos generado proceduralmente (anillo, doble anillo, H, mesa con isla, ramificación).
- **Mazo:** cantidad de colores en juego, proporciones, wilds, especiales.
- **Restricciones:** asientos VIP de color fijo, sillas rotas, asientos vacíos obligatorios.

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

1. **Desbloqueo de contenido:** nuevos invitados, relics, topologías, modificadores. Triggers por logros, no por horas.
2. **Anfitriones (personajes jugables):** cada uno con reglas de partida distintas y su propio árbol de desbloqueos.
3. **Ascensiones:** modificadores permanentes más duros tras ganar con un host. Para hardcore.
4. **Currency suave:** gastable en cosméticos, skins, mini-historias, modos alternativos. No afecta poder.

### 7.2 Currencies (estilo *Absolum*, separadas por propósito)

| Currency | Origen | Uso |
|----------|--------|-----|
| **Invitaciones** | Durante la run | Descartes, comprar cartas en run. |
| **Recuerdos** | Al cerrar run | Desbloqueos permanentes del personaje. |
| **Rumores** | Logros específicos | Hosts nuevos, modificadores exóticos. |

### 7.3 Persistencia narrativa

- **Libro de visitas** en el hub que registra todas las generaciones jugadas.
- **Objetos heredables** que persisten entre runs (ej. reloj de pie disputado).
- **"Finales descubiertos"** como desbloqueos en vez de stats.

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

Escribir ~50-80 eventos cortos (3-6 líneas) con slots de arquetipo:

> "[INVITADO_A] se acerca con cara de querer contarte algo sobre [INVITADO_B]…"

El mismo evento se siente fresco con diferentes nombres porque los arquetipos tienen rasgos definidos.

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
| **Tiempo de run muy largo** | Una corrida perdida no debería costar 45 min de fáciles para volver al jefe. |
| **Power creep meta** | Stats permanentes acumulables matan la curva de dificultad → desbloquear variedad, no poder. |

---

## 12. Próximos pasos sugeridos

1. Definir arquetipos y voz narrativa (escritura).
2. Prototipo jugable mínimo del puzzle base + generación procedural de una mesa.
3. Sistema de estado del mundo y etiquetas en carta-persona (técnico).
4. Primer hilo narrativo completo como vertical slice.
5. Iterar.
