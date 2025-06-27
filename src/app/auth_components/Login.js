import React, { useState } from "react";
import * as styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { createAuthSesion } from "../../controllers/factories/createAuthSesion";
import { APP_MODES } from "../../controllers/manager/configs/appModes";
import { unknownError } from "../../utils/errorFunctions";
import { useAuthController } from "../../controllers/authController";

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
    signupLink
  } = styles;

function Login() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const onlineAuth = useAuthController(APP_MODES.online_api.appMode);
    const localAuth = useAuthController(APP_MODES.offline.appMode);


    const handleSignUpClick = (event) => {
        event.preventDefault();
        navigate('/auth/signin');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            /* const authSesion = createAuthSesion(APP_MODES.online_api.appMode)
            await authSesion.login(userName, password)

            navigate('/app/inbox') */

            await onlineAuth.logIn({userName, password})
            navigate('/app/inbox')
        } catch (error) {
            unknownError(error)
        }
    }

    const handleSubmitLocal = async (event) => {
        event.preventDefault();
        try {
           /*  const authSesion = createAuthSesion(APP_MODES.offline.appMode)
            await authSesion.login(userName, password) */
            await localAuth.logIn({userName, password})

            navigate('/app/inbox')
        } catch (error) {
            unknownError(error)
        }
    }

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
        <form
        className={emailPassword}
        onSubmit={handleSubmit}
        >
          <input
          placeholder="Email"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}/>
          <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
        </form>
        <div className={rememberForgot}>
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>
        <button
        className={loginButton}
        onClick={handleSubmit}>Log in</button>
        <p className={signupLink}>
          Don't have an account?
          <a
          href="#"
          onClick={handleSignUpClick}
          >Create an account</a> or:
        </p>
        <button
        onClick={handleSubmitLocal}
        className={loginButton}>
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
