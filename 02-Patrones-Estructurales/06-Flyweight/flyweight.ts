/**
 * ! Patrón Flyweight
 * Es un patrón de diseño estructural que nos permite usar objetos compartidos
 * para soportar eficientemente grandes cantidades de objetos.
*
* * Es útil cuando necesitamos una gran cantidad de objetos y queremos reducir
* * la cantidad de memoria que utilizan.
*
* https://refactoring.guru/es/design-patterns/flyweight
*/

import { COLORS } from '../../helpers/colors.ts';

interface Location {
    display(coords: { x: number, y: number }): void;
}

//Flyweight
class LocationIcon implements Location {
    private type: string;
    private iconImage: string;

    constructor(type: string, iconImage: string){
        this.type = type;
        this.iconImage = iconImage;
    }

    display(coords: { x: number; y: number; }): void {
      console.log(`Coords: ${this.type} en ${coords.x}, ${coords.y} con Icono %c[${this.iconImage}]`, COLORS.green)
    }
}

//Fabrica de Flyweights
class LocationFactory {
    private icons: Record<string, LocationIcon> = {};

    getLocationIcon(type: string): LocationIcon {
        if(!this.icons[type]){
            console.log(`%cCreando una instancia del icono ${type}`, COLORS.red);
            const iconImage = `imagen_de_${type.toLowerCase()}.png`;
            this.icons[type] = new LocationIcon(type, iconImage);
        }

        return this.icons[type];
    }
}

class MapLocation {
    private coords: { x: number, y: number };
    private icon: LocationIcon;

    constructor(x: number, y: number, icon: LocationIcon){
        this.coords = { x, y };
        this.icon = icon;
    }

    display(){
        this.icon.display(this.coords);
    }
}

function main(){

    const factory = new LocationFactory();
    const locations = [
        new MapLocation(10, 20, factory.getLocationIcon('hospital')),
        new MapLocation(20, 40, factory.getLocationIcon('hospital')),
        new MapLocation(30, 60, factory.getLocationIcon('hospital')),
        new MapLocation(40, 80, factory.getLocationIcon('parque')),
        new MapLocation(50, 100, factory.getLocationIcon('parque')),
        new MapLocation(60, 120, factory.getLocationIcon('parque')),
        new MapLocation(70, 140, factory.getLocationIcon('escuela')),
        new MapLocation(80, 160, factory.getLocationIcon('escuela')),
        new MapLocation(90, 180, factory.getLocationIcon('escuela')),
    ]

    locations.forEach(location => location.display());

}

main();