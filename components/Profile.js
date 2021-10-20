import React from "react";
// import styles from "../styles/Home.module.css";
import { useClerk, useUser } from "@clerk/clerk-react";

export const Profile = () => {
  const user = useUser();
  const clerk = useClerk();
  const birthday = user.unsafeMetadata.birthday;
  const birthdayString =
    birthday.month + " " + birthday.day + ", " + birthday.year;
  return (
    <div className="container h-100">
      <div className="d-flex flex-column  align-items-center justify-content-center h-100">
        <h1 className="">Welcome to Clerk!</h1>
        <h2 className="">{user.fullName}</h2>
        <h3 className="">Birthday: {birthdayString}</h3>
        <button className="btn btn-primary mt-4" onClick={() => clerk.signOut()}>
          Sign out
        </button>
      </div>
    </div>
  );
};
