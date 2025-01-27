import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FaGoogle } from "react-icons/fa";
import "./LoginPage.scss";
import logo from "../../assets/logo/sparkwise-logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginPage({ onLoginSuccess }) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }
      );
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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light login-container">
      <div className="text-center bg-white p-5 rounded shadow">
        <span>
          <img className="login-container__logo" src={logo} alt="" />
        </span>
        <h1 className="mb-4">SparkWise CRM</h1>
        <button className="btn btn-primary btn-lg " onClick={login}>
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
