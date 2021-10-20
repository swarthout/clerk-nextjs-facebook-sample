import { useClerk, useSignIn, withClerk } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SIMPLE_REGEX_PATTERN } from "./constants";
import { Input } from "./Input";

export const SignInCard = ({ onSignUp }) => {
  const { register, handleSubmit } = useForm();
  const clerk = useClerk();
  const signIn = useSignIn();
  const router = useRouter();

  const [error, setError] = useState(null);

  const setClerkError = (error) =>
    setError({ type: error.meta.paramName, message: error.longMessage });

  const onSubmit = async (data) => {
    try {
      const signInAttempt = await signIn.create({
        identifier: data.emailAddress,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await clerk.setSession(signInAttempt.createdSessionId);
        router.replace("/");
      }
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
        <div className="col">
        <h3>Log in</h3>
          <div className="row px-4">
            <Input
              className="form-control mt-4"
              errorText={error && error.type == "identifier" && error?.message}
              {...register("emailAddress", {
                required: true,
                pattern: SIMPLE_REGEX_PATTERN,
              })}
              placeholder="Email address"
            />
          </div>
          <div className="row px-4">
            <Input
              className="form-control mt-4"
              errorText={error && error.type == "password" && error?.message}
              {...register("password", {
                required: true,
              })}
              placeholder="New password"
              type="password"
            />
          </div>

          <div className="row px-4">
            <button
              className="btn btn-primary mt-4 mx-auto"
              name="login"
              type="submit"
            >
              Log In
            </button>
          </div>
        </div>
      </form>
      <div className="col">
        <div className="row mt-4">
          <span className="text-center">
            {" "}
            No account?{" "}
            <a onClick={onSignUp} className="text-primary">
              Sign up
            </a>
          </span>
        </div>
      </div>
    </>
  );
};

export const SignInCardWithClerk = withClerk(SignInCard);
