/**
 * ============================================================================
 * EJERCICIO 2: PATRÓN ADAPTER
 * ============================================================================
 *
 * ¿Qué hace el patrón?
 * Adapter es un patrón de diseño estructural que permite que dos objetos con
 * interfaces incompatibles trabajen juntos. El adaptador envuelve al objeto
 * que no se puede modificar y traduce las llamadas de la interfaz esperada por
 * el cliente hacia la interfaz real del objeto adaptado.
 *
 * ¿Qué problema se está resolviendo?
 * Una tienda en línea necesita comparar el costo de envío entre varias
 * transportadoras. Cada empresa expone una API distinta:
 *   - FedEx trabaja con libras, millas y dólares.
 *   - DHL recibe un objeto con kilogramos y kilómetros, y devuelve otro objeto.
 *   - ServiEntrega es una empresa local que usa kilogramos, kilómetros y pesos
 *     colombianos, con nombres de métodos y campos en español.
 * El código de la tienda no puede acoplarse a esas tres APIs: tendría que
 * conocer unidades, nombres de métodos y formas de respuesta diferentes. Y no
 * es posible modificar las clases de las transportadoras porque son externas.
 *
 * ¿Por qué Adapter es adecuado?
 * - Permite que las tres APIs, que no se pueden cambiar, cumplan una misma
 *   interfaz (ShippingProvider) sin tocar su código.
 * - El cliente (ShippingComparator) depende solo de la interfaz común; no
 *   conoce FedEx, DHL ni ServiEntrega.
 * - Cada adaptador encapsula la traducción de unidades y de estructura de
 *   datos, por lo que agregar una nueva transportadora solo requiere crear un
 *   adaptador nuevo, sin modificar el cliente.
 * ============================================================================
 */

import { COLORS } from '../helpers/colors.ts';

/** Interfaz objetivo (Target): lo que espera el código cliente. */
interface ShippingQuote {
  provider: string;
  costCop: number;
  estimatedDays: number;
}

interface ShippingProvider {
  readonly name: string;
  quote(weightKg: number, distanceKm: number): ShippingQuote;
}

// ---------------------------------------------------------------------------
// APIs externas (Adaptees). Sus interfaces son incompatibles entre sí y no
// se pueden modificar porque pertenecen a terceros.
// ---------------------------------------------------------------------------

/** FedEx trabaja en libras, millas y dólares estadounidenses. */
class FedExAPI {
  getRate(
    weightLb: number,
    distanceMi: number,
  ): { totalUsd: number; transitDays: number } {
    const totalUsd = 12 + weightLb * 0.85 + distanceMi * 0.12;
    const transitDays = Math.max(2, Math.ceil(distanceMi / 500) + 1);

    return {
      totalUsd: Number(totalUsd.toFixed(2)),
      transitDays,
    };
  }
}

/** DHL recibe y devuelve objetos con nombres propios de su API. */
interface DhlQuoteResponse {
  priceUsd: number;
  deliveryDays: number;
}

class DhlExpressAPI {
  quoteShipment(request: {
    weightKg: number;
    distanceKm: number;
  }): DhlQuoteResponse {
    const priceUsd = 15 + request.weightKg * 2.1 + request.distanceKm * 0.035;
    const deliveryDays = Math.max(1, Math.ceil(request.distanceKm / 700) + 2);

    return {
      priceUsd: Number(priceUsd.toFixed(2)),
      deliveryDays,
    };
  }
}

/** Empresa local: método y campos en español, moneda en pesos. */
interface ServiEntregaResponse {
  valorCop: number;
  tiempoEstimadoDias: number;
}

class ServiEntregaAPI {
  cotizarEnvio(pesoKg: number, distanciaKm: number): ServiEntregaResponse {
    const valorCop = 9000 + pesoKg * 3200 + distanciaKm * 85;
    const tiempoEstimadoDias = Math.max(1, Math.ceil(distanciaKm / 400) + 2);

    return {
      valorCop: Math.round(valorCop),
      tiempoEstimadoDias,
    };
  }
}

// ---------------------------------------------------------------------------
// Adaptadores (Adapters). Implementan la interfaz objetivo y traducen tanto
// las llamadas como los datos de respuesta.
// ---------------------------------------------------------------------------

const KG_TO_LB = 2.20462;
const KM_TO_MI = 0.621371;
const USD_TO_COP = 4000;

class FedExAdapter implements ShippingProvider {
  readonly name = 'FedEx';
  private readonly api: FedExAPI;

  constructor(api: FedExAPI) {
    this.api = api;
  }

  quote(weightKg: number, distanceKm: number): ShippingQuote {
    const weightLb = weightKg * KG_TO_LB;
    const distanceMi = distanceKm * KM_TO_MI;
    const response = this.api.getRate(weightLb, distanceMi);

    return {
      provider: this.name,
      costCop: Math.round(response.totalUsd * USD_TO_COP),
      estimatedDays: response.transitDays,
    };
  }
}

class DhlAdapter implements ShippingProvider {
  readonly name = 'DHL Express';
  private readonly api: DhlExpressAPI;

  constructor(api: DhlExpressAPI) {
    this.api = api;
  }

  quote(weightKg: number, distanceKm: number): ShippingQuote {
    const response = this.api.quoteShipment({ weightKg, distanceKm });

    return {
      provider: this.name,
      costCop: Math.round(response.priceUsd * USD_TO_COP),
      estimatedDays: response.deliveryDays,
    };
  }
}

class ServiEntregaAdapter implements ShippingProvider {
  readonly name = 'ServiEntrega';
  private readonly api: ServiEntregaAPI;

  constructor(api: ServiEntregaAPI) {
    this.api = api;
  }

  quote(weightKg: number, distanceKm: number): ShippingQuote {
    const response = this.api.cotizarEnvio(weightKg, distanceKm);

    return {
      provider: this.name,
      costCop: response.valorCop,
      estimatedDays: response.tiempoEstimadoDias,
    };
  }
}

// ---------------------------------------------------------------------------
// Código cliente. Solo conoce ShippingProvider y ShippingQuote.
// ---------------------------------------------------------------------------

class ShippingComparator {
  private readonly providers: ShippingProvider[];

  constructor(providers: ShippingProvider[]) {
    this.providers = providers;
  }

  compare(weightKg: number, distanceKm: number): ShippingQuote[] {
    return this.providers
      .map((provider) => provider.quote(weightKg, distanceKm))
      .sort((a, b) => a.costCop - b.costCop);
  }
}

function formatCop(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

function main(): void {
  console.log('%c=== ADAPTER: COMPARADOR DE ENVÍOS ===', COLORS.cyan);

  // El cliente recibe adaptadores, no las APIs externas.
  const comparator = new ShippingComparator([
    new FedExAdapter(new FedExAPI()),
    new DhlAdapter(new DhlExpressAPI()),
    new ServiEntregaAdapter(new ServiEntregaAPI()),
  ]);

  const weightKg = 5;
  const distanceKm = 320;

  console.log(
    `%cPaquete de ${weightKg} kg con destino a ${distanceKm} km:\n`,
    COLORS.yellow,
  );

  const quotes = comparator.compare(weightKg, distanceKm);

  quotes.forEach((quote, index) => {
    console.log(
      `${index + 1}. ${quote.provider}: ${formatCop(quote.costCop)} ` +
        `(${quote.estimatedDays} días estimados)`,
    );
  });

  const cheapest = quotes[0];
  console.log(
    `%c\nOpción más económica: ${cheapest.provider} ` +
      `con ${formatCop(cheapest.costCop)}`,
    COLORS.green,
  );
}

main();
