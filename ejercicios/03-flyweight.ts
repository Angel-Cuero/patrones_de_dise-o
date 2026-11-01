/**
 * ============================================================================
 * EJERCICIO 3: PATRÓN FLYWEIGHT
 * ============================================================================
 *
 * ¿Qué hace el patrón?
 * Flyweight es un patrón de diseño estructural que permite soportar grandes
 * cantidades de objetos compartiendo entre ellos la información que se repite.
 * La parte compartida se llama estado intrínseco y vive en un objeto ligero
 * (flyweight); la parte que cambia por cada objeto se llama estado extrínseco
 * y se pasa desde fuera cuando se necesita.
 *
 * ¿Qué problema se está resolviendo?
 * Se quiere simular un bosque con 20 000 árboles. Cada árbol tiene datos que
 * se repiten: especie, textura, color de las hojas y altura máxima. Si cada
 * árbol guardara su propia copia de esos datos, se crearían 20 000 objetos de
 * tipo con la misma información, desperdiciando memoria. Lo único que cambia
 * de un árbol a otro es su posición (x, y) y su edad.
 *
 * ¿Por qué Flyweight es adecuado?
 * - La información de la especie es idéntica para muchos árboles: es el
 *   candidato perfecto para compartirse como estado intrínseco.
 * - La posición y la edad son distintos en cada árbol: se mantienen como
 *   estado extrínseco en objetos ligeros.
 * - Una fábrica garantiza que exista una sola instancia por especie. En este
 *   ejemplo se crean 5 tipos compartidos para 20 000 árboles, en lugar de
 *   20 000 copias de los datos de la especie.
 * - El cliente sigue trabajando con objetos "árbol" normales; el ahorro de
 *   memoria es transparente.
 * ============================================================================
 */

import { COLORS } from '../helpers/colors.ts';

/**
 * Estado intrínseco compartido: datos de una especie de árbol.
 * Estos valores no cambian entre árboles de la misma especie.
 */
interface TreeSpeciesData {
  species: string;
  texture: string;
  foliageColor: string;
  maxHeightMeters: number;
}

/**
 * Flyweight: objeto inmutable que contiene el estado intrínseco.
 * No guarda la posición ni la edad, porque esos datos varían por árbol.
 */
class TreeType {
  private readonly species: string;
  private readonly texture: string;
  private readonly foliageColor: string;
  private readonly maxHeightMeters: number;

  constructor(data: TreeSpeciesData) {
    this.species = data.species;
    this.texture = data.texture;
    this.foliageColor = data.foliageColor;
    this.maxHeightMeters = data.maxHeightMeters;
  }

  getSpecies(): string {
    return this.species;
  }

  /**
   * Recibe el estado extrínseco (posición y edad) para poder dibujar el
   * árbol sin almacenarlo dentro del flyweight.
   */
  render(x: number, y: number, ageYears: number): string {
    return (
      `  ${this.species} en (${x}, ${y}) | edad: ${ageYears} años | ` +
      `textura: ${this.texture} | hojas: ${this.foliageColor} | ` +
      `altura máx.: ${this.maxHeightMeters} m`
    );
  }
}

/** Catálogo de especies disponibles. */
const TREE_CATALOG: Record<string, TreeSpeciesData> = {
  Roble: {
    species: 'Roble',
    texture: 'roble.png',
    foliageColor: 'verde oscuro',
    maxHeightMeters: 25,
  },
  Pino: {
    species: 'Pino',
    texture: 'pino.png',
    foliageColor: 'verde claro',
    maxHeightMeters: 30,
  },
  Ceiba: {
    species: 'Ceiba',
    texture: 'ceiba.png',
    foliageColor: 'verde amarillento',
    maxHeightMeters: 40,
  },
  Acacia: {
    species: 'Acacia',
    texture: 'acacia.png',
    foliageColor: 'verde oliva',
    maxHeightMeters: 15,
  },
  Cerezo: {
    species: 'Cerezo',
    texture: 'cerezo.png',
    foliageColor: 'rosa',
    maxHeightMeters: 12,
  },
};

/**
 * Fábrica de flyweights: mantiene un caché por especie. Si el tipo ya existe
 * lo reutiliza; si no, lo crea una sola vez.
 */
class TreeTypeFactory {
  private readonly cache: Record<string, TreeType> = {};
  private createdTypes = 0;

  getTreeType(species: string): TreeType {
    const data = TREE_CATALOG[species];

    if (data === undefined) {
      throw new Error(`Especie no registrada: ${species}`);
    }

    if (this.cache[species] === undefined) {
      this.cache[species] = new TreeType(data);
      this.createdTypes++;
      console.log(
        `%c  [Flyweight] Instancia compartida creada: ${species}`,
        COLORS.red,
      );
    }

    return this.cache[species];
  }

  getCreatedTypeCount(): number {
    return this.createdTypes;
  }
}

/**
 * Objeto ligero: contiene solo el estado extrínseco (posición y edad) y una
 * referencia al flyweight compartido.
 */
class Tree {
  private readonly x: number;
  private readonly y: number;
  private readonly ageYears: number;
  private readonly type: TreeType;

  constructor(x: number, y: number, ageYears: number, type: TreeType) {
    this.x = x;
    this.y = y;
    this.ageYears = ageYears;
    this.type = type;
  }

  draw(): void {
    console.log(this.type.render(this.x, this.y, this.ageYears));
  }
}

class Forest {
  private readonly trees: Tree[] = [];
  private readonly factory: TreeTypeFactory;

  constructor(factory: TreeTypeFactory) {
    this.factory = factory;
  }

  /**
   * Generador pseudoaleatorio determinista: permite repetir el mismo bosque
   * en cada ejecución y comparar resultados.
   */
  private createRandom(seedValue: number): () => number {
    let seed = seedValue;

    return (): number => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  plant(count: number): void {
    const speciesNames = Object.keys(TREE_CATALOG);
    const random = this.createRandom(2026);

    for (let i = 0; i < count; i++) {
      const species = speciesNames[Math.floor(random() * speciesNames.length)];
      const x = Math.floor(random() * 10_000);
      const y = Math.floor(random() * 10_000);
      const ageYears = 1 + Math.floor(random() * 200);
      const treeType = this.factory.getTreeType(species);

      this.trees.push(new Tree(x, y, ageYears, treeType));
    }
  }

  printSample(limit: number): void {
    this.trees.slice(0, limit).forEach((tree) => tree.draw());
  }

  getTreeCount(): number {
    return this.trees.length;
  }
}

function main(): void {
  console.log('%c=== FLYWEIGHT: SIMULACIÓN DE UN BOSQUE ===', COLORS.cyan);

  const factory = new TreeTypeFactory();
  const forest = new Forest(factory);
  const totalTrees = 20_000;

  console.log(
    `%c\nPlantando ${totalTrees.toLocaleString('es-CO')} árboles...`,
    COLORS.yellow,
  );
  forest.plant(totalTrees);

  console.log('%c\nPrimeros 5 árboles del bosque:', COLORS.yellow);
  forest.printSample(5);

  const createdTypes = factory.getCreatedTypeCount();
  const treeCount = forest.getTreeCount();

  // Estimación didáctica: el estado intrínseco pesa aproximadamente 250 bytes
  // y cada árbol ligero (referencia + números) unos 64 bytes. No es una
  // medición exacta de memoria, pero permite dimensionar el ahorro.
  const intrinsicBytes = 250;
  const lightweightTreeBytes = 64;
  const naiveBytes = treeCount * (intrinsicBytes + lightweightTreeBytes);
  const flyweightBytes = createdTypes * intrinsicBytes +
    treeCount * lightweightTreeBytes;

  console.log('%c\nResumen:', COLORS.green);
  console.log(`  Árboles creados: ${treeCount.toLocaleString('es-CO')}`);
  console.log(`  Tipos de árbol compartidos: ${createdTypes}`);
  console.log(
    `  Sin Flyweight (estimado): ${naiveBytes.toLocaleString('es-CO')} bytes`,
  );
  console.log(
    `  Con Flyweight (estimado): ${flyweightBytes.toLocaleString('es-CO')} bytes`,
  );
  console.log(
    `%c  Memoria aproximada ahorrada: ` +
      `${(naiveBytes - flyweightBytes).toLocaleString('es-CO')} bytes`,
    COLORS.purple,
  );
}

main();
