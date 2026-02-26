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
    console.log("logging out");

    localStorage.removeItem("jwt");
    setToken(null);
    setUser(null);
  };

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
