// JWT ka payload decode karke expiry (ms) nikalta hai. Verify nahi karta, wo backend ka kaam hai.
export const getTokenExpiry = (token: string): number | null => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};
