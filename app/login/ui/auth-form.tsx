"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { signInAction, signUpAction, type AuthActionState } from "@/app/auth/actions";

const initialState: AuthActionState = { message: "" };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="auth-submit-button mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? `${label}…` : label}
    </button>
  );
}

function FormMessage({ state }: { state: AuthActionState }) {
  if (!state.message) return null;

  return (
    <p
      aria-live="polite"
      className={`auth-form-message rounded-xl px-3 py-2.5 text-xs leading-5 ${
        state.success ? "is-success" : "is-error"
      }`}
      role="status"
    >
      {state.message}
    </p>
  );
}

function Field({
  id,
  label,
  type = "text",
  name = id,
  autoComplete,
  max,
  min,
  minLength,
  maxLength,
  required = true,
  onValueChange,
}: {
  id: string;
  label: string;
  type?: string;
  name?: string;
  autoComplete?: string;
  max?: number;
  min?: number;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  onValueChange?: (value: string) => void;
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div>
      <label className="auth-field-label mb-1.5 block text-xs font-semibold" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          autoComplete={autoComplete}
          className={`auth-field-input min-h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition placeholder:text-[#999999] focus:ring-4 ${
            type === "password" ? "pr-16" : ""
          }`}
          id={id}
          max={max}
          maxLength={maxLength}
          min={min}
          minLength={minLength}
          name={name}
          onChange={(event) => onValueChange?.(event.currentTarget.value)}
          required={required}
          type={type === "password" && passwordVisible ? "text" : type}
        />
        {type === "password" ? (
          <button
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            aria-pressed={passwordVisible}
            className="auth-password-toggle absolute inset-y-0 right-3 text-xs font-semibold"
            onClick={() => setPasswordVisible((visible) => !visible)}
            type="button"
          >
            {passwordVisible ? "Hide" : "Show"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function AuthForm({
  banner,
  initialMode = "signin",
}: {
  banner?: string;
  initialMode?: "signin" | "signup";
}) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [semesterError, setSemesterError] = useState("");

  const [signInState, signIn] = useActionState(signInAction, initialState);
  const [signUpState, signUp] = useActionState(signUpAction, initialState);

  const isSignUp = mode === "signup";
  const state = isSignUp ? signUpState : signInState;

  return (
    <section className="auth-form-card w-full max-w-md rounded-[26px] border p-6 shadow-[0_24px_60px_-42px_rgba(20,47,38,0.45)] sm:p-8">
      <div className="mb-7">
        <p className="auth-form-eyebrow mb-2 text-[10px] font-bold uppercase tracking-[0.17em]">
          Student account
        </p>
        <h1 className="auth-form-heading text-2xl font-semibold tracking-[-0.04em]">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="auth-form-description mt-2 text-sm leading-6">
          {isSignUp
            ? "Set up a new account to keep your student records private."
            : "Sign in to see and manage your student workspace."}
        </p>
      </div>

      {banner ? (
        <p className="auth-form-banner mb-4 rounded-xl px-3 py-2.5 text-xs leading-5">
          {banner}
        </p>
      ) : null}

      <div className="auth-form-tabs mb-5 grid grid-cols-2 rounded-xl p-1">
        <button
          aria-pressed={!isSignUp}
          className={`auth-form-tab min-h-10 rounded-lg text-xs font-semibold transition ${
            !isSignUp ? "bg-white text-[#171717] shadow-sm" : "text-[#737373]"
          }`}
          onClick={() => setMode("signin")}
          type="button"
        >
          Sign in
        </button>

        <button
          aria-pressed={isSignUp}
          className={`auth-form-tab min-h-10 rounded-lg text-xs font-semibold transition ${
            isSignUp ? "bg-white text-[#171717] shadow-sm" : "text-[#737373]"
          }`}
          onClick={() => setMode("signup")}
          type="button"
        >
          Create account
        </button>
      </div>

      <form action={isSignUp ? signUp : signIn} className="space-y-4">
        {isSignUp ? (
          <>
            <Field autoComplete="name" id="fullName" label="Full name" maxLength={100} />

            <Field
              autoComplete="tel"
              id="mobileNumber"
              label="Mobile number"
              maxLength={20}
              type="tel"
            />

            <Field id="branch" label="Branch" maxLength={80} />

            <div>
              <Field
                id="semester"
                label="Semester (1–8)"
                max={8}
                min={1}
                onValueChange={(value) => {
                  setSemesterError(
                    value && Number(value) > 8
                      ? "Semester cannot be more than 8."
                      : "",
                  );
                }}
                type="number"
              />

              {semesterError ? (
                <p
                  aria-live="polite"
                  className="auth-validation-message mt-1.5 text-xs"
                  role="status"
                >
                  {semesterError}
                </p>
              ) : null}
            </div>

            <Field
              autoComplete="email"
              id="email"
              label="Email"
              type="email"
            />
          </>
        ) : (
          <Field
            autoComplete="username"
            id="studentId"
            label="Student ID"
            name="studentId"
            maxLength={50}
          />
        )}

        <Field
          autoComplete={isSignUp ? "new-password" : "current-password"}
          id="password"
          label="Password"
          minLength={isSignUp ? 8 : undefined}
          type="password"
        />

        <FormMessage state={state} />

        <SubmitButton label={isSignUp ? "Create account" : "Sign in"} />
      </form>

      <p className="auth-form-footnote mt-5 text-center text-[10px] leading-5">
        {isSignUp
          ? "Use an email you can access to create your account."
          : "Sign in using your university Student ID and password."}
      </p>
    </section>
  );
}