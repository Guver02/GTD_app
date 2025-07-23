import React, { useContext, useRef, useState } from "react";
import * as styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { APP_MODES } from "../../manager/configs/appModes";
import { unknownError } from "../../utils/errorFunctions";
import { useAuthController } from "../../controllers/authController";
import { ModalContext } from "../providers/ModalContext";
import { InvalidCredentialsError, InvalidPasswordError, InvalidUsernameError } from "../../errors/AuthCustomErrors";
import { InfrastructureError } from "../../errors/LayerErrors";
import { UnknowError } from "../../errors/UnknowError";
import { ErrorBanner } from "../ui_components/ErrorBanner";

const {
    loginContainer,
    loginLeft,
    loginRight,
    rightContent,
    logo,
    socialButtons,
    googleButton,
    facebookButton,
    orContinue,
    emailPassword,
    rememberForgot,
    loginButton,
    signupLink,
    toastError,
    inputError,
    informationModal
} = styles;

const defaultErrors = {
    userName: { error: false, message: '' },
    password: { error: false, message: '' },
    global: { error: false, message: '' },
};

function Login() {
    const navigate = useNavigate();
    const { openModal, closeModal } = useContext(ModalContext);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(defaultErrors);

    const inputUserNameRef = useRef(null);
    const inputPasswordRef = useRef(null);

    const onlineAuth = useAuthController(APP_MODES.online_api.appMode);
    const localAuth = useAuthController(APP_MODES.offline.appMode);

    const clearError = () => {
        setErrors(defaultErrors);
    };

    const setFieldError = (field, message) => {
        setErrors(prev => ({ ...defaultErrors, [field]: { error: true, message } }));
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        clearError();
    };

    const showErrors = (error) => {
        if (error instanceof InvalidUsernameError) {
            setFieldError('userName', error.message)
            inputUserNameRef.current.focus()
        }

        if (error instanceof InvalidPasswordError) {
            setFieldError('password', error.message)
            inputPasswordRef.current.focus()
        }

        if (error instanceof InvalidCredentialsError) {
            setFieldError('global', error.message);
            setErrors(prev => ({ ...prev, userName: { error: true, message: '' }, password: { error: true, message: '' } }))
            inputUserNameRef.current.focus();
        }

        if (error instanceof InfrastructureError)
            openModal(<ErrorBanner
                principalMesssage={error.message}
                onClose={closeModal} />);

        if (error instanceof UnknowError)
            openModal(<ErrorBanner
                principalMesssage={error.message}
                secondaryMessage={'Error Desconcido'}
                onClose={closeModal} />);
    }

    const handleSubmit = async (event, isLocal = false) => {
        event.preventDefault();
        const auth = isLocal ? localAuth : onlineAuth;

        const isLogin = await auth.logIn({ userName, password }, showErrors);
        if (isLogin) navigate('/app/inbox');
    };

    const handleSignUpClick = (e) => {
        e.preventDefault();
        navigate('/auth/signin');
    };

    return (
        <div className={loginContainer}>

            <div className={loginLeft}>
                <div className={logo}>GTD Planner</div>
                <h1>Log in to your Account</h1>
                <p>Welcome back! Select method to log in:</p>


                <div className={socialButtons}>
                    <button className={googleButton}>G Google</button>
                    <button className={facebookButton}>f Facebook</button>
                </div>

                <p className={orContinue}>or continue with email</p>
                <form className={emailPassword} onSubmit={(e) => handleSubmit(e, false)}>
                    <input
                        className={errors.userName.error ? inputError : ''}
                        ref={inputUserNameRef}
                        placeholder="Email"
                        value={userName}
                        onChange={handleInputChange(setUserName)}
                    />
                    {errors.userName.message && <div className={toastError}>{errors.userName.message}</div>}

                    <input
                        type="password"
                        className={errors.password.error ? inputError : ''}
                        ref={inputPasswordRef}
                        placeholder="Password"
                        value={password}
                        onChange={handleInputChange(setPassword)}
                    />
                    {errors.password.message && <div className={toastError}>{errors.password.message}</div>}

                    {errors.global.message && <div className={toastError}>{errors.global.message}</div>}

                    <div className={rememberForgot}>
                        <label>
                            Remember me
                        </label>
                        <a href="#">Forgot Password?</a>
                    </div>

                    <button type="submit" className={loginButton}>Log in Cloud</button>
                </form>

                <p className={signupLink}>
                    Don't have an account? <a href="#" onClick={handleSignUpClick}>Create an account</a> or:
                </p>

                <button
                    onClick={(e) => handleSubmit(e, true)}
                    className={loginButton}
                >
                    Log in Local
                </button>
            </div>


            <div className={loginRight}>
                <div className={rightContent}>
                    <h2>Connect with every application.</h2>
                    <p>Everything you need in an easily customizable dashboard.</p>
                </div>
            </div>

        </div>
    );
}

export { Login };
