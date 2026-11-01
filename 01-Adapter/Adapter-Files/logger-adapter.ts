import { Logger } from 'jsr:@deno-library/logger';
import { COLORS } from "../../helpers/colors.ts";


//Uso de Libreria de Errores de Deno
// const logger = new Logger();
// logger.info('');
// logger.warn('');
// logger.error('');

// TODO: Implementar el LoggerAdapter

interface ILogerAdapter {
    file: string;
    writeLog(msg: string): void;
    writeWarning(msg: string): void;
    writeError(msg: string): void;
}

export class DenoLoggerAdapter implements ILogerAdapter {
  public file: string;
  private logger = new Logger();

  constructor(file: string){
    this.file = file;
  }

  writeLog(msg: string){
    this.logger.info(`[${this.file} Log] ${msg}`);
  }

  writeWarning(msg: string){
    this.logger.warn(`[${this.file} Warning] ${msg}`);
  }

  writeError(msg: string){
    this.logger.error(`[${this.file} Error] ${msg}`);
  };
    
}