import { DomainError } from "../errors/CustomErrors"

class UserRegistration {
    constructor(email, password, name) {
        if (!email.includes("@")) throw new DomainError("Email inválido")
        if (password.length < 6) throw new DomainError("Contraseña muy corta")
        if (!name || name.length < 2) throw new DomainError("Nombre requerido")

        this.email = email
        this.password = password
        this.name = name
    }
}

export { UserRegistration }
