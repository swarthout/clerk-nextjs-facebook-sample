import React, { useState } from "react";

import styles from "./SignupModal.module.css";
import { useForm } from "react-hook-form";
import { useClerk, useSignUp, withClerk } from "@clerk/clerk-react";
import { Input } from "./Input";
import { useRouter } from "next/router";
import { BirthdaySelect } from "./BirthdaySelect";
import { MONTHS, DAYS, YEARS, SIMPLE_REGEX_PATTERN } from "./constants";

const SignUpModal = (props) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    trigger,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm({ mode: "onChange" });
  const onSubmit = (data) => console.log(data);

  const [error, setError] = useState(null);
  const setClerkError = (error) =>
    setError({ type: error.meta.paramName, message: error.longMessage });

  const router = useRouter();

  const watchGender = watch("gender", false);

  const [formStep, setFormStep] = useState("EMAIL");

  const signUp = useSignUp();
  const clerk = useClerk();

  const verifyOtp = async function () {
    const otp = getValues("code");
    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code: otp,
    });
    if (signUpAttempt.verifications.emailAddress.status === "verified") {
      setError(null);
      await clerk.setSession(signUpAttempt.createdSessionId);
      router.replace("/");
    }
  };

  const startRegistration = async () => {
    const {
      username,
      firstName,
      lastName,
      password,
      emailAddress,
      month,
      day,
      year,
      gender,
      pronouns,
      customGenderText,
    } = getValues();

    try {
      const signUpAttempt = await signUp.create({
        username,
        firstName,
        lastName,
        emailAddress,
        password,
        unsafeMetadata: {
          birthday: {
            month: month,
            day: day,
            year: year,
          },
          gender: {
            gender: gender,
            pronouns: pronouns,
            customGenderText: customGenderText,
          },
        },
      });
      await signUpAttempt.prepareEmailAddressVerification();
      setFormStep("CODE");
    } catch (err) {
      if (err.errors) {
        setClerkError(err.errors[0]);
      } else {
        throw err;
      }
    }
  };

  if (!props.show) {
    return null;
  }
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Sign up</h2>
          <p>It's quick and easy</p>
          <a
            onClick={props.onClose}
            className={styles.closeButton}
            role="button"
          ></a>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.modalBody}>
            {formStep === "EMAIL" && (
              <>
                <div className={styles.signUpForm}>
                  <div className={styles.nameInput}>
                    <Input
                      className={styles.textInputName}
                      {...register("firstName", {
                        required: true,
                        minLength: 2,
                      })}
                      placeholder="First name"
                    />
                    <Input
                      className={styles.textInputName}
                      {...register("lastName", {
                        required: true,
                        minLength: 2,
                      })}
                      placeholder="Last name"
                    />
                  </div>
                  <Input
                    className={styles.textInput}
                    errorText={error && error.type == "emailAddress" && error?.message}
                    {...register("emailAddress", {
                      required: true,
                      pattern: SIMPLE_REGEX_PATTERN,
                    })}
                    placeholder="Email address"
                  />
                  <Input
                    className={styles.textInput}
                    errorText={
                      error && error.type == "password" && error?.message
                    }
                    {...register("password", {
                      required: true,
                      minLength: 8,
                    })}
                    placeholder="New password"
                    type="password"
                  />
                  <div className={styles.label}>Birthday</div>
                  <div className={styles.birthdayInput}>
                    <BirthdaySelect
                      options={MONTHS}
                      name="month"
                      control={control}
                      className={styles.selectInput}
                    />
                    <BirthdaySelect
                      options={DAYS}
                      name="day"
                      control={control}
                      className={styles.selectInput}
                    />
                    <BirthdaySelect
                      options={YEARS}
                      name="year"
                      control={control}
                      className={styles.selectInput}
                    />
                  </div>

                  <div>
                    <div className={styles.label}>Gender</div>
                    <div className={styles.genderInput}>
                      <span
                        className={styles.genderSelect}
                        onClick={() =>
                          setValue("gender", "female", { shouldValidate: true })
                        }
                      >
                        <label>Female</label>
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          {...register("gender", { required: true })}
                        />
                      </span>

                      <span
                        className={styles.genderSelect}
                        onClick={() =>
                          setValue("gender", "male", { shouldValidate: true })
                        }
                      >
                        <label>Male</label>
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          {...register("gender", { required: true })}
                        />
                      </span>
                      <span
                        className={styles.genderSelect}
                        onClick={() =>
                          setValue("gender", "custom", { shouldValidate: true })
                        }
                      >
                        <label>Custom</label>
                        <input
                          type="radio"
                          name="gender"
                          value="custom"
                          {...register("gender", { required: true })}
                        />
                      </span>
                    </div>
                  </div>
                  {watchGender == "custom" && (
                    <>
                      <select
                        {...register("pronouns")}
                        className={styles.pronounSelect}
                      >
                        <option value="she">
                          She: "Wish her a happy birthday!"
                        </option>
                        <option value="he">
                          He: "Wish him a happy birthday!"
                        </option>
                        <option value="they">
                          They: "Wish them a happy birthday!"
                        </option>
                      </select>

                      <Input
                        className={styles.textInput}
                        {...register("customGenderText", {
                          required: false,
                          minLength: 2,
                        })}
                        placeholder="Gender (optional)"
                      />
                    </>
                  )}
                </div>
                <div className={styles.modalFooter}>
                  <button
                    disabled={!isDirty || !isValid}
                    onClick={async () => await startRegistration()}
                    onKeyPress={async () => await startRegistration()}
                    className={styles.signUpButton}
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}

            {formStep === "CODE" && (
              <>
                <div className={styles.signUpForm}>
                  <h3>Enter the confirmation code</h3>
                  <span>
                    A 6-digit code was just sent to <br />
                    {getValues("email")}
                  </span>
                  <Input
                    className={styles.textInput}
                    {...register("code", {
                      required: true,
                      maxLength: 6,
                      minLength: 6,
                    })}
                    onPaste={async () => await trigger("code")}
                  />
                  <div className={styles.modalFooter}>
                    <button
                      type="button"
                      onClick={async () => await verifyOtp()}
                      onKeyPress={async () => await verifyOtp()}
                      className={styles.signUpButton}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export const SignUpModalWithClerk = withClerk(SignUpModal);
