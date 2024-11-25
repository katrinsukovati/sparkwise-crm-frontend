import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider
    clientId={GOOGLE_CLIENT_ID}
    scopes="https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.events"
  >
    <App />
  </GoogleOAuthProvider>
);
