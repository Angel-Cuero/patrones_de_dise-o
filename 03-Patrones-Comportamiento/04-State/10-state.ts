/**
 * ============================================================================
 * EJERCICIO 10: PATRÓN STATE
 * ============================================================================
 *
 * ¿Qué hace el patrón?
 * State es un patrón de diseño de comportamiento que permite que un objeto
 * cambie su comportamiento según su estado interno, aparentando haber
 * "cambiado de clase". El contexto delega sus operaciones en un objeto de
 * estado actual, y el propio estado decide cuál es el siguiente.
 *
 * ¿Qué problema se está resolviendo?
 * Un reproductor de música tiene modos de funcionamiento: detenido,
 * reproduciendo y en pausa. El mismo botón debe hacer cosas distintas según
 * el modo: "play" inicia la lista si el reproductor está detenido, pero no
 * debe repetir si ya suena música, y "pausa" solo tiene sentido si hay una
 * pista en reproducción. Si cada operación programara condicionales `if
 * (estoyReproduciendo) ... else if (estoyEnPausa) ...` repartidos por todos
 * los métodos, al agregar un modo nuevo habría que revisar y reescribir
 * todos los condicionales existentes, con riesgo de dejar comportamiento
 * inconsistente.
 *
 * ¿Por qué State es adecuado?
 * - Las reglas de cada modo viven aisladas en su clase: PlayingState decide
 *   qué pasa con "play" y "pausa" cuando suena música; StoppedState decide
 *   lo mismo a partir del estado detenido. Nunca se mezclan.
 * - Las mismas operaciones (play, pause, next, prev) tienen efectos
 *   distintos según el estado, sin condicionales en el contexto: el método
 *   del reproductor es corto y siempre delega.
 * - Agregar un estado nuevo (por ejemplo, "bloqueada la pantalla") solo
 *   requiere una clase nueva conectada en las transiciones correctas; los
 *   estados existentes no se modifican.
 * ============================================================================
 */

import { COLORS } from '../../helpers/colors.ts';

/** Pista de la lista de reproducción del reproductor. */
interface Song {
  title: string;
  artist: string;
}

/** Declaración adelantada: ContextMedia recibe su estado por setters. */
interface PlayerState {
  play(player: MediaPlayer): void;
  pause(player: MediaPlayer): void;
  next(player: MediaPlayer): void;
  previous(player: MediaPlayer): void;
}

/** Contexto: el reproductor. Delega toda operación en su estado actual. */
class MediaPlayer {
  private state: PlayerState;
  private trackIndex = 0;

  constructor(
    private readonly stopped: PlayerState,
    private readonly playing: PlayerState,
    private readonly paused: PlayerState,
    private readonly playlist: Song[],
  ) {
    this.state = stopped;
  }

  setState(state: PlayerState): void {
    this.state = state;
  }

  get stoppedState(): PlayerState {
    return this.stopped;
  }

  get playingState(): PlayerState {
    return this.playing;
  }

  get pausedState(): PlayerState {
    return this.paused;
  }

  getStateName(): string {
    return this.state.constructor.name;
  }

  // Operaciones públicas: cortas, porque la lógica vive en el estado actual.
  play(): void {
    this.state.play(this);
  }

  pause(): void {
    this.state.pause(this);
  }

  next(): void {
    this.state.next(this);
  }

  previous(): void {
    this.state.previous(this);
  }

  /** Pista seleccionada actualmente (índice dentro del rango). */
  currentTrack(): Song {
    return this.playlist[this.trackIndex]!;
  }

  /** Navega la lista en pasos (positivo o negativo), con envolvente circular. */
  advance(steps: number): void {
    const count = this.playlist.length;
    this.trackIndex = (this.trackIndex + steps + count) % count;
  }
}

// ---------------------------------------------------------------------------
// Estados concretos: cada uno encapsula las reglas de un modo de operación.
// ---------------------------------------------------------------------------

class StoppedState implements PlayerState {
  play(player: MediaPlayer): void {
    const track = player.currentTrack();
    console.log(
      `%c  ▶ Reproduciendo: "${track.title}" de ${track.artist}.`,
      COLORS.green,
    );
    player.setState(player.playingState);
  }

  pause(_player: MediaPlayer): void {
    console.log('%c  Nada que pausar: el reproductor está detenido.', COLORS.red);
  }

  next(_player: MediaPlayer): void {
    console.log('%c  Primero presiona play para empezar a escuchar.', COLORS.red);
  }

  previous(_player: MediaPlayer): void {
    console.log('%c  Primero presiona play para empezar a escuchar.', COLORS.red);
  }
}

class PlayingState implements PlayerState {
  /** Ya hay una pista sonando: "play" de nuevo no debe reiniciarla. */
  play(player: MediaPlayer): void {
    const track = player.currentTrack();
    console.log(
      `%c  Ya se está reproduciendo "${track.title}". Usa pausa para detenerla.`,
      COLORS.red,
    );
  }

  pause(player: MediaPlayer): void {
    const track = player.currentTrack();
    console.log(`%c  ⏸ Pausado en "${track.title}".`, COLORS.yellow);
    player.setState(player.pausedState);
  }

  next(player: MediaPlayer): void {
    player.advance(1);
    const track = player.currentTrack();
    console.log(
      `%c  ⏭ Siguiente pista: "${track.title}" de ${track.artist}.`,
      COLORS.cyan,
    );
  }

  previous(player: MediaPlayer): void {
    player.advance(-1);
    const track = player.currentTrack();
    console.log(
      `%c  ⏮ Pista anterior: "${track.title}" de ${track.artist}.`,
      COLORS.cyan,
    );
  }
}

class PausedState implements PlayerState {
  /** La reproducción se recupera desde el minuto en que quedó. */
  play(player: MediaPlayer): void {
    const track = player.currentTrack();
    console.log(`%c  ▶ Reanudado: "${track.title}".`, COLORS.green);
    player.setState(player.playingState);
  }

  pause(_player: MediaPlayer): void {
    console.log('%c  Ya está en pausa: reanuda con play.', COLORS.red);
  }

  next(player: MediaPlayer): void {
    player.advance(1);
    const track = player.currentTrack();
    console.log(
      `%c  ⏭ Pista cambiada en pausa: "${track.title}" (pausada al inicio).`,
      COLORS.cyan,
    );
  }

  previous(player: MediaPlayer): void {
    player.advance(-1);
    const track = player.currentTrack();
    console.log(
      `%c  ⏮ Pista cambiada en pausa: "${track.title}" (pausada al inicio).`,
      COLORS.cyan,
    );
  }
}

function main(): void {
  console.log('%c=== STATE: REPRODUCTOR DE MÚSICA ===', COLORS.cyan);

  // Instancias de estados compartidas: representan "modos", no objetos con
  // datos propios de la canción.
  const stopped = new StoppedState();
  const playing = new PlayingState();
  const paused = new PausedState();

  const player = new MediaPlayer(
    stopped,
    playing,
    paused,
    [
      { title: 'De Música Ligera', artist: 'Soda Stereo' },
      { title: 'Bolero Falaz', artist: 'Aterciopelados' },
      { title: 'Devuélveme a mi chica', artist: 'Hombres G' },
    ],
  );

  // 1. Con el reproductor detenido, pausa y cambio de pista no hacen nada.
  console.log('\n1. Modo detenido (estado inicial):', COLORS.yellow);
  player.pause();
  player.next();

  // 2. Play inicia la reproducción y cambia al modo "reproduciendo".
  console.log('\n2. Play -> modo reproduciendo:', COLORS.yellow);
  player.play();

  // 3. En reproducción: play de nuevo es repetitivo, pausa sí aplica.
  console.log('\n3. Acciones en modo reproduciendo:', COLORS.yellow);
  player.play();
  player.pause();

  // 4. En pausa: se reanuda la pista y se navega entre canciones.
  console.log('\n4. Acciones en pausa:', COLORS.yellow);
  player.next(); // Cambia de pista sin salir del modo pausa.
  player.play();
  player.previous(); // Vuelve a la pista anterior siguiendo sonando.

  // 5. El contexto nunca cambió de clase, pero cada operación se condujo
  //    distinto según el estado interno.
  console.log('\n5. Resultado:', COLORS.green);
  const track = player.currentTrack();
  console.log(`  Pista actual: "${track.title}" de ${track.artist}`);
}

main();
