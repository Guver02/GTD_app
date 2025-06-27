class UserCredentials {
  constructor(username, password) {
    if (!username.length < 2) throw new Error("Usuario Invalido")
    if (password.length < 6) throw new Error("Contraseña demasiado corta")

    this.email = email
    this.password = password
  }
}

export {UserCredentials}
