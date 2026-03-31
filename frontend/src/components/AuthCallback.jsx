import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token); // update React state + localStorage
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate, login]);

  return <div>Logging in...</div>;
};

export default AuthCallback;
