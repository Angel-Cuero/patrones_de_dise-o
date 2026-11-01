# Taller de Patrones de Diseño

Repositorio con la solución del taller de arquitectura de software. Cada
ejercicio implementa un patrón de diseño diferente en un archivo independiente,
con comentarios que explican qué hace el patrón, qué problema resuelve y por
qué es una solución adecuada.

## Integrantes

- Angel Julian Cuero Jiménez
- Jose Alejandro Loaiza Lopéz

## Patrones utilizados

| N.º | Patrón           | Tipo           | Archivo                          |
| --- | ---------------- | -------------- | -------------------------------- |
| 1   | Builder          | Creacional     | `00-Ejercicios/01-builder.ts`       |
| 2   | Adapter          | Estructural    | `00-Ejercicios/02-adapter.ts`       |
| 3   | Flyweight        | Estructural    | `00-Ejercicios/03-flyweight.ts`     |
| 4   | Observer         | Comportamiento | `00-Ejercicios/04-observer.ts`      |
| 5   | Prototype        | Creacional     | `00-Ejercicios/05-prototype.ts`     |
| 6   | Factory Function | Creacional     | `00-Ejercicios/06-factory-function.ts` |
| 7   | Composite        | Estructural    | `00-Ejercicios/07-composite.ts`     |
| 8   | Iterator         | Comportamiento | `00-Ejercicios/08-iterator.ts`      |
| 9   | Memento          | Comportamiento | `00-Ejercicios/09-memento.ts`       |
| 10  | State            | Comportamiento | `00-Ejercicios/10-state.ts`         |

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

### 5. Prototype — Generador de enemigos de videojuego

Los enemigos del juego parten de plantillas ya configuradas (esbirro orco,
arquero elfo, jefe troll) guardadas en un `EnemyRegistry`. Cada enemigo nuevo
se obtiene llamando a `Enemy.clone()`, que copia también sus listas de
habilidades y resistencias, y luego se personaliza por nivel, nombre o
estadísticas.

**Problema que resuelve:** evita repetir la configuración completa de un
enemigo cada vez que se genera uno nuevo, y evita que los datos de las
plantillas queden dispersos por el código. **Por qué Prototype:** los objetos
son casi idénticos entre sí y la personalización afecta pocos atributos;
clonar garantiza además que cada copia es independiente del prototipo original.

### 6. Factory Function — Cuentas de ahorro bancarias

`createAccount()` es una función fábrica que devuelve objetos `Account` ya
validados: titular obligatorio, depósito inicial positivo y saldo privado
encapsulado en una closure. El objeto expuesto solo ofrece operaciones
(`deposit`, `withdraw`, `getBalance`); no existe forma de escribir la
propiedad `balance` desde fuera.

**Problema que resuelve:** evita que los objetos de dominio se construyan con
literales repartidos por el código, donde la validación se duplica y el
estado queda expuesto a escrituras inválidas. **Por qué Factory Function:**
centraliza la creación y el encapsulamiento en una sola función sin
necesidad de clases con setters — es imposible crear una cuenta inválida si
todo pasa por la fábrica.

### 7. Composite — Explorador de archivos

`FileSystemComponent` es la interfaz común para `File` (hoja) y `Folder`
(compuesto, que contiene archivos y más carpetas). Calcular el tamaño de un
archivo o de todo el disco usa el mismo método `getSize()`, que recursa sobre
los hijos de los compuestos.

**Problema que resuelve:** el anidamiento infinito de carpetas dentro de
carpetas obligaría al cliente a distinguir tipos y recursionar a mano.
**Por qué Composite:** uniforma hojas y contenedores bajo una misma interfaz,
de modo que las operaciones (tamaño, impresión) funcionan igual en un
elemento individual que en el árbol completo, y las subcarpetas nuevas no
requieren código adicional en el cliente.

### 8. Iterator — Listas de reproducción

`Playlist` expone `createIterator()`, que devuelve un objeto con la interfaz
uniforme `hasNext()` / `next()` y mantiene su propio cursor. En el ejemplo,
dos iteradores recorren la misma lista de canciones de manera independiente,
sin que el cliente toque el arreglo interno.

**Problema que resuelve:** recorrer la colección con índices acoplaría al
cliente a su almacenamiento interno (arreglo hoy, paginación de API mañana) y
haría que dos recorridos simultáneos pisaran el mismo cursor. **Por qué
Iterator:** desacopla el recorrido de la estructura interna, permite varios
recorridos en paralelo sobre la misma lista y deja abierta la posibilidad de
cambiar el almacenamiento sin tocar el cliente.

### 9. Memento — Editor de texto con deshacer

`TextEditor` (originador) crea instantáneas inmutables (`EditorSnapshot`) de
su contenido privado, y la clase `History` (caretaker) las guarda y devuelve
en una pila. Deshacer consiste en restaurar la última instantánea; el
historial nunca puede leer ni modificar el texto guardado.

**Problema que resuelve:** el Ctrl+Z requiere recuperar estados anteriores
sin exponer los campos internos del editor ni permitir que terceros alteren
las copias. **Por qué Memento:** traslada la responsabilidad de crear y
restaurar el estado al propio originador, mantiene las copias inmutables
frente al resto del programa y hace trivial la implementación de "deshacer".

### 10. State — Reproductor de música

`MediaPlayer` delega en un estado actual (`StoppedState`, `PlayingState`,
`PausedState`) el comportamiento de las mismas operaciones: `play()`,
`pause()`, `next()` y `previous()`. Le dar a "play" inicia la pista si el
reproductor está detenido, pero no reinicia si ya suena música, y "pausa"
solo aplica cuando hay reproducción; el propio estado ejecuta las
transiciones.

**Problema que resuelve:** programar los condicionales por estado en cada
método del reproductor generaría una maraña de `if`s cruzados difícil de
extender. **Por qué State:** encapsula las reglas de cada modo en una clase
propia, hace que una misma acción tenga efectos distintos según el estado y
permite agregar estados nuevos sin modificar los existentes.

## Estructura del repositorio

```text
.
├── 00-Ejercicios/
│   ├── 01-builder.ts
│   ├── 02-adapter.ts
│   ├── 03-flyweight.ts
│   ├── 04-observer.ts
│   ├── 05-prototype.ts
│   ├── 06-factory-function.ts
│   ├── 07-composite.ts
│   ├── 08-iterator.ts
│   ├── 09-memento.ts
│   └── 10-state.ts
├── helpers/
│   ├── colors.ts
│   └── sleep.ts
├── 01-Patrones-Creacionales/
│   ├── 01-Builder/
│   ├── 04-Prototype/
│   └── 07-Factory-Function/
├── 02-Patrones-Estructurales/
│   ├── 01-Adapter/
│   ├── 03-Composite/
│   └── 06-Flyweight/
├── 03-Patrones-Comportamiento/
│   ├── 03-Iterator/
│   ├── 05-Memento/
│   ├── 06-Observer/
│   └── 07-State/
├── deno.json
└── README.md
```

## Cómo ejecutar

Los ejercicios están escritos en TypeScript para Deno. Desde la raíz del
repositorio:

```bash
deno run 00-Ejercicios/01-builder.ts
deno run 00-Ejercicios/02-adapter.ts
deno run 00-Ejercicios/03-flyweight.ts
deno run 00-Ejercicios/04-observer.ts
deno run 00-Ejercicios/05-prototype.ts
deno run 00-Ejercicios/06-factory-function.ts
deno run 00-Ejercicios/07-composite.ts
deno run 00-Ejercicios/08-iterator.ts
deno run 00-Ejercicios/09-memento.ts
deno run 00-Ejercicios/10-state.ts
```

También se pueden ejecutar con las tareas definidas en `deno.json`:

```bash
deno task builder
deno task adapter
deno task flyweight
deno task observer
deno task prototype
deno task factory-function
deno task composite
deno task iterator
deno task memento
deno task state
```

## Notas

- Cada archivo es autónomo y contiene su propia explicación del patrón.
- Los ejemplos usan únicamente la biblioteca estándar de TypeScript/Deno y el
  helper `helpers/colors.ts` para resaltar la salida en consola.
- Carpeta `00-Ejercicios/`: los 10 ejercicios del taller, uno por patrón y con
  su propia `main()` de demostración.
- Carpetas `01-Patrones-Creacionales/`, `02-Patrones-Estructurales/` y
  `03-Patrones-Comportamiento/`: un ejemplo base por cada patrón, que sirve
  como punto de referencia de la implementación mínima del patrón.
- El ejemplo del patrón State es interactivo (`03-Patrones-Comportamiento/
  07-State/state.ts`): solicita opciones por consola. Los ejercicios del
  taller se ejecutan sin interacción del usuario.
- Los ejercicios son independientes de los ejemplos de clase incluidos en el
  repositorio; se apoyan en ellos como referencia de estilo y complejidad.
