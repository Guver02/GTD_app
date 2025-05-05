import React from "react";
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

    const navigate = useNavigate();

    const handleLoginClick = (event) => {
        event.preventDefault();
        navigate('/auth/login');
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
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
        </div>
        <button className={signinButton}>Sign Up</button>
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
