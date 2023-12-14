export class User {
    public username: String;
    public email: String;
    public password: String;
    public images: String[];
    
    constructor(username: String, email: String, password: String, images: String[]) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.images = images;
    }
}
