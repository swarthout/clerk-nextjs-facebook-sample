import React from "react";
import styles from "../styles/Home.module.css";
import { useClerk, useUser } from "@clerk/clerk-react";

export const Profile = () => {
  const user = useUser();
  const clerk = useClerk();
  const birthday = user.unsafeMetadata.birthday;
  const birthdayString = birthday.month + " " + birthday.day + ", " + birthday.year;
  return (
    <div className={styles.home}>
      <h1 className={styles.logo}>Welcome to Clerkbook!</h1>
      <h2>{user.fullName}</h2>
      <h3>Birthday: {birthdayString}</h3>
      <button onClick={() => clerk.signOut()}>Sign out</button>
    </div>
  );
};
