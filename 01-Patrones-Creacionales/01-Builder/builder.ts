/**
 * ! Patrón Builder:
 * Es un patrón de diseño creacional que nos permite construir objetos complejos
 * paso a paso.
 *
 * El patrón nos permite producir distintos tipos y representaciones
 * de un objeto empleando el mismo código de construcción.
 *
 * * Es útil cuando necesitamos construir un objeto complejo con muchas partes
 * * y queremos que el proceso de construcción sea independiente de las partes
 * * que lo componen.
 *
 * https://refactoring.guru/es/design-patterns/builder
 */

import { COLORS } from '../../helpers/colors.ts';

class Computer {

    public CPU: string = 'CPU - Not Defined';
    public RAM: string = 'RAM - Not Defined';
    public STORAGE: string = 'STORAGE - Not Defined';
    public GPU?: string;

    displayConfiguration(){
        console.log(`Configuración de la Computadora
            CPU: ${this.CPU}
            RAM: ${this.RAM}
            STORAGE: ${this.STORAGE}
            GPU: ${this.GPU ?? 'Not Have GPU'}
        `);
    }

}

class ComputerBuilder {

    private computer: Computer;

    constructor(){
        this.computer = new Computer();
    }

    setCPU(CPU: string): ComputerBuilder {
        this.computer.CPU = CPU;
        return this;
    }

    setRAM(RAM: string): ComputerBuilder {
        this.computer.RAM = RAM;
        return this;
    }

    setSTORAGE(STORAGE: string): ComputerBuilder {
        this.computer.STORAGE = STORAGE;
        return this;
    }

    setGPU(GPU: string): ComputerBuilder {
        this.computer.GPU = GPU;
        return this;
    }

    build(){
        return this.computer;
    }

}

function main(){

    const basicComputer = new ComputerBuilder()
        .setCPU('Intel i3')
        .setRAM('4GB')
        .setSTORAGE('256GB')
        .build();

    console.log('%cComputadora Básica: ', COLORS.blue);
    basicComputer.displayConfiguration();

    const gamerComputer = new ComputerBuilder()
        .setCPU('Intel i9')
        .setRAM('32GB')
        .setSTORAGE('1TB SSD')
        .setGPU('Nvidia RTX 4070')
        .build();

    console.log('%cComputadora Gamer: ', COLORS.red);
    gamerComputer.displayConfiguration();

}

main();