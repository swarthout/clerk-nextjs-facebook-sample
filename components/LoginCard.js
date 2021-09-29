import React from "react";
import styles from "../styles/Home.module.css";

export const LoginCard = ({ onSubmit, register, onCreateAccount }) => {
  return (
    <div className={styles.loginCard}>
      <form onSubmit={onSubmit}>
        <div className={styles.loginCardInputs}>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Email or Phone Number"
            aria-label="Email or Phone Number"
            {...register("email", { required: true })}
          ></input>

          <input
            type="password"
            className={styles.textInput}
            placeholder="Password"
            aria-label="Password"
            {...register("password", { required: true })}
          ></input>

          <button className={styles.loginButton} name="login" type="submit">
            Log In
          </button>
        </div>
      </form>
      <div className={styles.lowerCardItems}>
        <div className={styles.forgotPassword}>
          <a>Forgot password?</a>
        </div>
        <div className={styles.divider}></div>

        <button
          className={styles.createAccountButton}
          onClick={onCreateAccount}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
};
