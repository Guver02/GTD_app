import { UserCredentials } from "../domain/UserCredentals"
import { UserRegistration } from "../domain/UserRegistration"

const loginUseCase = async ({ userName, password }, authRepo, sessionRepo, appMode, ) => {
    const credentials = new UserCredentials(userName, password)
    console.log(credentials)
    const {token} = await authRepo.login(credentials.username, credentials.password)

    sessionRepo.setMode(appMode, token)

}

const signupUseCase = async ({ email, password, name }, authRepo, sessionRepo, appMode) => {
    const registration = new UserRegistration(email, password, name)
    const {token} = await authRepo.signup(registration.password, registration.password, registration.email)

    sessionRepo.setMode(appMode, token)
}

const logoutUseCase = (sessionRepo) => {
    sessionRepo.clear()
}

const checkSessionUseCase = (sessionRepo, appMode) => {
    console.log('appMode', appMode);
    const config = sessionRepo.getConfig()

    console.log('confi',config)

    if (!config.jwt || !config.appMode || !config.storageType) return null
    if (config.appMode !== appMode) return null

    return { token: config.jwt, isLogged: true }
}

const getDataUseCase = async (authRepo, token) => {
    const data = await authRepo.getData(token)
    return data
}


export { loginUseCase, signupUseCase, logoutUseCase, checkSessionUseCase, getDataUseCase}
