/**
 * ============================================================================
 * EJERCICIO 4: PATRÓN OBSERVER
 * ============================================================================
 *
 * ¿Qué hace el patrón?
 * Observer es un patrón de diseño de comportamiento que define una relación
 * de uno a muchos entre un sujeto y varios observadores. Cuando el estado del
 * sujeto cambia, todos los observadores suscritos son notificados y
 * actualizados automáticamente, sin que el sujeto tenga que conocer los
 * detalles concretos de cada uno.
 *
 * ¿Qué problema se está resolviendo?
 * En una tienda en línea, cuando un pedido cambia de estado (creado, pagado,
 * enviado, entregado o cancelado) deben ocurrir varias acciones: enviar un
 * correo al cliente, reservar o liberar inventario, generar una guía de envío,
 * sumar puntos de fidelidad y registrar el evento en analítica. Si el servicio
 * de pedidos llamara directamente a cada uno de esos módulos, quedaría
 * fuertemente acoplado a ellos: agregar una nueva reacción obligaría a
 * modificar el servicio y a volver a probarlo todo.
 *
 * ¿Por qué Observer es adecuado?
 * - El pedido (sujeto) solo anuncia que cambió; no necesita saber quién lo
 *   escucha ni cómo reacciona cada módulo.
 * - Los interesados se suscriben y se dan de baja dinámicamente, sin tocar el
 *   código del sujeto.
 * - Se pueden agregar nuevas reacciones (por ejemplo, notificar a logística)
 *   creando un observador nuevo, sin modificar OrderService.
 * - La relación de uno a muchos y la notificación automática son exactamente
 *   el comportamiento que exige este escenario.
 * ============================================================================
 */

import { COLORS } from '../../helpers/colors.ts';

type OrderStatus =
  | 'CREADO'
  | 'PAGADO'
  | 'ENVIADO'
  | 'ENTREGADO'
  | 'CANCELADO';

/** Producto o "payload" que se comparte con los observadores. */
class Order {
  readonly id: string;
  readonly customer: string;
  readonly total: number;
  private status: OrderStatus;

  constructor(id: string, customer: string, total: number) {
    this.id = id;
    this.customer = customer;
    this.total = total;
    this.status = 'CREADO';
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  /** Solo el sujeto (OrderService) debería cambiar el estado del pedido. */
  setStatus(status: OrderStatus): void {
    this.status = status;
  }
}

/** Interfaz Observer: todos los interesados deben poder recibir la notificación. */
interface OrderObserver {
  readonly name: string;
  update(order: Order, previousStatus: OrderStatus): void;
}

/**
 * Sujeto (Subject): mantiene la lista de observadores y los notifica cuando
 * cambia el estado de un pedido.
 */
class OrderService {
  private observers: OrderObserver[] = [];

  subscribe(observer: OrderObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      console.log(
        `%c  [OrderService] Suscrito: ${observer.name}`,
        COLORS.green,
      );
    }
  }

  unsubscribe(observer: OrderObserver): void {
    this.observers = this.observers.filter((item) => item !== observer);
    console.log(
      `%c  [OrderService] Desuscrito: ${observer.name}`,
      COLORS.red,
    );
  }

  createOrder(id: string, customer: string, total: number): Order {
    const order = new Order(id, customer, total);
    console.log(
      `%c  [OrderService] Pedido ${order.id} creado para ${customer}`,
      COLORS.yellow,
    );
    return order;
  }

  changeStatus(order: Order, newStatus: OrderStatus): void {
    const previousStatus = order.getStatus();

    if (previousStatus === newStatus) {
      return;
    }

    order.setStatus(newStatus);
    console.log(
      `%c  [OrderService] Pedido ${order.id}: ${previousStatus} -> ${newStatus}`,
      COLORS.cyan,
    );
    this.notifyObservers(order, previousStatus);
  }

  private notifyObservers(order: Order, previousStatus: OrderStatus): void {
    for (const observer of this.observers) {
      observer.update(order, previousStatus);
    }
  }
}

// ---------------------------------------------------------------------------
// Observadores concretos. Cada uno reacciona de forma independiente.
// ---------------------------------------------------------------------------

class EmailObserver implements OrderObserver {
  readonly name = 'Correo al cliente';

  update(order: Order, previousStatus: OrderStatus): void {
    console.log(
      `%c    [Email] ${order.customer}, su pedido ${order.id} pasó de ` +
        `${previousStatus} a ${order.getStatus()}.`,
      COLORS.blue,
    );
  }
}

class InventoryObserver implements OrderObserver {
  readonly name = 'Inventario';
  private readonly reservedOrders = new Set<string>();

  update(order: Order, _previousStatus: OrderStatus): void {
    if (order.getStatus() === 'PAGADO' && !this.reservedOrders.has(order.id)) {
      this.reservedOrders.add(order.id);
      console.log(
        `%c    [Inventario] Productos del pedido ${order.id} reservados.`,
        COLORS.green,
      );
    }

    if (order.getStatus() === 'CANCELADO' && this.reservedOrders.has(order.id)) {
      this.reservedOrders.delete(order.id);
      console.log(
        `%c    [Inventario] Productos del pedido ${order.id} liberados.`,
        COLORS.red,
      );
    }
  }
}

class ShippingObserver implements OrderObserver {
  readonly name = 'Logística';
  private readonly shipments = new Set<string>();

  update(order: Order, _previousStatus: OrderStatus): void {
    if (order.getStatus() === 'PAGADO' && !this.shipments.has(order.id)) {
      this.shipments.add(order.id);
      const guide = `GUIA-${order.id.replace('ORD-', '')}`;
      console.log(
        `%c    [Logística] Guía ${guide} generada para ${order.id}.`,
        COLORS.purple,
      );
    }
  }
}

class LoyaltyObserver implements OrderObserver {
  readonly name = 'Puntos de fidelidad';

  update(order: Order, _previousStatus: OrderStatus): void {
    if (order.getStatus() === 'ENTREGADO') {
      const points = Math.floor(order.total / 1_000);
      console.log(
        `%c    [Fidelidad] ${order.customer} ganó ${points} puntos.`,
        COLORS.yellow,
      );
    }
  }
}

class AnalyticsObserver implements OrderObserver {
  readonly name = 'Analítica';
  private eventCount = 0;

  update(order: Order, previousStatus: OrderStatus): void {
    this.eventCount++;
    console.log(
      `%c    [Analítica] Evento #${this.eventCount}: ${order.id} ` +
        `${previousStatus} -> ${order.getStatus()}.`,
      COLORS.gray,
    );
  }

  getEventCount(): number {
    return this.eventCount;
  }
}

function main(): void {
  console.log('%c=== OBSERVER: ESTADOS DE UN PEDIDO ===', COLORS.cyan);

  const orderService = new OrderService();
  const emailObserver = new EmailObserver();
  const inventoryObserver = new InventoryObserver();
  const shippingObserver = new ShippingObserver();
  const loyaltyObserver = new LoyaltyObserver();
  const analyticsObserver = new AnalyticsObserver();

  console.log('%c\nSuscripción de módulos:', COLORS.yellow);
  orderService.subscribe(emailObserver);
  orderService.subscribe(inventoryObserver);
  orderService.subscribe(shippingObserver);
  orderService.subscribe(loyaltyObserver);
  orderService.subscribe(analyticsObserver);

  console.log('%c\nPedido 1:', COLORS.yellow);
  const order1 = orderService.createOrder('ORD-001', 'María Gómez', 250_000);
  orderService.changeStatus(order1, 'PAGADO');
  orderService.changeStatus(order1, 'ENVIADO');
  orderService.changeStatus(order1, 'ENTREGADO');

  // La analítica se da de baja: deja de recibir notificaciones sin modificar
  // el código de OrderService.
  console.log('%c\nBaja del módulo de analítica:', COLORS.yellow);
  orderService.unsubscribe(analyticsObserver);

  console.log('%c\nPedido 2:', COLORS.yellow);
  const order2 = orderService.createOrder('ORD-002', 'Carlos Ruiz', 89_000);
  orderService.changeStatus(order2, 'PAGADO');
  orderService.changeStatus(order2, 'CANCELADO');

  console.log('%c\nResumen:', COLORS.green);
  console.log(
    `  Eventos registrados por analítica antes de darse de baja: ` +
      `${analyticsObserver.getEventCount()}`,
  );
  console.log(`  Estado final del pedido 1: ${order1.getStatus()}`);
  console.log(`  Estado final del pedido 2: ${order2.getStatus()}`);
}

main();
