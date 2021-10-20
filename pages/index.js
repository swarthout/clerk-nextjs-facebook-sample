import { withClerk } from "@clerk/clerk-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Head from "next/head";
import React, { useState } from "react";
import { Profile } from "../components/Profile";
import { SignInCardWithClerk } from "../components/SignInCard";
import { SignUpCardWithClerk } from "../components/SignUpCard";
import styles from "../styles/Home.module.css";

// Main component using <SignedIn> & <SignedOut>.
//
// The SignedIn and SignedOut components are used to control rendering depending
// on whether or not a visitor is signed in.
//
// https://docs.clerk.dev/frontend/react/signedin-and-signedout
const Main = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  return (
    <>
      <SignedOut>
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">Clerk Example</span>
          </div>
        </nav>
        <div className="container h-100">
          <div className="d-flex flex-column  align-items-center justify-content-center h-100">
            <div className="card px-4 py-4 w-50 shadow-sm">
              {showSignUp ? (
                <SignUpCardWithClerk onSignIn={() => setShowSignUp(false)} />
              ) : (
                <SignInCardWithClerk onSignUp={() => setShowSignUp(true)} />
              )}
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <Profile />
      </SignedIn>
    </>
  );
};

// Footer component
const Footer = () => (
  <footer className={styles.footer}>
    Powered by{" "}
    <a href="https://clerk.dev" target="_blank">
      <img src="/clerk.svg" alt="Clerk.dev" className={styles.logo} />
    </a>
    +
    <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
      <img src="/nextjs.svg" alt="Next.js" className={styles.logo} />
    </a>
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
