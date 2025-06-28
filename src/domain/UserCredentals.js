import { DomainError } from "../errors/CustomErrors"

class UserCredentials {
  constructor(username, password) {
    if (username.length < 3) throw new DomainError("Usuario Inválido",
        {type:'userName'})

    if (password.length < 6) throw new DomainError("Contraseña demasiado corta",
        {type: 'password'}
    )

    this.username = username
    this.password = password
  }
}

export {UserCredentials}
