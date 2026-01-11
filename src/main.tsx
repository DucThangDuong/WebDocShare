import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SignalRProvider } from "./utils/signalRprovider";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SignalRProvider>
      <App />
    </SignalRProvider>
  </React.StrictMode>
);
