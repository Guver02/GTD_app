import { InvalidEmailError, InvalidPasswordError, InvalidUsernameError } from "../errors/AuthCustomErrors"

class UserRegistration {
    constructor(email, password, name) {
        if (!email.includes("@")) throw new InvalidEmailError()
        if (password.length < 6) throw new InvalidPasswordError()
        if (!name || name.length < 2) throw new InvalidUsernameError()

        this.email = email
        this.password = password
        this.name = name
    }
}

export { UserRegistration }
