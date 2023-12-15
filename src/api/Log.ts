export class Log {
    public usuario: String;
    public timestamp: String;
    public caducidad: String;
    public token: String;
    
    constructor(usuario: String, timestamp: String, caducidad: String,token: String) {
        this.usuario = usuario;
        this.timestamp = timestamp;
        this.caducidad = caducidad;
        this.token = token;
    }
}
