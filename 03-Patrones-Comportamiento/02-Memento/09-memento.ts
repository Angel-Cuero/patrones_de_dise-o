/**
 * ============================================================================
 * EJERCICIO 9: PATRÓN MEMENTO
 * ============================================================================
 *
 * ¿Qué hace el patrón?
 * Memento es un patrón de diseño de comportamiento que permite guardar y
 * restaurar el estado previo de un objeto sin violar su encapsulamiento. El
 * objeto "originador" crea una instantánea (el memento) de su estado, y un
 * tercero neutral, el "caretaker", la almacena. El caretaker nunca mira el
 * contenido de la instantánea: solo la guarda y la devuelve.
 *
 * ¿Qué problema se está resolviendo?
 * Un editor de texto debe ofrecer "deshacer" (Ctrl+Z). Si el historial
 * guardara el estado exponiendo los campos internos del editor (por ejemplo,
 * con getters y setters para todo), cualquier módulo podría alterar el
 * contenido del documento directamente y el editor quedaría desprotegido.
 * Además, las copias de seguridad deben ser inmutables: si alguien cambiara
 * una entrada del historial, se corrompería la función de deshacer.
 *
 * ¿Por qué Memento es adecuado?
 * - El estado del documento vive dentro de TextEditor; la instantánea se
 *   crea y se restaura solo por métodos del propio editor, sin exponer el
 *   campo privado.
 * - El historial (caretaker) guarda mementos "opacos": conoce cuándo fue
 *   tomada cada copia, pero no puede leer ni modificar el texto guardado.
 * - Deshacer es trivialmente correcto: restaurar la última instantánea
 *   devuelve de forma fiable el estado exacto de ese momento.
 * ============================================================================
 */

import { COLORS } from "../../helpers/colors.ts";

/**
 * Memento: instantánea inmutable del estado del editor. Sus datos solo son
 * accesibles para el originador, que los declaró en la misma clase.
 */
class EditorSnapshot {
  /** El contenido es privado: el caretaker guarda la copia sin poder leerla. */
  private readonly content: string;
  readonly savedAt: Date;

  constructor(content: string) {
    this.content = content;
    this.savedAt = new Date();
  }

  /** Solo el originador (TextEditor) debería llamar a este método. */
  restoreContent(): string {
    return this.content;
  }

  time(): string {
    return this.savedAt.toLocaleTimeString("es-CO");
  }
}

/**
 * Originador: dueño del estado. Sabe crearse instantáneas y restaurarse
 * desde ellas, sin exponer el campo content a nadie más.
 */
class TextEditor {
  private content = "";

  /** Escribe (o borra) texto: cada cambio deja el estado listo para copiarse. */
  type(text: string): void {
    this.content += text;
  }

  clear(): void {
    this.content = "";
  }

  currentContent(): string {
    return this.content;
  }

  /** Crea el memento con el estado actual. */
  save(): EditorSnapshot {
    return new EditorSnapshot(this.content);
  }

  /** Restaura el estado desde un memento previamente creado. */
  restore(snapshot: EditorSnapshot): void {
    this.content = snapshot.restoreContent();
  }
}

/**
 * Caretaker: guarda los mementos sin conocer su contenido. Aquí se usa una
 * pila para que "deshacer" recupere el estado más reciente.
 */
class History {
  private readonly snapshots: EditorSnapshot[] = [];

  push(snapshot: EditorSnapshot): void {
    this.snapshots.push(snapshot);
    console.log(
      `%c  [Historial] Copia guardada a las ${snapshot.time()} ` +
        `(total: ${this.snapshots.length})`,
      COLORS.green,
    );
  }

  pop(): EditorSnapshot {
    const snapshot = this.snapshots.pop();

    if (snapshot === undefined) {
      throw new Error("No hay estados guardados para deshacer.");
    }

    return snapshot;
  }

  size(): number {
    return this.snapshots.length;
  }
}

function main(): void {
  console.log("%c=== MEMENTO: EDITOR CON DESHACER ===", COLORS.cyan);

  const editor = new TextEditor();
  const history = new History();

  // 1. El usuario escribe y guarda puntos de control en el historial.
  console.log("\n1. Edición del documento:", COLORS.yellow);
  editor.type("Título: Taller de patrones\n");
  history.push(editor.save());

  editor.type("Introducción: este es el párrafo dos.\n");
  history.push(editor.save());

  // La errata NO se guarda en el historial: por eso el primer "deshacer"
  // puede eliminarla, y el segundo además la introducción.
  editor.type('Párrafo tres con una errata "calbe".\n');

  console.log(`  Documento actual:\n${indent(editor.currentContent())}`);

  // 2. Deshacer: restaurar la última instantánea de la pila.
  console.log("\n2. Deshacer (Ctrl+Z):", COLORS.yellow);
  editor.restore(history.pop());
  console.log(`  Tras deshacer:\n${indent(editor.currentContent())}`);

  // 3. Varios deshacer seguidos: se recorre la pila hacia atrás.
  console.log("\n3. Deshacer repetidamente:", COLORS.yellow);
  editor.restore(history.pop());
  console.log(`  Segundo deshacer:\n${indent(editor.currentContent())}`);

  // 4. Se sigue editando desde el estado restaurado y se vuelve a guardar.
  console.log("\n4. Nueva edición sobre el estado restaurado:", COLORS.yellow);
  editor.type("Conclusión: la errata quedó atrás, texto corregido.\n");
  history.push(editor.save());
  console.log(`  Documento final:\n${indent(editor.currentContent())}`);

  // 5. Intentar deshacer sin estados disponibles es un error controlado.
  console.log("\n5. Historial agotado:", COLORS.yellow);
  while (history.size() > 0) {
    editor.restore(history.pop());
  }

  try {
    history.pop();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`%c  ${message}`, COLORS.red);
  }
}

/** Indenta el contenido para que la salida sea legible en consola. */
function indent(text: string): string {
  return text
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => `    | ${line}`)
    .join("\n");
}

main();
