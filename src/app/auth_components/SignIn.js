import React, { useRef, useState, useContext } from "react";
import * as styles from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { APP_MODES } from "../../manager/configs/appModes";
import { useAuthController } from "../../controllers/authController";
import { ModalContext } from "../providers/ModalContext";
import { ErrorBanner } from "../ui_components/ErrorBanner";
import {
    InvalidCredentialsError,
    InvalidEmailError,
    InvalidPasswordError,
    InvalidUsernameError,
} from "../../errors/AuthCustomErrors";
import { InfrastructureError } from "../../errors/LayerErrors";
import { UnknowError } from "../../errors/UnknowError";

const {
    signinContainer,
    signinLeft,
    leftContent,
    signinRight,
    logo,
    emailPassword,
    signinButton,
    loginLink,
    inputError,
    toastError,
} = styles;

const defaultErrors = {
    userName: { error: false, message: "" },
    password: { error: false, message: "" },
    email: { error: false, message: "" },
    global: { error: false, message: "" },
};

function SignIn() {
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [errors, setErrors] = useState(defaultErrors);

    const inputUserNameRef = useRef(null);
    const inputPasswordRef = useRef(null);
    const inputConfirmPasswordRef = useRef(null)
    const inputEmailRef = useRef(null)

    const { openModal, closeModal } = useContext(ModalContext);
    const navigate = useNavigate();

    const onlineAuth = useAuthController(APP_MODES.online_api.appMode);
    const localAuth = useAuthController(APP_MODES.offline.appMode);

    const clearError = () => {
        setErrors(defaultErrors);
    };

    const setFieldError = (field, message) => {
        setErrors((prev) => ({
            ...defaultErrors,
            [field]: { error: true, message },
        }));
    };

    const showErrors = (error) => {
        if (error instanceof InvalidUsernameError) {
            setFieldError("userName", error.message);
            inputUserNameRef.current?.focus();
        }

        if (error instanceof InvalidPasswordError) {
            setFieldError("password", error.message);
            inputPasswordRef.current?.focus();
            inputConfirmPasswordRef.current?.focus();
        }

        if (error instanceof InvalidEmailError) {
            setFieldError("email", error.message)
            inputEmailRef.current?.focus();
        }

        if (error instanceof InvalidCredentialsError) {
            setFieldError("global", error.message);
            setErrors((prev) => ({
                ...prev,
                email: { error: true, message: "" },
                userName: { error: true, message: "" },
                password: { error: true, message: "" },
            }));
            inputUserNameRef.current?.focus();
        }

        if (error instanceof InfrastructureError) {
            openModal(
                <ErrorBanner
                    principalMesssage={error.message}
                    onClose={closeModal} />
            );
        }

        if (error instanceof UnknowError)
            openModal(<ErrorBanner
                principalMesssage={error.message}
                secondaryMessage={'Error Desconcido'}
                onClose={closeModal} />);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        clearError();

        if (!email || !userName || !password || !confirm) {

            if (!userName) setErrors((prev) => ({
                ...prev,
                userName: { error: true, message: "" },
            }));

            if (!email) setErrors((prev) => ({
                ...prev,
                email: { error: true, message: "" },
            }));

            if (!password || !confirm) setErrors((prev) => ({
                ...prev,
                password: { error: true, message: "" },
            }));

            return setErrors((prev) => ({
                ...prev,
                global: { error: true, message: "Todas las filas son requeridas" },
            }));

        }

        if (password !== confirm) {
            inputConfirmPasswordRef.current?.focus();
            return setFieldError("password", "Passwords do not match");
        }

        try {
            const isSignIn = await onlineAuth.signUp(
                { email, password, name: userName },
                showErrors
            );
            if (isSignIn) navigate("/app/inbox");
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmitLocal = async (event) => {
        event.preventDefault();
        clearError();

        if (!email || !userName || !password || !confirm) {
            if (!userName) setErrors((prev) => ({
                ...prev,
                userName: { error: true, message: "" },
            }));

            if (!email) setErrors((prev) => ({
                ...prev,
                email: { error: true, message: "" },
            }));

            if (!password || !confirm) setErrors((prev) => ({
                ...prev,
                password: { error: true, message: "" },
            }));

            return setErrors((prev) => ({
                ...prev,
                global: { error: true, message: "Todas las filas son requeridas" },
            }));
        }

        if (password !== confirm) {
            inputConfirmPasswordRef.current?.focus();
            return setFieldError("password", "Passwords do not match");
        }

        try {
            const isSignIn = await localAuth.signUp(
                { email, password, name: userName },
                showErrors
            );
            if (isSignIn) navigate("/app/inbox");
        } catch (err) {
            console.error(err);
        }
    };

    const handleLoginClick = (event) => {
        event.preventDefault();
        navigate("/auth/login");
    };

    return (
        <div className={signinContainer}>
            <div className={signinLeft}>
                <div className={leftContent}>
                    <h2>Connect with every application.</h2>
                    <p>Everything you need in an easily customizable dashboard.</p>
                </div>
            </div>

            <div className={signinRight}>
                <div className={logo}>dotwork</div>
                <h1>Create your Account</h1>
                <p>Welcome! Sign up to get started.</p>

                <div className={emailPassword}>
                    <input
                        type="email"
                        ref={inputEmailRef}
                        className={errors.email.error ? inputError : ""}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            clearError();
                        }}
                    />
                    {errors.email.message && (
                        <div className={toastError}>{errors.email.message}</div>
                    )}

                    <input
                        type="text"
                        ref={inputUserNameRef}
                        className={errors.userName.error ? inputError : ""}
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => {
                            setUserName(e.target.value);
                            clearError();
                        }}
                    />
                    {errors.userName.message && (
                        <div className={toastError}>{errors.userName.message}</div>
                    )}

                    <input
                        type="password"
                        ref={inputPasswordRef}
                        className={errors.password.error ? inputError : ""}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            clearError();
                        }}
                    />
                    <input
                        type="password"
                        ref={inputConfirmPasswordRef}
                        className={errors.password.error ? inputError : ""}
                        placeholder="Confirm Password"
                        value={confirm}
                        onChange={(e) => {
                            setConfirm(e.target.value);
                            clearError();
                        }}
                    />
                    {errors.password.message && (
                        <div className={toastError}>{errors.password.message}</div>
                    )}

                    {errors.global.message && (
                        <div className={toastError}>{errors.global.message}</div>
                    )}
                </div>

                <button className={signinButton} onClick={handleSubmit}>
                    Sign Up
                </button>

                <button className={signinButton} onClick={handleSubmitLocal}>
                    Sign Local
                </button>

                <p className={loginLink}>
                    Already have an account?{" "}
                    <a href="#" onClick={handleLoginClick}>
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}

export { SignIn };
