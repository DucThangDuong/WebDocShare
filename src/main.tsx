import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SignalRProvider } from "./utils/signalRprovider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <SignalRProvider>
        <App />
      </SignalRProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
