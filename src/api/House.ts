export class House {
    public titulo: String;
    public descripcion: String;
    public lat: Number;
    public lon: Number;
    public images: String[];
    
    constructor(titulo: String, descripcion: String, lat: Number,lon: Number, images: String[]) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.lat = lat;
        this.lon = lon;
        this.images = images;
    }
}
