class UserRegistration {
    constructor(email, password, name) {
        if (!email.includes("@")) throw new Error("Email inválido")
        if (password.length < 6) throw new Error("Contraseña muy corta")
        if (!name || name.length < 2) throw new Error("Nombre requerido")

        this.email = email
        this.password = password
        this.name = name
    }
}

export { UserRegistration }
