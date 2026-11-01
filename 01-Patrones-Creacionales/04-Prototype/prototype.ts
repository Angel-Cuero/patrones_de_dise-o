
/**
 * ! Patrón Prototype:

 * Es un patrón de diseño creacional que nos permite copiar objetos existentes sin hacer
 * que el código dependa de sus clases.
 * 
 * * Es útil cuando queremos duplicar el contenido, 
 * * el título y el autor de un documento, por ejemplo o cualquier objeto complejo.
 * 
 * https://refactoring.guru/es/design-patterns/prototype
 */

class DocumentPage {

    public title: string;
    public autor: string;
    private content: string;

    constructor(title: string, content: string, autor: string){
        this.title = title;
        this.content = content;
        this.autor = autor;
    }

    clone(): DocumentPage {
        return new DocumentPage(this.title, this.autor, this.content);
    }

    displayInfo(){
        console.log(`
            Title: ${this.title}
            Autor: ${this.autor}
            Content: ${this.content}
        `);
    }

}

function main(){
    const documentPage1 = new DocumentPage('Cotización', '500 dólares', 'Jesus');
    console.log({ documentPage1 });
    documentPage1.displayInfo();

    const documentPage2 = documentPage1.clone();
    documentPage2.title = 'Nueva Cotización';
    console.log({ documentPage2 });
    documentPage2.displayInfo();
}

main();