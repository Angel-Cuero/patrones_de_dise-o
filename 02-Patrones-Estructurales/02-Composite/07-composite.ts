/**
 * ============================================================================
 * EJERCICIO 7: PATRÓN COMPOSITE
 * ============================================================================
 *
 * ¿Qué hace el patrón?
 * Composite es un patrón de diseño estructural que permite tratar de la misma
 * manera objetos individuales y composiciones de objetos. Define una interfaz
 * común (el "componente") que implementan tanto las hojas (elementos
 * unitarios) como los contenedores (compuestos), que a su vez pueden contener
 * más componentes y así formar estructuras de árbol.
 *
 * ¿Qué problema se está resolviendo?
 * Se necesita calcular el tamaño total de carpetas de un disco, donde una
 * carpeta contiene archivos y otras carpetas, que a su vez contienen más
 * archivos y carpetas, indefinidamente. Si el cliente tuviera que distinguir
 * entre "archivo" y "carpeta" en cada nivel, necesitaría una recursión
 * distinta y condicionales por tipo: el código se complica con cada nivel de
 * anidamiento nuevo.
 *
 * ¿Por qué Composite es adecuado?
 * - Archivos y carpetas comparten la misma interfaz, así que Folder ni
 *   siquiera sabe si su hijo es un archivo o una subcarpeta: simplemente le
 *   pide el tamaño y suma.
 * - Agregar un nivel más de profundidad no cambia el código cliente: la
 *   recursión del árbol hace el trabajo.
 * - Operaciones como getSize() o print() funcionan igual sobre una hoja a
 *  islada o sobre todo el disco, porque ambas son "componentes".
 * ============================================================================
 */

import { COLORS } from "../../helpers/colors.ts";

/**
 * Componente: interfaz común para hojas y compuestos. Todo componente sabe
 * calcular su tamaño y mostrarse; el cliente no distingue el tipo concreto.
 */
abstract class FileSystemComponent {
  protected readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract getSize(): number;
  abstract print(indent: string): void;

  getName(): string {
    return this.name;
  }
}

/**
 * Hoja: elemento unitario del árbol; su tamaño es el del propio archivo.
 * No tiene hijos y por lo tanto no implementa add().
 */
class File extends FileSystemComponent {
  private readonly sizeBytes: number;

  constructor(name: string, sizeBytes: number) {
    super(name);
    this.sizeBytes = sizeBytes;
  }

  getSize(): number {
    return this.sizeBytes;
  }

  print(indent: string): void {
    console.log(`${indent}📄 ${this.name} (${this.formatSize()})`);
  }

  private formatSize(): string {
    return `${this.sizeBytes.toLocaleString("es-CO")} bytes`;
  }
}

/**
 * Compuesto: contiene otros componentes (archivos o subcarpetas) y delega en
 * ellos. getSize() recursa, print() muestra a sus hijos.
 */
class Folder extends FileSystemComponent {
  private readonly children: FileSystemComponent[] = [];

  /**
   * Recibe y devuelve el componente como FileSystemComponent, de modo que se
   * pueden anidar carpetas dentro de carpetas sin casts ni condicionales.
   */
  add(component: FileSystemComponent): FileSystemComponent {
    this.children.push(component);
    return component;
  }

  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  print(indent: string): void {
    console.log(
      `${indent}📁 ${this.name}/ (${this.formatSize()})`,
    );

    this.children.forEach((child) => child.print(`${indent}  `));
  }

  private formatSize(): string {
    return `${this.getSize().toLocaleString("es-CO")} bytes`;
  }
}

function main(): void {
  console.log("%c=== COMPOSITE: EXPLORADOR DE ARCHIVOS ===", COLORS.cyan);

  // Estructura de árbol: carpetas que contienen archivos y más carpetas.
  const root = new Folder("Disco Local C");

  const documents = new Folder("Documentos");
  documents.add(new File("taller.pdf", 815_000));
  documents.add(new File("notas.txt", 2_400));

  const design = new Folder("Diseño");
  design.add(new File("logo.png", 64_000));
  design.add(new File("banner.jpg", 180_000));

  const projects = new Folder("Proyectos");
  const denoProject = new Folder("patrones");
  denoProject.add(new File("builder.ts", 6_300));
  denoProject.add(new File("observer.ts", 7_100));
  projects.add(denoProject);
  projects.add(new File("todo.md", 1_100));

  root.add(documents);
  root.add(design);
  root.add(projects);
  root.add(new File("setup.exe", 33_500_000));

  // 1. Tamaño de una hoja: funciona con la misma interfaz que una carpeta.
  const logo = new File("logo.png", 64_000);
  console.log("\n1. Tamaño de un archivo individual:", COLORS.yellow);
  console.log(
    `  ${logo.getName()}: ` +
      `${logo.getSize().toLocaleString("es-CO")} bytes`,
  );

  // 2. El mismo método getSize() sobre un árbol entero: total del disco.
  console.log("\n2. Total del disco raíz:", COLORS.yellow);
  console.log(
    `  ${root.getName()}: ` +
      `${root.getSize().toLocaleString("es-CO")} bytes`,
  );

  // 3. Recorrido visual del árbol completo.
  console.log("\n3. Contenido:", COLORS.yellow);
  root.print("");

  // 4. Tamaños por carpeta: la recursión responde sin código extra.
  console.log("\n4. Tamaños por carpeta:", COLORS.yellow);
  [documents, design, denoProject].forEach((folder) => {
    console.log(
      `  ${folder.getName()}: ` +
        `${folder.getSize().toLocaleString("es-CO")} bytes`,
    );
  });
}

main();
