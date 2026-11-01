/**
 * ============================================================================
 * EJERCICIO 1: PATRÓN BUILDER
 * ============================================================================
 *
 * ¿Qué hace el patrón?
 * Builder es un patrón de diseño creacional que permite construir objetos
 * complejos paso a paso. En lugar de recibir todos los datos en un constructor
 * gigante, el cliente llama a métodos encadenados que van configurando cada
 * parte del objeto y, al final, solicita el resultado con build().
 *
 * ¿Qué problema se está resolviendo?
 * En un videojuego RPG los personajes tienen muchos atributos: nombre, clase,
 * nivel, vida, maná, ataque, defensa, habilidades y equipamiento. Si se usara
 * un constructor tradicional, este tendría demasiados parámetros, la mayoría
 * opcionales, y sería fácil equivocarse en el orden de los argumentos. Además,
 * se podrían crear personajes incompletos o con combinaciones inválidas, y
 * los arquetipos que se repiten (guerrero, mago, arquero) tendrían que
 * configurarse manualmente una y otra vez.
 *
 * ¿Por qué Builder es adecuado?
 * - Permite construir el personaje por pasos y con nombres de métodos claros,
 *   evitando el "constructor telescópico" y los errores de posición.
 * - Centraliza la validación en build(), por lo que nunca se obtiene un
 *   personaje inválido.
 * - Permite reutilizar configuraciones mediante un Director, que encapsula
 *   los arquetipos comunes sin duplicar código en el cliente.
 * - El proceso de construcción queda separado de la representación final.
 * ============================================================================
 */

import { COLORS } from '../helpers/colors.ts';

type CharacterClass = 'Guerrero' | 'Mago' | 'Arquero';

/**
 * Producto: el objeto complejo que se quiere construir.
 * Una vez creado, sus datos no deberían cambiar desde fuera.
 */
class Character {
  private readonly name: string;
  private readonly characterClass: CharacterClass;
  private readonly level: number;
  private readonly health: number;
  private readonly mana: number;
  private readonly attack: number;
  private readonly defense: number;
  private readonly skills: string[];
  private readonly equipment: string[];

  constructor(
    name: string,
    characterClass: CharacterClass,
    level: number,
    health: number,
    mana: number,
    attack: number,
    defense: number,
    skills: string[],
    equipment: string[],
  ) {
    this.name = name;
    this.characterClass = characterClass;
    this.level = level;
    this.health = health;
    this.mana = mana;
    this.attack = attack;
    this.defense = defense;
    this.skills = skills;
    this.equipment = equipment;
  }

  showSheet(): void {
    const skills = this.skills.length > 0 ? this.skills.join(', ') : 'Ninguna';
    const equipment =
      this.equipment.length > 0 ? this.equipment.join(', ') : 'Ninguno';

    console.log(
      `%cFicha de ${this.name} (${this.characterClass}, nivel ${this.level})`,
      COLORS.green,
    );
    console.log(`  Vida: ${this.health} | Maná: ${this.mana}`);
    console.log(`  Ataque: ${this.attack} | Defensa: ${this.defense}`);
    console.log(`  Habilidades: ${skills}`);
    console.log(`  Equipamiento: ${equipment}`);
  }
}

/**
 * Builder concreto: acumula la configuración y construye el producto final.
 * Cada método retorna this para permitir el encadenamiento (fluent interface).
 */
class CharacterBuilder {
  private name = '';
  private characterClass: CharacterClass | null = null;
  private level = 1;
  private health = 100;
  private mana = 50;
  private attack = 10;
  private defense = 10;
  private skills: string[] = [];
  private equipment: string[] = [];

  setName(name: string): CharacterBuilder {
    this.name = name.trim();
    return this;
  }

  setClass(characterClass: CharacterClass): CharacterBuilder {
    this.characterClass = characterClass;
    return this;
  }

  setLevel(level: number): CharacterBuilder {
    this.level = level;
    return this;
  }

  setStats(
    health: number,
    mana: number,
    attack: number,
    defense: number,
  ): CharacterBuilder {
    this.health = health;
    this.mana = mana;
    this.attack = attack;
    this.defense = defense;
    return this;
  }

  addSkill(skill: string): CharacterBuilder {
    const cleanSkill = skill.trim();
    if (cleanSkill.length > 0 && !this.skills.includes(cleanSkill)) {
      this.skills.push(cleanSkill);
    }
    return this;
  }

  addEquipment(item: string): CharacterBuilder {
    const cleanItem = item.trim();
    if (cleanItem.length > 0 && !this.equipment.includes(cleanItem)) {
      this.equipment.push(cleanItem);
    }
    return this;
  }

  /**
   * Construye el personaje solo si cumple las reglas mínimas.
   * Así se evita entregar al resto del programa un objeto inconsistente.
   */
  build(): Character {
    this.validate();

    return new Character(
      this.name,
      this.characterClass as CharacterClass,
      this.level,
      this.health,
      this.mana,
      this.attack,
      this.defense,
      [...this.skills],
      [...this.equipment],
    );
  }

  private validate(): void {
    if (this.name.length === 0) {
      throw new Error('El personaje debe tener un nombre.');
    }

    if (this.characterClass === null) {
      throw new Error('El personaje debe tener una clase.');
    }

    if (this.level < 1) {
      throw new Error('El nivel del personaje debe ser mayor o igual a 1.');
    }

    if (this.health <= 0 || this.mana < 0) {
      throw new Error('La vida debe ser positiva y el maná no puede ser negativo.');
    }

    if (this.attack <= 0 || this.defense <= 0) {
      throw new Error('El ataque y la defensa deben ser mayores que cero.');
    }
  }
}

/**
 * Director: conoce recetas de construcción y reutiliza el Builder para
 * crear arquetipos coherentes sin exponer los detalles al cliente.
 */
class CharacterDirector {
  createWarrior(name: string): Character {
    return new CharacterBuilder()
      .setName(name)
      .setClass('Guerrero')
      .setLevel(1)
      .setStats(150, 30, 25, 20)
      .addSkill('Golpe contundente')
      .addSkill('Grito de guerra')
      .addEquipment('Espada de hierro')
      .addEquipment('Escudo de madera')
      .build();
  }

  createMage(name: string): Character {
    return new CharacterBuilder()
      .setName(name)
      .setClass('Mago')
      .setLevel(1)
      .setStats(90, 180, 12, 8)
      .addSkill('Bola de fuego')
      .addSkill('Escudo arcano')
      .addEquipment('Bastón de cristal')
      .addEquipment('Túnica azul')
      .build();
  }

  createArcher(name: string): Character {
    return new CharacterBuilder()
      .setName(name)
      .setClass('Arquero')
      .setLevel(1)
      .setStats(110, 70, 20, 12)
      .addSkill('Disparo certero')
      .addSkill('Lluvia de flechas')
      .addEquipment('Arco largo')
      .addEquipment('Carcaj de cuero')
      .build();
  }
}

function main(): void {
  console.log('%c=== BUILDER: CREADOR DE PERSONAJES ===', COLORS.cyan);
  const director = new CharacterDirector();

  console.log('%c\n1. Arquetipos creados por el Director', COLORS.yellow);
  const warrior = director.createWarrior('Aria');
  const mage = director.createMage('Elián');
  const archer = director.createArcher('Nara');

  warrior.showSheet();
  mage.showSheet();
  archer.showSheet();

  console.log('%c\n2. Personaje personalizado con el Builder', COLORS.yellow);
  const customCharacter = new CharacterBuilder()
    .setName('Kael')
    .setClass('Guerrero')
    .setLevel(12)
    .setStats(240, 60, 48, 35)
    .addSkill('Torbellino')
    .addSkill('Golpe contundente')
    .addSkill('Piel de piedra')
    .addEquipment('Hacha de dos manos')
    .addEquipment('Armadura de acero')
    .build();

  customCharacter.showSheet();

  console.log('%c\n3. Validación antes de construir', COLORS.yellow);
  try {
    // Se intenta construir un personaje sin nombre ni clase.
    new CharacterBuilder().setLevel(5).build();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`%c  Construcción rechazada: ${message}`, COLORS.red);
  }
}

main();
