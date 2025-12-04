export class User {
    constructor(id, email, passwordHash, salt) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash,
        this.salt = salt,
        this.createdAt = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            createdAt: this.createdAt
        }
    }
 }

