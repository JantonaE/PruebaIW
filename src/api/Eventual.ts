export class Eventual {
    public nombre: String;
    public timestamp: String; // Date?
    public lugar: String;
    public lat: Number;
    public lon: Number;
    public organizador: String;
    public images: String[];
    
    constructor(nombre: String,timestamp: String, lugar: String, lat: Number,lon: Number,organizador: String, images: String[]) {
        this.nombre = nombre;
        this.timestamp = timestamp;
        this.lugar = lugar;
        this.lat = lat;
        this.lon = lon;
        this.organizador = organizador;
        this.images = images;
    }
}
