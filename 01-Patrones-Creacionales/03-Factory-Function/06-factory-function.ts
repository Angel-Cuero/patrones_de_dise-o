/**
 * ============================================================================
 * EJERCICIO 6: PATRÓN FACTORY FUNCTION
 * ============================================================================
 *
 * ¿Qué hace el patrón?
 * Es un patrón creacional que se basa en una función cuya única
 * responsabilidad es crear y devolver un objeto listo para usar. La función
 * encapsula la validación, los valores por defecto y los detalles internos
 * (por ejemplo, el estado privado mediante closures), de modo que el cliente
 * no construye los objetos directamente con literales ni con constructores
 * pesados.
 *
 * ¿Qué problema se está resolviendo?
 * En un sistema de cuentas de ahorro se crean cuentas para muchos clientes.
 * Si cada parte del programa creara el objeto con un literal ({ ... }),
 * la validación (depósito inicial positivo, titular no vacío) y las reglas
 * (el saldo no puede maniparse desde fuera) se duplicarían o quedarían
 * expuestas: cualquier código podría escribir un saldo negativo o un
 * titular doble espacio y "romper" los datos.
 *
 * ¿Por qué Factory Function es adecuado?
 * - La función createAccount() centraliza la validación: es imposible
 *   obtener una cuenta inválida si todo pasa por la fábrica.
 * - El saldo queda encapsulado en una closure: desde fuera no existe forma
 *   de asignarlo directamente; solo se puede a través de deposit()/withdraw().
 * - Es fácil agregar variantes (por ejemplo, cuentas de ahorro con límite de
 *   retiros) creando otra función fábrica, sin modificar a las existentes.
 * ============================================================================
 */

import { COLORS } from "../../helpers/colors.ts";

/** Interfaz que expone la cuenta: solo operaciones, sin estado manipulable. */
interface Account {
  readonly id: string;
  readonly holder: string;
  getBalance(): number;
  deposit(amount: number): void;
  withdraw(amount: number): void;
  statement(): string;
}

let nextAccountId = 1;

/**
 * Fábrica: crea cuentas validadas y con estado privado gracias a la closure.
 * El saldo vive solo dentro de esta función; ninguna parte externa lo toca.
 */
function createAccount(holder: string, initialDeposit: number): Account {
  // Validaciones de creación: se ejecutan antes de devolver el objeto.
  const cleanHolder = holder.trim();

  if (cleanHolder.length === 0) {
    throw new Error("El titular no puede estar vacío.");
  }

  if (!Number.isFinite(initialDeposit) || initialDeposit <= 0) {
    throw new Error("El depósito inicial debe ser un número mayor que cero.");
  }

  // Estado privado: solo visible dentro de la closure.
  let balance = initialDeposit;
  const id = `CTA-${String(nextAccountId++).padStart(3, "0")}`;

  const ensureAmount = (amount: number, operation: string): void => {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(`El monto de ${operation} debe ser mayor que cero.`);
    }
  };

  // Objeto público devuelto por la fábrica.
  return {
    id,
    holder: cleanHolder,

    getBalance(): number {
      return balance;
    },

    deposit(amount: number): void {
      ensureAmount(amount, "depósito");
      balance += amount;
      console.log(
        `%c  [${id}] Depósito de ${formatCop(amount)}. Saldo: ${
          formatCop(balance)
        }`,
        COLORS.green,
      );
    },

    withdraw(amount: number): void {
      ensureAmount(amount, "retiro");

      if (amount > balance) {
        throw new Error(
          `Retiro rechazado: saldo insuficiente (${formatCop(balance)}).`,
        );
      }

      balance -= amount;
      console.log(
        `%c  [${id}] Retiro de ${formatCop(amount)}. Saldo: ${
          formatCop(balance)
        }`,
        COLORS.red,
      );
    },

    statement(): string {
      return `[${id}] Titular: ${cleanHolder} | Saldo: ${formatCop(balance)}`;
    },
  };
}

function formatCop(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function main(): void {
  console.log("%c=== FACTORY FUNCTION: CUENTAS DE AHORRO ===", COLORS.cyan);

  // 1. Todas las cuentas nacen a través de la misma función fábrica.
  console.log("\n1. Cuentas creadas con la fábrica:", COLORS.yellow);
  const accountA = createAccount("Ana Torres", 200_000);
  const accountB = createAccount("  Luisa Peña  ", 80_000);

  console.log(`  ${accountA.statement()}`);
  console.log(`  ${accountB.statement()}`);

  // 2. Operaciones validadas por las funciones de la closure.
  console.log("\n2. Depósitos y retiros:", COLORS.yellow);
  accountA.deposit(50_000);
  accountA.withdraw(120_000);
  accountB.deposit(20_000);

  // 3. Reglas de negocio protegidas por la fábrica y el encapsulamiento.
  console.log("\n3. Intentos de operaciones inválidas:", COLORS.yellow);
  try {
    accountB.withdraw(500_000);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`%c  Rechazado: ${message}`, COLORS.red);
  }

  try {
    accountB.deposit(-10);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`%c  Rechazado: ${message}`, COLORS.red);
  }

  try {
    // La fábrica rechaza datos inválidos en la creación.
    createAccount("Carlos Ruiz", 0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`%c  Rechazado: ${message}`, COLORS.red);
  }

  // 4. El saldo no puede modificarse desde fuera: no existe setter.
  console.log("\n4. Estado final:", COLORS.yellow);
  console.log(`  ${accountA.statement()}`);
  console.log(`  ${accountB.statement()}`);
}

main();
