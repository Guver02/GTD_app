import React, { useState } from "react";
import * as styles from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

    const handleLoginClick = (event) => {
        event.preventDefault();
        navigate('/auth/login');
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        if((password == confirm)&&
            (password.length > 0)
            (email.length > 0)&&
            (userName.length < 0)
        ){
            await apiService.post(
                '/api/v1/auth/sing-in/',
                {
                username: userName,
                password: password,
                email: email
                })
            navigate('/auth/login')
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
