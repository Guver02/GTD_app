import React, { useContext, useRef, useState } from "react";
import * as styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { APP_MODES } from "../../manager/configs/appModes";
import { unknownError } from "../../utils/errorFunctions";
import { useAuthController } from "../../controllers/authController";
import { ModalContext } from "../providers/ModalContext";

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
  unauthorized: { error: false, message: '' },
  badRequest: { error: false, message: '' },
  InfrastructureError: { error: false, message: '' }
};

function Login() {
  const navigate = useNavigate();
  const { openModal } = useContext(ModalContext);
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
    setErrors(prev => ({ ...prev, [field]: { error: true, message } }));
  };

  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    clearError();
  };

  const showErrors = (type, message) => {
    if (!type) {
      openModal(<div className={informationModal}>Error inesperado. Inténtalo de nuevo más tarde.</div>);
      return;
    }

    setFieldError(type, message);

    const focusMap = {
      userName: inputUserNameRef,
      password: inputPasswordRef,
      unauthorized: inputUserNameRef
    };

    const ref = focusMap[type];
    if (ref?.current) ref.current.focus();

    if (type === 'unauthorized') {
      setFieldError('userName', '');
      setFieldError('password', '');
    }
  };

  const handleSubmit = async (event, isLocal = false) => {
    event.preventDefault();
    const auth = isLocal ? localAuth : onlineAuth;

    try {
      const isLogin = await auth.logIn({ userName, password }, showErrors);
      if (isLogin) navigate('/app/inbox');
    } catch (error) {
      unknownError(error);
    }
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
            onChange={handleInputChange(setUserName, 'userName')}
          />
          <input
            type="password"
            className={errors.password.error ? inputError : ''}
            ref={inputPasswordRef}
            placeholder="Password"
            value={password}
            onChange={handleInputChange(setPassword, 'password')}
          />

          {['userName', 'password', 'unauthorized', 'badRequest'].map((key) =>
            errors[key].message && <div key={key} className={toastError}>{errors[key].message}</div>
          )}

          <div className={rememberForgot}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className={loginButton}>Log in</button>
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
