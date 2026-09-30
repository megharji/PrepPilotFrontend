import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";
import AuthLayout from "../layout/AuthLayout";
import TextField from "../components/TextField";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectLogin } from "../redux/selector";
import { loginRequest, resetLoginState } from "../redux/reducers/Auth/loginReducer";
import { validateEmail } from "../utils/validation";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  // Backend ka error/success snackbar me aata hai (loginSaga)
  const { loading } = useAppSelector(selectLogin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Page chhodte waqt purana error saaf
  useEffect(() => {
    return () => {
      dispatch(resetLoginState());
    };
  }, [dispatch]);

  const errors = {
    email: validateEmail(email),
    password: password ? "" : "Password is required",
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.email || errors.password || loading) return;

    dispatch(loginRequest({ email: email.trim().toLowerCase(), password }));
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your interview prep.">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<FiMail />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={submitted ? errors.email : ""}
          autoFocus
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          icon={<FiLock />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={submitted ? errors.password : ""}
        />

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" /> Logging in…
            </>
          ) : (
            <>
              Log in <FiArrowRight />
            </>
          )}
        </button>
      </form>

      <p className="auth__switch">
        New to PrepPilot? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
