import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiLock, FiMail, FiUser } from "react-icons/fi";
import AuthLayout from "../layout/AuthLayout";
import TextField from "../components/TextField";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectSignup } from "../redux/selector";
import { resetSignupState, signupRequest } from "../redux/reducers/Auth/signupReducer";
import { getPasswordStrength, validateEmail, validateName, validatePassword } from "../utils/validation";

const SignupPage = () => {
  const dispatch = useAppDispatch();
  // Register hote hi saga login bhi kar deta hai; PublicOnlyRoute khud dashboard pe le jaata hai
  // Backend ka error/success snackbar me aata hai (signupSaga)
  const { loading } = useAppSelector(selectSignup);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(resetSignupState());
    };
  }, [dispatch]);

  const errors = {
    name: validateName(form.name),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
  };
  const strength = getPasswordStrength(form.password);

  const update = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.name || errors.email || errors.password || loading) return;

    dispatch(
      signupRequest({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      }),
    );
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start preparing for your dream role today.">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          icon={<FiUser />}
          value={form.name}
          onChange={update("name")}
          error={submitted ? errors.name : ""}
          autoFocus
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<FiMail />}
          value={form.email}
          onChange={update("email")}
          error={submitted ? errors.email : ""}
        />
        <div>
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            icon={<FiLock />}
            value={form.password}
            onChange={update("password")}
            error={submitted ? errors.password : ""}
          />
          {form.password && (
            <div className={`strength strength--${strength.score}`} aria-live="polite">
              <div className="strength__bars">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={i <= strength.score ? "is-on" : ""} />
                ))}
              </div>
              <span className="strength__label">{strength.label}</span>
            </div>
          )}
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" /> Creating account…
            </>
          ) : (
            <>
              Create account <FiArrowRight />
            </>
          )}
        </button>
      </form>

      <p className="auth__switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
