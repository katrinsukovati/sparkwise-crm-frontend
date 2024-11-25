import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FaGoogle } from "react-icons/fa";

function LoginPage({ onLoginSuccess }) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Login successful! Token:", tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }
      );
      console.log("User Info:", userInfo.data);

      // Pass the access token to the parent or store it globally
      onLoginSuccess(tokenResponse.access_token);
    },
    onError: () => {
      console.error("Login failed");
    },
    scope:
      "https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.events",
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="login-container text-center bg-white p-5 rounded shadow d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4">Welcome to SparkWise CRM</h1>
        <button
          className="btn btn-primary btn-lg d-flex align-items-center gap-2"
          onClick={login}
        >
          <FaGoogle size={24} />
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
