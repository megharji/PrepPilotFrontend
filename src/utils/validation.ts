// Backend ke validation rules jaise hi, taaki galat request jaaye hi nahi
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;

export const validateName = (name: string) => (name.trim() ? "" : "Name is required");

export const validateEmail = (email: string) => {
  if (!email.trim()) return "Email is required";
  return EMAIL_REGEX.test(email.trim()) ? "" : "Enter a valid email";
};

export const validatePassword = (password: string) => {
  if (!password) return "Password is required";
  return password.length >= MIN_PASSWORD_LENGTH
    ? ""
    : `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
};

// 0 se 4 tak score, sirf UI hint ke liye
export const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Too short", "Weak", "Okay", "Good", "Strong"];
  return { score, label: labels[score] };
};
