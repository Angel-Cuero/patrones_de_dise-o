import { Component, computed, signal } from '@angular/core';
import {
  CATEGORIES,
  PATTERNS,
  PatternCategory,
  PatternInfo,
} from './data/patterns.data';

type Filter = 'Todos' | PatternCategory;
type CharacterClass = 'Guerrero' | 'Mago' | 'Arquero';

interface Character {
  name: string;
  characterClass: CharacterClass;
  level: number;
  health: number;
  mana: number;
  attack: number;
  defense: number;
  skills: string[];
  equipment: string[];
}

interface Enemy {
  id: number;
  name: string;
  level: number;
  template: string;
  skills: string[];
}

interface AccountState {
  name: string;
  balance: number;
  movements: string[];
}

interface FsNode {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  children?: FsNode[];
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly patterns = PATTERNS;
  protected readonly categories = CATEGORIES;
  protected readonly activeCategory = signal<Filter>('Todos');
  protected readonly selectedId = signal('builder');
  protected readonly currentYear = new Date().getFullYear();

  protected readonly filteredPatterns = computed(() => {
    const category = this.activeCategory();
    return category === 'Todos'
      ? this.patterns
      : this.patterns.filter((pattern) => pattern.category === category);
  });

  protected readonly selectedPattern = computed(
    () => this.patterns.find((pattern) => pattern.id === this.selectedId()) ?? this.patterns[0],
  );

  protected readonly categoryCount = computed(() => ({
    Creacional: this.patterns.filter((pattern) => pattern.category === 'Creacional').length,
    Estructural: this.patterns.filter((pattern) => pattern.category === 'Estructural').length,
    Comportamiento: this.patterns.filter((pattern) => pattern.category === 'Comportamiento').length,
  }));

  protected selectPattern(pattern: PatternInfo): void {
    this.selectedId.set(pattern.id);
  }

  protected setCategory(category: Filter): void {
    this.activeCategory.set(category);
  }

  protected trackById(_: number, pattern: PatternInfo): string {
    return pattern.id;
  }

  /* ------------------------------------------------------------------ */
  /* Builder                                                            */
  /* ------------------------------------------------------------------ */
  protected builderName = 'Aria';
  protected builderClass: CharacterClass = 'Guerrero';
  protected builderLevel = 12;
  protected builderResult: Character | null = null;

  protected createCharacter(): void {
    const presets: Record<CharacterClass, Omit<Character, 'name' | 'characterClass' | 'level'>> = {
      Guerrero: {
        health: 150,
        mana: 30,
        attack: 25,
        defense: 20,
        skills: ['Golpe contundente', 'Grito de guerra'],
        equipment: ['Espada de hierro', 'Escudo de madera'],
      },
      Mago: {
        health: 90,
        mana: 180,
        attack: 12,
        defense: 8,
        skills: ['Bola de fuego', 'Escudo arcano'],
        equipment: ['Bastón de cristal', 'Túnica azul'],
      },
      Arquero: {
        health: 110,
        mana: 70,
        attack: 20,
        defense: 12,
        skills: ['Disparo certero', 'Lluvia de flechas'],
        equipment: ['Arco largo', 'Carcaj de cuero'],
      },
    };

    const name = this.builderName.trim();
    if (!name || this.builderLevel < 1) {
      this.builderResult = null;
      return;
    }

    const preset = presets[this.builderClass];
    const multiplier = 1 + (this.builderLevel - 1) * 0.08;

    this.builderResult = {
      name,
      characterClass: this.builderClass,
      level: this.builderLevel,
      health: Math.round(preset.health * multiplier),
      mana: Math.round(preset.mana * multiplier),
      attack: Math.round(preset.attack * multiplier),
      defense: Math.round(preset.defense * multiplier),
      skills: [...preset.skills],
      equipment: [...preset.equipment],
    };
  }

  /* ------------------------------------------------------------------ */
  /* Adapter                                                            */
  /* ------------------------------------------------------------------ */
  protected adapterProvider: 'FedEx' | 'DHL' | 'ServiEntrega' = 'FedEx';
  protected adapterWeight = 5;
  protected adapterDistance = 120;

  protected get adapterQuote(): { provider: string; total: number; detail: string } {
    const weight = Math.max(0.1, this.adapterWeight);
    const distance = Math.max(1, this.adapterDistance);

    if (this.adapterProvider === 'FedEx') {
      const usd = 4.5 + weight * 2.2 * 1.8 + distance * 0.62 * 0.9;
      return {
        provider: 'FedEx',
        total: Math.round(usd * 4000),
        detail: `${weight} kg → ${(weight * 2.2).toFixed(1)} lb · ${distance} km → ${(distance * 0.62).toFixed(0)} mi · USD ${usd.toFixed(2)}`,
      };
    }

    if (this.adapterProvider === 'DHL') {
      const eur = 6 + weight * 1.4 + distance * 0.004;
      return {
        provider: 'DHL Express',
        total: Math.round(eur * 4300),
        detail: `Objeto DHL convertido por el adaptador · EUR ${eur.toFixed(2)}`,
      };
    }

    const cop = 8000 + weight * 2500 + distance * 800;
    return {
      provider: 'ServiEntrega',
      total: Math.round(cop),
      detail: `${weight} kg · ${distance} km · COP ${cop.toLocaleString('es-CO')}`,
    };
  }

  protected readonly cop = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  /* ------------------------------------------------------------------ */
  /* Flyweight                                                          */
  /* ------------------------------------------------------------------ */
  protected treeCount = 20000;

  protected get flyweightStats(): {
    fullKb: number;
    lightKb: number;
    savedKb: number;
    savedPercent: number;
  } {
    const fullBytes = this.treeCount * 112;
    const lightBytes = this.treeCount * 24 + 10 * 112;
    const savedBytes = fullBytes - lightBytes;

    return {
      fullKb: Math.round(fullBytes / 1024),
      lightKb: Math.round(lightBytes / 1024),
      savedKb: Math.round(savedBytes / 1024),
      savedPercent: Math.round((savedBytes / fullBytes) * 100),
    };
  }

  /* ------------------------------------------------------------------ */
  /* Observer                                                           */
  /* ------------------------------------------------------------------ */
  protected readonly observers = [
    { name: 'Correo al cliente', icon: '✉️' },
    { name: 'Inventario', icon: '📦' },
    { name: 'Logística', icon: '🚚' },
    { name: 'Puntos de fidelidad', icon: '⭐' },
    { name: 'Analítica', icon: '📊' },
  ];

  protected orderStatus = 'Creado';
  protected observerLog: string[] = [];
  protected readonly orderStates = ['Creado', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'];

  protected changeOrderStatus(status: string): void {
    this.orderStatus = status;
    this.observerLog = this.observers.map((observer) => {
      const messages: Record<string, string> = {
        Creado: 'se registró el pedido y se reservó el inventario',
        Pagado: 'se confirmó el pago y se generó la factura',
        Enviado: 'se asignó la guía y se actualizó la ruta',
        Entregado: 'se notificó al cliente y se sumaron puntos',
        Cancelado: 'se liberó el inventario y se revirtió el pago',
      };
      return `${observer.icon} ${observer.name}: ${messages[status]}`;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Prototype                                                          */
  /* ------------------------------------------------------------------ */
  protected readonly enemyTemplates = [
    {
      name: 'Orco',
      level: 1,
      skills: ['Golpe bruto', 'Piel dura'],
    },
    {
      name: 'Arquero élfico',
      level: 2,
      skills: ['Disparo certero', 'Paso ligero'],
    },
    {
      name: 'Jefe troll',
      level: 5,
      skills: ['Regeneración', 'Aplastar'],
    },
  ];

  protected selectedTemplate = 'Orco';
  protected clones: Enemy[] = [];
  private cloneSequence = 0;

  protected cloneEnemy(): void {
    const template =
      this.enemyTemplates.find((enemy) => enemy.name === this.selectedTemplate) ??
      this.enemyTemplates[0];
    this.cloneSequence += 1;

    this.clones.unshift({
      id: this.cloneSequence,
      name: `${template.name} #${this.cloneSequence}`,
      level: template.level + Math.floor(this.cloneSequence / 2),
      template: template.name,
      skills: [...template.skills],
    });

    this.clones = this.clones.slice(0, 4);
  }

  /* ------------------------------------------------------------------ */
  /* Factory Function                                                   */
  /* ------------------------------------------------------------------ */
  protected accountName = 'Ana';
  protected initialDeposit = 100000;
  protected operationAmount = 25000;
  protected account: AccountState | null = null;
  protected factoryMessage = '';

  protected createAccount(): void {
    const name = this.accountName.trim();

    if (!name) {
      this.factoryMessage = 'El titular es obligatorio.';
      return;
    }

    if (!Number.isFinite(this.initialDeposit) || this.initialDeposit <= 0) {
      this.factoryMessage = 'El depósito inicial debe ser mayor que cero.';
      return;
    }

    this.account = {
      name,
      balance: this.initialDeposit,
      movements: [`Apertura: +${this.cop.format(this.initialDeposit)}`],
    };
    this.factoryMessage = `Cuenta creada para ${name}.`;
  }

  protected deposit(): void {
    if (!this.account) {
      this.factoryMessage = 'Primero debes crear una cuenta.';
      return;
    }

    if (this.operationAmount <= 0) {
      this.factoryMessage = 'El depósito debe ser positivo.';
      return;
    }

    this.account.balance += this.operationAmount;
    this.account.movements.unshift(`Depósito: +${this.cop.format(this.operationAmount)}`);
    this.factoryMessage = 'Depósito aplicado.';
  }

  protected withdraw(): void {
    if (!this.account) {
      this.factoryMessage = 'Primero debes crear una cuenta.';
      return;
    }

    if (this.operationAmount <= 0) {
      this.factoryMessage = 'El retiro debe ser positivo.';
      return;
    }

    if (this.operationAmount > this.account.balance) {
      this.factoryMessage = 'Fondos insuficientes.';
      return;
    }

    this.account.balance -= this.operationAmount;
    this.account.movements.unshift(`Retiro: -${this.cop.format(this.operationAmount)}`);
    this.factoryMessage = 'Retiro aplicado.';
  }

  /* ------------------------------------------------------------------ */
  /* Composite                                                          */
  /* ------------------------------------------------------------------ */
  private readonly fileTree: FsNode = {
    name: 'proyecto',
    type: 'folder',
    children: [
      { name: 'README.md', type: 'file', size: 4 },
      {
        name: 'src',
        type: 'folder',
        children: [
          { name: 'app.ts', type: 'file', size: 18 },
          { name: 'styles.scss', type: 'file', size: 9 },
          {
            name: 'components',
            type: 'folder',
            children: [
              { name: 'card.ts', type: 'file', size: 7 },
              { name: 'navbar.ts', type: 'file', size: 6 },
            ],
          },
        ],
      },
      {
        name: 'assets',
        type: 'folder',
        children: [
          { name: 'logo.svg', type: 'file', size: 3 },
          { name: 'hero.png', type: 'file', size: 24 },
        ],
      },
    ],
  };

  protected readonly fsRows = this.flattenFs(this.fileTree, 0);
  protected selectedFsName = 'proyecto';

  protected get selectedFsSize(): number {
    return Math.max(0, this.findFsSize(this.fileTree, this.selectedFsName));
  }

  protected selectFs(name: string): void {
    this.selectedFsName = name;
  }

  private flattenFs(
    node: FsNode,
    depth: number,
  ): Array<{ name: string; type: 'file' | 'folder'; depth: number; size: number }> {
    const rows = [
      {
        name: node.name,
        type: node.type,
        depth,
        size: this.sizeOf(node),
      },
    ];

    if (node.children) {
      for (const child of node.children) {
        rows.push(...this.flattenFs(child, depth + 1));
      }
    }

    return rows;
  }

  private sizeOf(node: FsNode): number {
    if (node.type === 'file') {
      return node.size ?? 0;
    }

    return (node.children ?? []).reduce((total, child) => total + this.sizeOf(child), 0);
  }

  private findFsSize(node: FsNode, name: string): number {
    if (node.name === name) {
      return this.sizeOf(node);
    }

    for (const child of node.children ?? []) {
      const found = this.findFsSize(child, name);
      if (found >= 0) {
        return found;
      }
    }

    return -1;
  }

  /* ------------------------------------------------------------------ */
  /* Iterator                                                           */
  /* ------------------------------------------------------------------ */
  protected readonly playlist = [
    'Bohemian Rhapsody',
    'Billie Jean',
    'Imagine',
    'Hotel California',
    'Smells Like Teen Spirit',
  ];

  protected iteratorA = 0;
  protected iteratorB = 0;
  protected iteratorMessageA = 'Listo para recorrer.';
  protected iteratorMessageB = 'Listo para recorrer.';

  protected nextA(): void {
    if (this.iteratorA >= this.playlist.length) {
      this.iteratorMessageA = 'Fin de la lista.';
      return;
    }
    this.iteratorMessageA = `${this.iteratorA + 1}. ${this.playlist[this.iteratorA]}`;
    this.iteratorA += 1;
  }

  protected nextB(): void {
    if (this.iteratorB >= this.playlist.length) {
      this.iteratorMessageB = 'Fin de la lista.';
      return;
    }
    this.iteratorMessageB = `${this.iteratorB + 1}. ${this.playlist[this.iteratorB]}`;
    this.iteratorB += 1;
  }

  protected resetIterators(): void {
    this.iteratorA = 0;
    this.iteratorB = 0;
    this.iteratorMessageA = 'Listo para recorrer.';
    this.iteratorMessageB = 'Listo para recorrer.';
  }

  /* ------------------------------------------------------------------ */
  /* Memento                                                            */
  /* ------------------------------------------------------------------ */
  protected editorText = 'Hola, este es mi texto original.';
  protected mementoHistory: string[] = [];
  protected mementoMessage = 'Aún no hay instantáneas guardadas.';

  protected saveSnapshot(): void {
    this.mementoHistory.push(this.editorText);
    this.mementoMessage = `Instantánea #${this.mementoHistory.length} guardada.`;
  }

  protected undo(): void {
    const previous = this.mementoHistory.pop();

    if (previous === undefined) {
      this.mementoMessage = 'No hay nada para deshacer.';
      return;
    }

    this.editorText = previous;
    this.mementoMessage = 'Estado restaurado desde la última instantánea.';
  }

  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */
  protected readonly tracks = [
    'Midnight City · M83',
    'Blinding Lights · The Weeknd',
    'Levitating · Dua Lipa',
    'Sunflower · Post Malone',
  ];

  protected playerState: 'Detenido' | 'Reproduciendo' | 'Pausado' = 'Detenido';
  protected trackIndex = 0;
  protected stateLog = 'El reproductor está detenido.';

  protected play(): void {
    if (this.playerState === 'Detenido') {
      this.playerState = 'Reproduciendo';
      this.stateLog = `StoppedState → PlayingState: suena “${this.tracks[this.trackIndex]}”.`;
    } else if (this.playerState === 'Pausado') {
      this.playerState = 'Reproduciendo';
      this.stateLog = 'PausedState → PlayingState: la música continúa.';
    } else {
      this.stateLog = 'PlayingState: ya está reproduciendo, la acción se ignora.';
    }
  }

  protected pause(): void {
    if (this.playerState === 'Reproduciendo') {
      this.playerState = 'Pausado';
      this.stateLog = 'PlayingState → PausedState: pista pausada.';
    } else {
      this.stateLog = `${this.playerState}: no hay reproducción activa para pausar.`;
    }
  }

  protected nextTrack(): void {
    if (this.playerState === 'Detenido') {
      this.stateLog = 'StoppedState: primero debes reproducir una pista.';
      return;
    }

    this.trackIndex = (this.trackIndex + 1) % this.tracks.length;
    this.stateLog = `Next: ahora suena “${this.tracks[this.trackIndex]}”.`;
  }

  protected previousTrack(): void {
    if (this.playerState === 'Detenido') {
      this.stateLog = 'StoppedState: primero debes reproducir una pista.';
      return;
    }

    this.trackIndex = (this.trackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.stateLog = `Previous: ahora suena “${this.tracks[this.trackIndex]}”.`;
  }
}
