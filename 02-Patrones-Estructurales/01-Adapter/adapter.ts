import { DenoLoggerAdapter } from './Adapter-Files/logger-adapter.ts';
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

// El LocalLogger con las herramientas de consola de deno ya no se use debido a su fácil acceso a la librería...
const logger = new DenoLoggerAdapter('adapter.ts');

logger.writeLog('Mensaje de un log normal');
logger.writeWarning('Una alerta normal, información');
logger.writeError('Algo muy malo paso por aquí');