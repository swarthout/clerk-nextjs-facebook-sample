import React from "react";
import styles from "../styles/Home.module.css";
import { Input } from "./Input";
import { SIMPLE_REGEX_PATTERN } from "./constants";

export const LoginCard = ({ onSubmit, register, onCreateAccount, error }) => {
  return (
    <div className={styles.loginCard}>
      <form onSubmit={onSubmit}>
        <div className={styles.loginCardInputs}>
          <Input
            className={styles.textInput}
            errorText={error && error.type == "identifier" && error?.message}
            {...register("emailAddress", {
              required: true,
              pattern: SIMPLE_REGEX_PATTERN,
            })}
            placeholder="Email address"
          />
          <Input
            className={styles.textInput}
            errorText={error && error.type == "password" && error?.message}
            {...register("password", {
              required: true,
            })}
            placeholder="New password"
            type="password"
          />

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
