import { InvalidPasswordError, InvalidUsernameError } from "../errors/AuthCustomErrors"

class UserCredentials {
  constructor(username, password) {
    if (username.length < 3) throw new InvalidUsernameError()

    if (password.length < 6) throw new InvalidPasswordError()

    this.username = username
    this.password = password
  }
}

export {UserCredentials}
