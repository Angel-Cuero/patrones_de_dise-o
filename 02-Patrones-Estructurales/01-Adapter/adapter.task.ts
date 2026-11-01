/**
 * ! Patrón Adapter
 *  Permite que objetos con interfaces incompatibles trabajen juntos, también es muy
 *  util para utilizar librerías de terceros en nuestra aplicación sin depender
 *  directamente de ellas.
 *
 * * Es útil cuando se quiere reutilizar una clase que no tiene la interfaz que
 * * necesitamos o cuando queremos crear una capa de abstracción para una librería
 * * de terceros.
 *
 * https://refactoring.guru/es/design-patterns/adapter
 */

import { COLORS } from '../../helpers/colors.ts';

// 1. Interfaz PaymentProcessor
interface PaymentProcessor {
  processPayment(amount: number): void;
}

// 2. Clases de Servicios de Pago Externos
// Estas clases simulan los servicios externos de PayPal, Stripe y MercadoPago

class PayPalService {
  sendPayment(amount: number): void {
    console.log(`Procesando pago de $${amount} con %cPayPal`, COLORS.blue);
  }
}

class StripeService {
  makeCharge(amount: number): void {
    console.log(`Procesando pago de $${amount} con %cStripe`, COLORS.purple);
  }
}

class MercadoPagoService {
  pay(amount: number): void {
    console.log(
      `Procesando pago de $${amount} con %cMercadoPago`,
      COLORS.yellow
    );
  }
}

// 3. Clases Adaptadoras

// Adaptador para PayPal
class PayPalAdapter implements PaymentProcessor {
  // TODO: Implementar la interfaz PaymentProcessor

  private payPalService = new PayPalService();

  processPayment(amount: number): void {
    this.payPalService.sendPayment(amount);
  }
}

// Adaptador para Stripe
class StripeAdapter implements PaymentProcessor {
  // TODO: Implementar la interfaz PaymentProcessor

  private stripeService = new StripeService();

  processPayment(amount: number): void {
    this.stripeService.makeCharge(amount);
  }
}

// Adaptador para MercadoPago
class MercadoPagoAdapter implements PaymentProcessor {
  // TODO: Implementar la interfaz PaymentProcessor

  private mercadoPagoService = new MercadoPagoService();

  processPayment(amount: number): void {
    this.mercadoPagoService.pay(amount);
  }
}

// 4. Código Cliente para probar el Adapter

function main() {
  const paymentAmount = 100;

  // TODO: Agregar los adaptadores para los servicios de pago
  const paypalProcessor: PaymentProcessor = new PayPalAdapter();
  const stripeProcessor: PaymentProcessor = new StripeAdapter();
  const mercadoPagoProcessor: PaymentProcessor = new MercadoPagoAdapter();

  // Procesar pagos con los diferentes servicios
  // Los 3 procesadores de pago trabajan exactamente igual después de adaptaros
  console.log('Usando PayPal:');
  paypalProcessor.processPayment(paymentAmount);

  console.log('\nUsando Stripe:');
  stripeProcessor.processPayment(paymentAmount);

  console.log('\nUsando MercadoPago:');
  mercadoPagoProcessor.processPayment(paymentAmount);
}

main();