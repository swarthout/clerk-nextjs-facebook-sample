import { useClerk, useSignUp, withClerk } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BirthdaySelect } from "./BirthdaySelect";
import { DAYS, MONTHS, SIMPLE_REGEX_PATTERN, YEARS } from "./constants";
import { Input } from "./Input";

const SignUpCard = ({ onSignIn }) => {
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
  const setClerkError = (error) => {
    setError({ type: error.meta.paramName, message: error.longMessage });
  };

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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {formStep === "EMAIL" && (
          <>
            <div className="col">
              <h3>Sign up</h3>
              <div className="row">
                <Input
                  className="form-control mt-4 col mx-2"
                  {...register("firstName", {
                    required: true,
                    minLength: 2,
                  })}
                  placeholder="First name"
                />
                <Input
                  className="form-control mt-4 col mx-2"
                  {...register("lastName", {
                    required: true,
                    minLength: 2,
                  })}
                  placeholder="Last name"
                />
              </div>
              <div className="row">
                <Input
                  className="form-control mt-4 mx-2 col"
                  errorText={
                    error && error.type == "email_address" && error?.message
                  }
                  {...register("emailAddress", {
                    required: true,
                    pattern: SIMPLE_REGEX_PATTERN,
                  })}
                  placeholder="Email address"
                />
              </div>
              <div className="row">
                <Input
                  className="form-control mt-4 mx-2 col"
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
              </div>
              <div className="row my-2 ms-1">Birthday</div>
              <div className="row">
                <BirthdaySelect
                  options={MONTHS}
                  name="month"
                  control={control}
                  className="col"
                />
                <BirthdaySelect
                  options={DAYS}
                  name="day"
                  control={control}
                  className="col"
                />
                <BirthdaySelect
                  options={YEARS}
                  name="year"
                  control={control}
                  className="col"
                />
              </div>

              <div>
                <div className="row my-2 ms-1">Gender</div>
                <div className="row">
                  <span
                    className="col text-center border rounded mx-2 py-2"
                    onClick={() =>
                      setValue("gender", "female", { shouldValidate: true })
                    }
                  >
                    <label className="mx-2">Female</label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      {...register("gender", { required: true })}
                    />
                  </span>

                  <span
                    className="col text-center border rounded mx-2 py-2"
                    onClick={() =>
                      setValue("gender", "male", { shouldValidate: true })
                    }
                  >
                    <label className="mx-2">Male</label>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      {...register("gender", { required: true })}
                    />
                  </span>
                  <span
                    className="col text-center border rounded mx-2 py-2"
                    onClick={() =>
                      setValue("gender", "custom", { shouldValidate: true })
                    }
                  >
                    <label className="mx-2">Custom</label>
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
                  <div className="row">
                    <select
                      {...register("pronouns")}
                      className="mt-4 col mx-2 form-control col"
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
                  </div>

                  <div className="row">
                    <Input
                      className="mt-4 col mx-2 form-control col"
                      {...register("customGenderText", {
                        required: false,
                        minLength: 2,
                      })}
                      placeholder="Gender (optional)"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="row">
              <button
                disabled={!isDirty || !isValid}
                onClick={async () => await startRegistration()}
                onKeyPress={async () => await startRegistration()}
                className="btn btn-primary mt-4 mx-auto w-50"
                name="login"
              >
                Sign Up
              </button>
            </div>
          </>
        )}

        {formStep === "CODE" && (
          <>
            <div>
              <h3>Enter the confirmation code</h3>
              <span className="row ms-1">
                A 6-digit code was just sent to <br />
                {getValues("email")}
              </span>
              <div className="row">
                <Input
                  className="mt-4 col mx-2 form-control col"
                  {...register("code", {
                    required: true,
                    maxLength: 6,
                    minLength: 6,
                  })}
                  onPaste={async () => await trigger("code")}
                />
              </div>

              <div className="row">
                <button
                  type="button"
                  onClick={async () => await verifyOtp()}
                  onKeyPress={async () => await verifyOtp()}
                  className="btn btn-primary mt-4 mx-auto w-50"
                >
                  Continue
                </button>
              </div>
            </div>
          </>
        )}
      </form>
      <div className="col">
        <div className="row mt-4">
          <span className="text-center">
            {" "}
            Already have an account?{" "}
            <a onClick={onSignIn} className="text-primary">
              Sign in
            </a>
          </span>
        </div>
      </div>
    </>
  );
};

export const SignUpCardWithClerk = withClerk(SignUpCard);
