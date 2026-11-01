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

import { LocalLogger } from "./Adapter-Files/local-logger.ts";

//const logger = new LocalLogger('adapter.ts');
const logger = new DenoLoggerAdapter('adapter.ts');

logger.writeLog('Mensaje de un log normal');
logger.writeWarning('Una alerta normal, información');
logger.writeError('Algo muy malo paso por aquí');