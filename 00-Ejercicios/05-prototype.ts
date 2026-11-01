/**
 * ============================================================================
 * EJERCICIO 5: PATRÓN PROTOTYPE
 * ============================================================================
 *
 * ¿Qué hace el patrón?
 * Prototype es un patrón de diseño creacional que permite crear nuevos objetos
 * clonando una instancia ya existente (el "prototipo"), en lugar de construir
 * cada objeto desde cero. El clon se obtiene del propio objeto mediante un
 * método clone() y luego se personaliza con los cambios necesarios.
 *
 * ¿Qué problema se está resolviendo?
 * En un videojuego se deben generar todo el tiempo nuevos enemigos a partir de
 * plantillas (orcos esbirros, arqueros, jefes). Si cada enemigo se creara con
 * `new` y configurando atributo por atributo, el mismo bloque de configuración
 * se repetiría en decenas de lugares: es costoso de mantener y hace que los
 * datos de las plantillas queden dispersos por todo el código. Además, para
 * el jugador los enemigos son 99 % iguales entre sí: cambiar 2 o 3 valores y
 * conservar el resto es el caso habitual.
 *
 * ¿Por qué Prototype es adecuado?
 * - Las plantillas se configuraron una sola vez y quedan registradas; generar
 *   un enemigo nuevo es tan simple como clonar la plantilla y ajustar lo que
 *   cambia (nivel, nombre, vida).
 * - La clonación copia también las listas internas, por lo que modificar un
 *   clon (por ejemplo, agregándole una habilidad) no altera al prototipo ni a
 *   los demás clones.
 * - El código cliente no necesita conocer la receta completa de cada enemigo:
 *   solo pide una copia y la personaliza.
 * ============================================================================
 */

import { COLORS } from "../helpers/colors.ts";

/**
 * Prototipo: el objeto que se sabe clonar a sí mismo.
 * clone() copia los arreglos manualmente para que el clon no comparta las
 * mismas referencias (copia superficial con datos profundos).
 */
class Enemy {
  name: string;
  level: number;
  health: number;
  attack: number;
  speed: number;
  abilities: string[];
  resistances: string[];

  constructor(
    name: string,
    level: number,
    health: number,
    attack: number,
    speed: number,
    abilities: string[],
    resistances: string[],
  ) {
    this.name = name;
    this.level = level;
    this.health = health;
    this.attack = attack;
    this.speed = speed;
    this.abilities = abilities;
    this.resistances = resistances;
  }

  /** El núcleo del patrón: cada objeto sabe construir su propia copia. */
  clone(): Enemy {
    return new Enemy(
      this.name,
      this.level,
      this.health,
      this.attack,
      this.speed,
      [...this.abilities],
      [...this.resistances],
    );
  }

  showStats(): void {
    console.log(
      `  ${this.name} (nivel ${this.level}) | vida: ${this.health} | ` +
        `ataque: ${this.attack} | velocidad: ${this.speed}`,
    );
    console.log(`  Habilidades: ${this.abilities.join(", ")}`);
    console.log(`  Resistencias: ${this.resistances.join(", ")}`);
  }
}

/**
 * Registro de prototipos: guarda las plantillas ya configuradas y entrega
 * copias listas para personalizar.
 */
class EnemyRegistry {
  private readonly prototypes: Record<string, Enemy> = {};

  register(key: string, prototype: Enemy): void {
    this.prototypes[key] = prototype;
    console.log(
      `%c  [Registro] Prototipo guardado: ${key}`,
      COLORS.green,
    );
  }

  /** Devuelve un clon del prototipo; nunca la instancia original. */
  spawn(key: string, overrides: Partial<Enemy> = {}): Enemy {
    const prototype = this.prototypes[key];

    if (prototype === undefined) {
      throw new Error(`No existe un prototipo registrado con la clave: ${key}`);
    }

    const clone = prototype.clone();
    // Se aplica cada override sobre el clon. En TS puro se accede por
    // índice, por lo que se usa un tipo de escritura genérico.
    const writable = clone as unknown as Record<string, unknown>;

    for (const [keyProperty, value] of Object.entries(overrides)) {
      writable[keyProperty] = value;
    }

    return clone;
  }
}

function main(): void {
  console.log("%c=== PROTOTYPE: GENERADOR DE ENEMIGOS ===", COLORS.cyan);
  const registry = new EnemyRegistry();

  // 1. Las plantillas se crean una sola vez con toda su configuración.
  console.log("\n1. Plantillas base (prototipos):", COLORS.yellow);
  registry.register(
    "orco-esbirro",
    new Enemy(
      "Orco Esbirro",
      1,
      60,
      12,
      4,
      ["Golpe salvaje"],
      ["Fuego débil"],
    ),
  );

  registry.register(
    "arquero-elfo",
    new Enemy(
      "Arquero Elfo",
      3,
      45,
      18,
      9,
      ["Disparo doble", "Esquiva"],
      ["Flechas"],
    ),
  );

  registry.register(
    "jefe-troll",
    new Enemy(
      "Jefe Troll",
      10,
      400,
      45,
      3,
      ["Aplastar", "Regeneración"],
      ["Hielo", "Veneno"],
    ),
  );

  // 2. Se generan enemigos clonando plantillas y ajustando solo lo necesario.
  console.log("\n2. Enemigos generados por clonación:", COLORS.yellow);
  const gruntA = registry.spawn("orco-esbirro");
  const gruntB = registry.spawn("orco-esbirro", { name: "Orco Esbirro B" });
  const eliteGrunt = registry.spawn("orco-esbirro", {
    name: "Orco Élite",
    level: 5,
    health: 130,
    attack: 20,
  });
  const sniper = registry.spawn("arquero-elfo", {
    name: "Arquero Francotirador",
    speed: 12,
  });
  const boss = registry.spawn("jefe-troll", { name: "Gran Troll Vorak" });

  [gruntA, gruntB, eliteGrunt, sniper, boss].forEach((enemy) => {
    enemy.showStats();
    console.log("");
  });

  // 3. Los clones son independientes: cambiar uno no afecta al prototipo.
  console.log("\n3. Independencia entre clones:", COLORS.yellow);
  eliteGrunt.abilities.push("Furia berserker");

  console.log("  Clon modificado (Orco Élite):");
  eliteGrunt.showStats();

  console.log("  Prototipo original (intacto):");
  registry.spawn("orco-esbirro").showStats();
}

main();
