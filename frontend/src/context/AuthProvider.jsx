import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { fetchAthleteProfile } from "../api/athlete";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  const login = (jwt) => {
    localStorage.setItem("jwt", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
    setUser(null);
  };

  // Listen for 401s fired by apiFetch and log out immediately
  useEffect(() => {
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, []);

  // Load user when token changes
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const data = await fetchAthleteProfile();
        setUser(data);
      } catch {
        logout();
      }
    };

    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
