# Taller de Patrones de Diseño

Repositorio con la solución del taller de arquitectura de software. Cada
ejercicio implementa un patrón de diseño diferente en un archivo independiente,
con comentarios que explican qué hace el patrón, qué problema resuelve y por
qué es una solución adecuada.

## Integrantes

- Angel Julian Cuero Jiménez
- Jose Alejandro Loaiza Lopéz

## Patrones utilizados

| N.º | Patrón   | Tipo         | Archivo                        |
| --- | -------- | ------------ | ------------------------------ |
| 1   | Builder  | Creacional   | `ejercicios/01-builder.ts`     |
| 2   | Adapter  | Estructural  | `ejercicios/02-adapter.ts`     |
| 3   | Flyweight| Estructural  | `ejercicios/03-flyweight.ts`   |
| 4   | Observer | Comportamiento | `ejercicios/04-observer.ts`  |

## Descripción de los ejercicios

### 1. Builder — Creador de personajes de videojuego

Se construyen personajes RPG con muchos atributos: nombre, clase, nivel, vida,
maná, ataque, defensa, habilidades y equipamiento. El `CharacterBuilder`
permite configurar el personaje paso a paso con métodos encadenados y valida
los datos antes de llamar a `build()`. Un `CharacterDirector` reutiliza recetas
para crear arquetipos coherentes de guerrero, mago y arquero.

**Problema que resuelve:** evita constructores con demasiados parámetros
opcionales, errores en el orden de los argumentos y objetos incompletos o
inválidos. **Por qué Builder:** separa la construcción de la representación,
centraliza la validación y permite reutilizar configuraciones complejas.

### 2. Adapter — Comparador de costos de envío

Una tienda compara las cotizaciones de FedEx, DHL Express y ServiEntrega. Cada
transportadora tiene una API distinta: FedEx usa libras, millas y dólares; DHL
recibe y devuelve objetos propios; ServiEntrega usa kilogramos, kilómetros y
pesos colombianos. Cada API se envuelve en un adaptador que implementa la
interfaz común `ShippingProvider`, de modo que `ShippingComparator` trabaja
siempre con el mismo tipo de dato (`ShippingQuote`).

**Problema que resuelve:** integra APIs de terceros incompatibles entre sí, con
unidades y estructuras de respuesta diferentes, sin modificar su código.
**Por qué Adapter:** convierte la interfaz de cada servicio a la interfaz que
espera el cliente y evita que la tienda dependa de los detalles de cada API.

### 3. Flyweight — Simulación de un bosque

Se simulan 20 000 árboles. Los datos que se repiten por especie (textura, color
de las hojas y altura máxima) se almacenan una sola vez en objetos `TreeType`
compartidos. Lo que cambia por árbol (posición y edad) se guarda como estado
extrínseco en objetos `Tree` ligeros. `TreeTypeFactory` mantiene un caché para
reutilizar cada especie.

**Problema que resuelve:** evita duplicar la información de la especie en miles
de objetos y reduce el consumo de memoria. **Por qué Flyweight:** separa el
estado intrínseco compartido del estado extrínseco variable, que es justamente
lo que se repite en este escenario.

### 4. Observer — Seguimiento de estados de un pedido

`OrderService` es el sujeto que notifica los cambios de estado de un pedido
(creado, pagado, enviado, entregado o cancelado). Los observadores son módulos
independientes: correo al cliente, inventario, logística, puntos de fidelidad y
analítica. Cada uno reacciona según el nuevo estado y puede suscribirse o
darse de baja en tiempo de ejecución.

**Problema que resuelve:** evita que el servicio de pedidos conozca y llame
directamente a todos los módulos interesados, lo que generaría un alto
acoplamiento. **Por qué Observer:** establece una relación de uno a muchos con
notificación automática y permite agregar nuevas reacciones sin modificar el
sujeto.

## Estructura del repositorio

```text
.
├── ejercicios/
│   ├── 01-builder.ts
│   ├── 02-adapter.ts
│   ├── 03-flyweight.ts
│   └── 04-observer.ts
├── helpers/
│   ├── colors.ts
│   └── sleep.ts
├── 01-Adapter/          # Ejemplos vistos en clase
├── 01-Builder/
├── 06-Flyweight/
├── 06-Observer/
├── deno.json
└── README.md
```

## Cómo ejecutar

Los ejercicios están escritos en TypeScript para Deno. Desde la raíz del
repositorio:

```bash
deno run ejercicios/01-builder.ts
deno run ejercicios/02-adapter.ts
deno run ejercicios/03-flyweight.ts
deno run ejercicios/04-observer.ts
```

También se pueden ejecutar con las tareas definidas en `deno.json`:

```bash
deno task builder
deno task adapter
deno task flyweight
deno task observer
```

## Notas

- Cada archivo es autónomo y contiene su propia explicación del patrón.
- Los ejemplos usan únicamente la biblioteca estándar de TypeScript/Deno y el
  helper `helpers/colors.ts` para resaltar la salida en consola.
- Los ejercicios son independientes de los ejemplos de clase incluidos en el
  repositorio; se apoyan en ellos como referencia de estilo y complejidad.
