/**
 * ============================================================================
 * EJERCICIO 8: PATRÓN ITERATOR
 * ============================================================================
 *
 * ¿Qué hace el patrón?
 * Iterator es un patrón de diseño de comportamiento que permite recorrer los
 * elementos de una colección sin exponer su estructura interna (arreglo,
 * lista enlazada, mapa, páginas de una API...). El objeto iterador mantiene
 * el "cursor" de posición y ofrece una interfaz uniforme: hasNext() y next().
 *
 * ¿Qué problema se está resolviendo?
 * Un reproductor de música tiene listas de reproducción. Una está guardada
 * como arreglo, otra se carga por páginas de una API y a futuro podrían
 * existir listas con otro almacenamiento. Si la interfaz recorriera el
 * arreglo directamente (índices, length), acoplaría el reproductor al
 * almacenamiento y habría que reescribir el recorrido para cada colección
 * nueva. Se necesita además poder recorrer la misma lista varias veces a la
 * vez (por ejemplo, dos pestañas reproduciendo la misma playlist) sin que un
 * recorrido interfiera con el otro.
 *
 * ¿Por qué Iterator es adecuado?
 * - La playlist expone createIterator(); el cliente solo sabe de hasNext()
 *   y next(), sin conocer el arreglo ni su tamaño.
 * - Se pueden crear varios iteradores independientes sobre la misma lista y
 *   avanzarlos por separado sin que uno afecte al otro.
 * - Si mañana la lista se carga por páginas desde una API, solo cambia el
 *   iterador; el reproductor y el código cliente quedan intactos.
 * ============================================================================
 */

import { COLORS } from "../helpers/colors.ts";

/** Elemento de la colección. */
interface Song {
  title: string;
  artist: string;
  durationSeconds: number;
}

/** Interfaz Iterator genérica: el cliente solo conocerá estos dos métodos. */
interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
}

/** Colección iterable: expone iteradores, no su estructura interna. */
class Playlist {
  private readonly name: string;
  private readonly songs: Song[] = [];

  constructor(name: string) {
    this.name = name;
  }

  add(song: Song): void {
    this.songs.push(song);
  }

  /** Patrón Iterator: un iterador nuevo y privado por cada recorrido. */
  createIterator(): Iterator<Song> {
    let position = 0;

    return {
      hasNext: (): boolean => position < this.songs.length,

      next: (): Song => {
        if (position >= this.songs.length) {
          throw new Error("No hay más canciones en la lista.");
        }

        const song = this.songs[position];
        position++;
        return song;
      },
    };
  }

  getName(): string {
    return this.name;
  }

  size(): number {
    return this.songs.length;
  }
}

/**
 * Cliente: recorre cualquier Playlist con la interfaz uniforme, sin conocer
 * cómo se almacenan las canciones dentro de la lista.
 */
function playAll(playlist: Playlist, label: string): void {
  console.log(`%c  ${label}:`, COLORS.blue);
  const iterator = playlist.createIterator();
  let number = 1;

  while (iterator.hasNext()) {
    const song = iterator.next();
    console.log(
      `    ${number++}. ${song.title} — ${song.artist} ` +
        `(${song.durationSeconds}s)`,
    );
  }
}

function main(): void {
  console.log("%c=== ITERATOR: LISTAS DE REPRODUCCIÓN ===", COLORS.cyan);

  const playlist = new Playlist("Vuelta al mundo");

  playlist.add({
    title: "De Música Ligera",
    artist: "Soda Stereo",
    durationSeconds: 254,
  });
  playlist.add({ title: "Frágil", artist: "Kraken", durationSeconds: 302 });
  playlist.add({
    title: "Devuélveme a mi chica",
    artist: "Hombres G",
    durationSeconds: 228,
  });
  playlist.add({
    title: "Bolero Falaz",
    artist: "Aterciopelados",
    durationSeconds: 271,
  });

  console.log(
    `\n1. Recorrido completo de "${playlist.getName()}" ` +
      `(${playlist.size()} canciones):`,
    COLORS.yellow,
  );
  playAll(playlist, "Recorrido con la interfaz general");

  // 2. Dos iteradores independientes sobre la MISMA colección.
  //    Cada uno mantiene su propio cursor, por lo que ningún recorrido
  //    interfiere con el otro.
  console.log(
    "\n2. Dos recorridos simultáneos e independientes:",
    COLORS.yellow,
  );
  const iteratorA = playlist.createIterator();
  const iteratorB = playlist.createIterator();

  const first = iteratorA.next(); // A avanza a la posición 1
  console.log(`  Iterador A: ${first.title} (${first.artist})`);

  const snapshot = iteratorB.next(); // B sigue empezando desde el inicio
  console.log(`  Iterador B: ${snapshot.title} (${snapshot.artist})`);

  while (iteratorA.hasNext()) {
    const song = iteratorA.next();
    console.log(`  Iterador A: ${song.title} (${song.artist})`);
  }

  console.log("  Iterador A terminó; iterador B sigue en su propia posición.");

  // 3. Mostrar el resto de la lista B (por ejemplo, "reanudar").
  console.log("\n3. Reanudación del iterador B:", COLORS.yellow);
  while (iteratorB.hasNext()) {
    const song = iteratorB.next();
    console.log(`  Iterador B: ${song.title} (${song.artist})`);
  }

  // 4. hasNext() es falso cuando se agota la lista: nunca lanza error.
  console.log("\n4. Control del final del recorrido:", COLORS.yellow);
  console.log(`  ¿Quedan canciones en B?: ${iteratorB.hasNext()}`);
}

main();
