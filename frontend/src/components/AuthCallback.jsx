import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();
  const hasRedirected = useRef(false); // track if redirect already happened

  useEffect(() => {
    if (hasRedirected.current) return; // skip if already ran
    hasRedirected.current = true; // mark as ran

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token); // save token
      navigate("/dashboard"); // go to protected page
    } else {
      navigate("/"); // fallback to home
    }
  }, [navigate]);

  return <div>Logging in...</div>;
};

export default AuthCallback;
