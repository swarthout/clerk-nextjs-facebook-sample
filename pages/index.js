import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Select from "react-select";

// Main component using <SignedIn> & <SignedOut>.
//
// The SignedIn and SignedOut components are used to control rendering depending
// on whether or not a visitor is signed in.
//
// https://docs.clerk.dev/frontend/react/signedin-and-signedout
const Main = () => {
  const [show, setShow] = useState(false);
  return (
    <main className={styles.main}>
      <div className={styles.introHeader}>
        <h1 className={styles.logo}> Clerkbook </h1>
        <h3> Connect with friends and the world around you on Clerkbook. </h3>
      </div>
      <div className={styles.loginCol}>
        <div className={styles.loginCard}>
          <input
            type="text"
            className={styles.textInput}
            name="email"
            id="email"
            placeholder="Email or Phone Number"
            aria-label="Email or Phone Number"
          ></input>

          <input
            type="password"
            className={styles.textInput}
            name="pass"
            id="pass"
            placeholder="Password"
            aria-label="Password"
          ></input>

          <button value="1" name="login" type="submit">
            Log In
          </button>
          <div className={styles.forgotPassword}>
            <a>Forgot password?</a>
          </div>
          <div className={styles.divider}></div>

          <button
            value="1"
            name="create_account"
            type="submit"
            onClick={() => setShow(true)}
          >
            Create New Account
          </button>
        </div>
        <div className={styles.createPage}>
          Create a Page for a celebrity, band, or business
        </div>
      </div>
      <SignUpModal show={show} onClose={() => setShow(false)} />
    </main>
  );
};

const SignUpModal = (props) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((month) => ({ value: month, label: month }));
  const days = [...Array(31).keys()]
    .map((i) => i + 1)
    .map((day) => ({ value: day, label: day }));
  const years = [...Array(100).keys()]
    .reverse()
    .map((i) => i + 1921)
    .map((year) => ({ value: year, label: year }));

  if (!props.show) {
    return null;
  }
  return (
    <div className={styles.modal} onClick={props.onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Sign up</h2>
          <p>It's quick and easy</p>
          <a
            onClick={props.onClose}
            className={styles.closeButton}
            tabindex="0"
            role="button"
          >
            close
          </a>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.signUpForm}>
            <div className={styles.nameInput}>
              <input
                type="text"
                className={styles.textInputName}
                name="firstName"
                id="firstName"
                placeholder="First name"
                aria-label="First name"
              ></input>
              <input
                type="text"
                className={styles.textInputName}
                name="lastName"
                id="lastName"
                placeholder="Last name"
                aria-label="Last name"
              ></input>
            </div>
            <input
              type="text"
              className={styles.textInput}
              name="email"
              id="email"
              placeholder="Email"
              aria-label="Email"
            ></input>
            <input
              type="text"
              className={styles.textInput}
              name="email"
              id="email"
              placeholder="Last name"
              aria-label="Last name"
            ></input>
            <div>Birthday</div>
            <div className={styles.birthdayInput}>
              <Select options={months} className={styles.selectInput} />
              <Select options={days} className={styles.selectInput} />
              <Select options={years} className={styles.selectInput} />
            </div>
            <div>Gender</div>
            <div>
              <div className={styles.genderInput}>
                <span className={styles.genderSelect}>
                  <label>
                    Female
                  <input type="radio" name="gender" value="female" />
                </label>
                </span>
                
                <span className={styles.genderSelect}>
                  <label>
                    Male
                  <input type="radio" name="gender" value="male" />
                </label>
                </span>
                <span className={styles.genderSelect}>
                  <label>
                    Custom
                  <input type="radio" name="gender" value="custom" />
                </label>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={props.onClose}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

// Footer component
const Footer = () => (
  <footer className={styles.footer}>
    {/* Powered by{' '}
    <a href="https://clerk.dev" target="_blank">
      <img src="/clerk.svg" alt="Clerk.dev" className={styles.logo} />
    </a>
    +
    <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
      <img src="/nextjs.svg" alt="Next.js" className={styles.logo} />
    </a> */}
    Powered by Clerk
  </footer>
);

const Home = () => (
  <div className={styles.container}>
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
    </Head>
    <Main />
    <Footer />
  </div>
);

export default Home;
