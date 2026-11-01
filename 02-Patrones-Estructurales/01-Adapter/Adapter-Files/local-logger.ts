import { COLORS } from '../../../helpers/colors.ts';

// TODO: Implementar el LocalLogger Class
export class LocalLogger {
    
    constructor(private file: string){

    }

    writeLog(msg: string): void {
        console.log(`[${this.file} Log] ${msg}`);
    }

    writeWarning(msg: string): void {
        console.log(`[${this.file} Warning] %c${msg}`, COLORS.yellow);
    }
    
    writeError(msg: string): void {
        console.log(`[${this.file} Error] %c${msg}`, COLORS.red);
    }


}