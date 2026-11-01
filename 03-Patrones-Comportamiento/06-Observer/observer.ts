/**
 * ! Patrón Observer
 * El patrón Observer es un patrón de diseño de comportamiento que establece
 * una relación de uno a muchos entre un objeto, llamado sujeto,
 * y otros objetos, llamados observadores, que son notificados
 * y actualizados automáticamente por el sujeto
 * cuando se producen cambios en su estado.
 *
 * * Es útil cuando necesitamos que varios objetos estén
 * * pendientes de los cambios
 *
 * !No confundirlo con RXJS Observables
 *
 * https://refactoring.guru/es/design-patterns/observer
 */

import { COLORS } from '../../helpers/colors.ts';

interface Observer {
    notify(videoTitle: string): void;
}

class YouTubeChannel {
    private subscribers: Observer[] = [];
    private name: string;

    constructor(name: string){
        this.name = name;
    }

    subscribe(observer: Observer){
        this.subscribers.push(observer);
        console.log(`Nuevo Suscriptor al canal %c${this.name}`, COLORS.green);
    }

    unsubscribe(observer: Observer){
        this.subscribers = this.subscribers.filter(sub => sub != observer);
        console.log(`Un Suscriptor se ha dado de baja %c${this.name}`, COLORS.red);
    }

    uploadVideo(videoTitle: string){
        console.log(`Canal ${this.name} ha subido un nuevo video %c${videoTitle}`, COLORS.green);
        for(const subscriber of this.subscribers){
            subscriber.notify(videoTitle);
        }
    }

}

class Subscriber implements Observer {
    
    private name: string;

    constructor(name: string){
        this.name = name;
    }

    notify(videoTitle: string){
        console.log(`%c${this.name} %cha sido notificado: %cNuevo video ${videoTitle}`, 
            COLORS.blue,
            COLORS.white,
            COLORS.yellow,
        );
    }

}

function main(){
    const channel = new YouTubeChannel('Patrones de Diseño');

    const jesus = new Subscriber('Jesus');
    const david = new Subscriber('David');
    const juan = new Subscriber('Juan');

    channel.subscribe(jesus);
    channel.subscribe(david);
    channel.subscribe(juan);

    channel.uploadVideo('Patron Observer');
    
    channel.unsubscribe(juan);
    
    channel.uploadVideo('Patron Observer Parte 2');

    console.log('\n')
}

main();