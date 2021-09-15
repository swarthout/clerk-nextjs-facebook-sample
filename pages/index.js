import React, { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { SignUpModalWithClerk } from "../components/SignupModal";
import { UserButton, useSignIn, withClerk, useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/router";

// Main component using <SignedIn> & <SignedOut>.
//
// The SignedIn and SignedOut components are used to control rendering depending
// on whether or not a visitor is signed in.
//
// https://docs.clerk.dev/frontend/react/signedin-and-signedout
const Main = () => {
  const [show, setShow] = useState(false);
  const { register, handleSubmit } = useForm();
  const clerk = useClerk();
  const signIn = useSignIn();
  const router = useRouter();

  const onSubmit = async (data) => {
    const signInAttempt = await signIn.create({
      identifier: data.email,
      password: data.password,
    });

    if (signInAttempt.status === "complete") {
      await clerk.setSession(signInAttempt.createdSessionId);
      router.replace("/");
    }
  };

  return (
    <>
      <SignedOut>
        <div className={styles.main}>
          <div className={styles.introHeader}>
            <h1 className={styles.logo}> Clerkbook </h1>
            <h3>Connect with friends and the world around you on Clerkbook.</h3>
          </div>
          <div className={styles.loginCol}>
            <div className={styles.loginCard}>
              <form onSubmit={handleSubmit(onSubmit)}>
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

                  <button name="login" type="submit">
                    Log In
                  </button>
                </div>
              </form>
              <div className={styles.lowerCardInputs}>
                <div className={styles.forgotPassword}>
                  <a>Forgot password?</a>
                </div>
                <div className={styles.divider}></div>

                <button name="create_account" onClick={() => setShow(true)}>
                  Create New Account
                </button>
              </div>
            </div>

            <div className={styles.createPage}>
              Create a Page for a celebrity, band, or business
            </div>
          </div>
          <SignUpModalWithClerk
            show={show}
            onClose={() => setShow(false)}
            onSubmit={(data) => {
              console.log(data);
              setShow(false);
            }}
          />{" "}
        </div>
      </SignedOut>
      <SignedIn>
        <div>Signed in!</div>
        <UserButton afterSignOutAllUrl="/" />
      </SignedIn>
    </>
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

export default withClerk(Home);
