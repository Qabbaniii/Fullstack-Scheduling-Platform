import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    try {
      const token = localStorage.getItem("schedulr_token");
      const user = localStorage.getItem("schedulr_user");

      return {
        token: token || null,
        user: user ? JSON.parse(user) : null,
      };
    } catch {
      return {
        token: null,
        user: null,
      };
    }
  });

  const login = (token, user) => {
    localStorage.setItem("schedulr_token", token);
    localStorage.setItem("schedulr_user", JSON.stringify(user));
    setAuthState({ token, user });
  };

  const logout = () => {
    localStorage.removeItem("schedulr_token");
    localStorage.removeItem("schedulr_user");
    setAuthState({ token: null, user: null });
  };

  const value = useMemo(
    () => ({
      token: authState.token,
      user: authState.user,
      login,
      logout,
    }),
    [authState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
