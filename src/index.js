import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import { AppProvider } from "./contexts/useAppContext";
import { EventProvider } from "./contexts/useMouseEvent";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppProvider>
    <EventProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </EventProvider>
  </AppProvider>
);
