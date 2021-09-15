import React, { useState } from "react";

import styles from "../styles/Home.module.css";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { useClerk, useSignUp, withClerk } from "@clerk/clerk-react";

const BirthdaySelect = ({name, options, control, className}) => {
 return <Controller
 control={control}
 name={name}
 render={({field: { onChange, value, name, ref }}) => (
     <Select
         inputRef={ref}
         options={options}
         value={options.find(c => c.value === value)}
         className={className}
         onChange={val => onChange(val.value)}
     />
 )}
/>
}

export const SignUpModal = (props) => {
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
  
    const { register, handleSubmit, control, watch, getValues } = useForm();
    const onSubmit = data => props.onSubmit(data);

    const watchGender = watch("gender", false)

    const [formStep, setFormStep] = useState("EMAIL");

    const signUp = useSignUp();
    const clerk = useClerk();


  const emailVerification = async function () {
    try {
      setError(null);
      await sendClerkOtp();
      setFormStep("CODE");
    } catch (err) {
      if (err.errors) {
        setClerkError(err.errors[0], "email");
      } else {
        throw err;
      }
    }
  };

  const verifyOtp = async function () {
    const otp = getValues("code");
    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code: otp,
    });
    if (signUpAttempt.verifications.emailAddress.status === "verified") {
        setError(null);
        setFormStep("COMPLETE");
    }
  };

  const sendClerkOtp = async function () {
    const emailAddress = getValues("email");
    const signUpAttempt = await signUp.create({
      emailAddress,
    });
    await signUpAttempt.prepareEmailAddressVerification();
  };

  const completeRegistration = async () => {
    const { username, firstName, lastName, month, day, year, gender, pronouns, customGenderText } = getValues();
    const signUpAttempt = await signUp.update({
      username,
      firstName,
      lastName,
      unsafeMetadata: {
          "birthday": {
              "month": month,
              "day": day,
              "year": year,
              "gender": gender,
              "pronouns": pronouns,
              "customGenderText": customGenderText
          }
      }
    });
    if (signUpAttempt.status === "complete") {
      await clerk.setSession(signUpAttempt.createdSessionId);
      router.replace("/");
    }
  };
  
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
              role="button"
            >
              close
            </a>
          </div>
          {formStep === "EMAIL" && (
          <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.modalBody}>
            <div className={styles.signUpForm}>
              <div className={styles.nameInput}>
                <input
                  type="text"
                  className={styles.textInputName}
                  placeholder="First name"
                  aria-label="First name"
                  {...register("firstName")} 
                ></input>
                <input
                  type="text"
                  className={styles.textInputName}
                  placeholder="Last name"
                  aria-label="Last name"
                  {...register("lastName")} 
                ></input>
              </div>
              <input
                type="text"
                className={styles.textInput}
                placeholder="Email"
                aria-label="Email"
                {...register("email")} 
              ></input>
              <input
                type="password"
                className={styles.textInput}
                placeholder="New password"
                aria-label="New password"
                {...register("password")} 
              ></input>
              <div>Birthday</div>
              <div className={styles.birthdayInput}>
              <BirthdaySelect options={months} name="month" control={control} className={styles.selectInput}/>
              <BirthdaySelect options={days} name="day" control={control} className={styles.selectInput}/>
              <BirthdaySelect options={years} name="year" control={control} className={styles.selectInput}/>
              </div>
              <div>Gender</div>
              <div>
                <div className={styles.genderInput}>
                  <span className={styles.genderSelect}>
                    <label>
                      Female
                    <input type="radio" name="gender" value="female" {...register("gender")}/>
                  </label>
                  </span>
                  
                  <span className={styles.genderSelect}>
                    <label>
                      Male
                    <input type="radio" name="gender" value="male" {...register("gender")}/>
                  </label>
                  </span>
                  <span className={styles.genderSelect}>
                    <label>
                      Custom
                    <input type="radio" name="gender" value="custom" {...register("gender")}/>
                  </label>
                  </span>
                </div>
              </div>
              {
                  watchGender == "custom" && (
                      <>
                    <select {...register("pronouns")} className={styles.textInput}>
                    <option value="she">She: "Wish her a happy birthday!"</option>
                    <option value="he">He: "Wish him a happy birthday!"</option>
                    <option value="they">They: "Wish them a happy birthday!"</option>
                  </select>

                    <input
                    type="text"
                    className={styles.textInput}
                    placeholder="Gender (optional)"
                    aria-label="Gender (optional)"
                    {...register("customGenderText")} 
                    ></input>
                    </>
                  )
              }
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="submit">Sign Up</button>
          </div>
          </form>
          )}

{formStep === "CODE" && (
    <>
    </>
)}
        </div>
      </div>
    );
  };