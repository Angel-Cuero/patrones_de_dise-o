export type PatternCategory = 'Creacional' | 'Estructural' | 'Comportamiento';

export interface PatternInfo {
  id: string;
  name: string;
  category: PatternCategory;
  icon: string;
  summary: string;
  problem: string;
  solution: string;
  file: string;
  points: string[];
  code: string;
}

export const CATEGORIES: Array<'Todos' | PatternCategory> = [
  'Todos',
  'Creacional',
  'Estructural',
  'Comportamiento',
];

export const PATTERNS: PatternInfo[] = [
  {
    id: 'builder',
    name: 'Builder',
    category: 'Creacional',
    icon: '🧱',
    summary: 'Construye objetos complejos paso a paso con una interfaz fluida.',
    problem:
      'Un personaje de videojuego tiene nombre, clase, nivel, vida, maná, ataque, defensa, habilidades y equipamiento. Un constructor con tantos parámetros es difícil de leer y permite crear objetos incompletos.',
    solution:
      'CharacterBuilder acumula la configuración con métodos encadenados y valida todo en build(). Un Director reutiliza recetas para crear arquetipos coherentes.',
    file: '01-Patrones-Creacionales/01-Builder/01-builder.ts',
    points: [
      'Evita el constructor telescópico y los errores de orden.',
      'Centraliza la validación antes de entregar el objeto.',
      'Permite reutilizar recetas mediante un Director.',
    ],
    code: `const hero = new CharacterBuilder()
  .setName('Aria')
  .setClass('Guerrero')
  .setStats(150, 30, 25, 20)
  .addSkill('Golpe contundente')
  .build();`,
  },
  {
    id: 'adapter',
    name: 'Adapter',
    category: 'Estructural',
    icon: '🔌',
    summary: 'Convierte APIs incompatibles en una interfaz común para el cliente.',
    problem:
      'FedEx usa libras, millas y dólares; DHL devuelve objetos propios; ServiEntrega usa kilogramos, kilómetros y pesos. La tienda no debería conocer esos detalles.',
    solution:
      'Cada transportadora se envuelve en un adaptador que implementa ShippingProvider y devuelve siempre un ShippingQuote con la misma estructura.',
    file: '02-Patrones-Estructurales/01-Adapter/02-adapter.ts',
    points: [
      'Integra servicios de terceros sin modificar su código.',
      'Aísla unidades y formatos de respuesta distintos.',
      'El comparador trabaja con un único tipo de dato.',
    ],
    code: `interface ShippingProvider {
  quote(weightKg: number, distanceKm: number): ShippingQuote;
}

class FedExAdapter implements ShippingProvider {
  quote(weightKg: number, distanceKm: number) {
    return fedexApi.calculate(weightKg * 2.2, distanceKm * 0.62);
  }
}`,
  },
  {
    id: 'flyweight',
    name: 'Flyweight',
    category: 'Estructural',
    icon: '🌳',
    summary: 'Comparte el estado intrínseco para soportar miles de objetos ligeros.',
    problem:
      'Simular 20 000 árboles con textura, color y altura por especie duplicaría la misma información en cada instancia y dispararía el consumo de memoria.',
    solution:
      'TreeType almacena una sola vez los datos compartidos por especie. Cada árbol guarda únicamente su posición y edad como estado extrínseco.',
    file: '02-Patrones-Estructurales/03-Flyweight/03-flyweight.ts',
    points: [
      'Separa estado intrínseco compartido de estado extrínseco variable.',
      'TreeTypeFactory mantiene un caché de especies.',
      'Reduce drásticamente la memoria en colecciones grandes.',
    ],
    code: `const type = TreeTypeFactory.get('Roble');
const tree = new Tree(x, y, age, type);

// type se comparte entre miles de árboles
// x, y, age son propios de cada instancia`,
  },
  {
    id: 'observer',
    name: 'Observer',
    category: 'Comportamiento',
    icon: '📡',
    summary: 'Notifica automáticamente a múltiples módulos cuando cambia un estado.',
    problem:
      'El servicio de pedidos tendría que conocer y llamar directamente al correo, inventario, logística, fidelidad y analítica cada vez que cambia un pedido.',
    solution:
      'OrderService mantiene una lista de observadores y les notifica el nuevo estado. Cada módulo reacciona por su cuenta y puede suscribirse o darse de baja.',
    file: '03-Patrones-Comportamiento/03-Observer/04-observer.ts',
    points: [
      'Relación de uno a muchos con bajo acoplamiento.',
      'Los observadores se agregan sin modificar el sujeto.',
      'Cada módulo decide cómo reaccionar al evento.',
    ],
    code: `orderService.subscribe(emailObserver);
orderService.subscribe(inventoryObserver);

orderService.changeStatus('Pagado');
// todos los observadores reciben el nuevo estado`,
  },
  {
    id: 'prototype',
    name: 'Prototype',
    category: 'Creacional',
    icon: '🧬',
    summary: 'Crea objetos nuevos clonando plantillas ya configuradas.',
    problem:
      'Configurar cada enemigo desde cero repite la misma información y puede compartir listas mutables entre instancias si no se copian correctamente.',
    solution:
      'EnemyRegistry guarda plantillas y Enemy.clone() devuelve copias independientes, incluyendo habilidades y resistencias, listas para personalizar.',
    file: '01-Patrones-Creacionales/02-Prototype/05-prototype.ts',
    points: [
      'Evita repetir configuraciones complejas.',
      'Cada clon es independiente del prototipo original.',
      'Las plantillas quedan centralizadas en un registro.',
    ],
    code: `const base = registry.get('Orco');
const enemy = base.clone();

enemy.name = 'Orco de élite';
enemy.level += 3;
enemy.skills.push('Furia sangrienta');`,
  },
  {
    id: 'factory',
    name: 'Factory Function',
    category: 'Creacional',
    icon: '🏦',
    summary: 'Centraliza la creación y encapsula el estado mediante closures.',
    problem:
      'Construir cuentas con literales repartidos por el código duplica validaciones y deja el saldo expuesto a escrituras inválidas.',
    solution:
      'createAccount() valida titular y depósito inicial, y devuelve un objeto con métodos. El saldo vive en una closure y solo cambia mediante operaciones controladas.',
    file: '01-Patrones-Creacionales/03-Factory-Function/06-factory-function.ts',
    points: [
      'Una sola puerta de entrada para crear objetos válidos.',
      'El saldo no se puede modificar desde fuera.',
      'Los métodos deposit y withdraw aplican las reglas del dominio.',
    ],
    code: `const account = createAccount('Ana', 100_000);

account.deposit(25_000);
account.withdraw(10_000);

console.log(account.getBalance()); // 115000`,
  },
  {
    id: 'composite',
    name: 'Composite',
    category: 'Estructural',
    icon: '🗂️',
    summary: 'Trata hojas y contenedores con la misma interfaz recursiva.',
    problem:
      'Un explorador de archivos con carpetas dentro de carpetas obligaría al cliente a distinguir tipos y recorrer el árbol manualmente.',
    solution:
      'File y Folder implementan FileSystemComponent. getSize() se resuelve igual en un archivo individual o en un árbol completo.',
    file: '02-Patrones-Estructurales/02-Composite/07-composite.ts',
    points: [
      'Hojas y compuestos comparten la misma interfaz.',
      'Las operaciones recursivas se escriben una sola vez.',
      'Agregar nuevas carpetas no requiere cambiar al cliente.',
    ],
    code: `const root = new Folder('Proyecto');
root.add(new File('README.md', 4));
root.add(new Folder('src').add(new File('app.ts', 12)));

root.getSize(); // recorre todo el árbol`,
  },
  {
    id: 'iterator',
    name: 'Iterator',
    category: 'Comportamiento',
    icon: '🎵',
    summary: 'Recorre una colección sin exponer su estructura interna.',
    problem:
      'Usar índices acopla al cliente al almacenamiento de la lista y hace que dos recorridos simultáneos compartan el mismo cursor.',
    solution:
      'Playlist.createIterator() devuelve un iterador con hasNext() y next(). Cada iterador mantiene su propio cursor sobre la misma colección.',
    file: '03-Patrones-Comportamiento/01-Iterator/08-iterator.ts',
    points: [
      'Desacopla el recorrido de la estructura de datos.',
      'Permite varios recorridos independientes en paralelo.',
      'Cambiar el almacenamiento no afecta al cliente.',
    ],
    code: `const iteratorA = playlist.createIterator();
const iteratorB = playlist.createIterator();

iteratorA.next(); // avanza solo el cursor A
iteratorB.next(); // avanza solo el cursor B`,
  },
  {
    id: 'memento',
    name: 'Memento',
    category: 'Comportamiento',
    icon: '⏪',
    summary: 'Guarda instantáneas inmutables para implementar deshacer.',
    problem:
      'Un Ctrl+Z necesita recuperar estados anteriores sin exponer los campos internos del editor ni permitir que terceros alteren las copias.',
    solution:
      'TextEditor crea instantáneas inmutables y History las almacena en una pila. Deshacer restaura la última instantánea sin acceder al estado privado.',
    file: '03-Patrones-Comportamiento/02-Memento/09-memento.ts',
    points: [
      'El originador controla qué estado se guarda.',
      'El caretaker no puede leer ni modificar las instantáneas.',
      'Deshacer se implementa restaurando la última copia.',
    ],
    code: `const editor = new TextEditor();
const history = new History();

history.save(editor.createSnapshot());
editor.setText('Nuevo contenido');

editor.restore(history.undo());`,
  },
  {
    id: 'state',
    name: 'State',
    category: 'Comportamiento',
    icon: '🎧',
    summary: 'Delega el comportamiento en objetos que representan cada estado.',
    problem:
      'Programar play, pause, next y previous con condicionales por estado produce una maraña de ifs cruzados difícil de extender.',
    solution:
      'MediaPlayer delega en StoppedState, PlayingState o PausedState. Cada estado decide qué ocurre con cada acción y ejecuta las transiciones.',
    file: '03-Patrones-Comportamiento/04-State/10-state.ts',
    points: [
      'Encapsula las reglas de cada modo en una clase propia.',
      'La misma acción tiene efectos distintos según el estado.',
      'Agregar estados nuevos no modifica los existentes.',
    ],
    code: `player.play();   // StoppedState -> PlayingState
player.pause();  // PlayingState -> PausedState
player.play();   // PausedState -> PlayingState
player.next();   // cambia la pista`,
  },
];
