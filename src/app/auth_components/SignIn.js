import React, { useState } from "react";
import * as styles from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { createAuthSesion } from "../../controllers/factories/createAuthSesion";
import { APP_MODES } from "../../controllers/manager/configs/appModes";
import { useAuthController } from "../../controllers/authController";

const {
    signinContainer,
    signinLeft,
    leftContent,
    signinRight,
    logo,
    emailPassword,
    signinButton,
    loginLink
  } = styles;

function SignIn() {
    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const onlineAuth = useAuthController(APP_MODES.online_api.appMode);
    const localAuth = useAuthController(APP_MODES.offline.appMode);

    const navigate = useNavigate();

    const handleLoginClick = (event) => {
        event.preventDefault();
        navigate('/auth/login');
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        if((password == confirm)){
            await onlineAuth.signUp({email, password, name: userName})

            navigate('/app/inbox')
        }else{
            alert('Las credenciales son incorrectas')
        }
    }

    const handleSubmitLocal = async (event) => {
        event.preventDefault()
        if((password == confirm)
        ){
            localAuth.signUp({email, password, name: userName})
            navigate('/app/inbox')
        }else{
            alert('Las credenciales son incorrectas')
        }
    }

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
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          />
          <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          />
          <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          />
          <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          />
        </div>
        <button
        className={signinButton}
        onClick={handleSubmit}
        >Sign Up</button>

        <button
        className={signinButton}
        onClick={handleSubmitLocal}
        >Sign Local</button>

        <p className={loginLink}>
          Already have an account?
          <a
          href="#"
          onClick={handleLoginClick}
          >Log in</a>
        </p>
      </div>
    </div>
  );
}

export { SignIn };
