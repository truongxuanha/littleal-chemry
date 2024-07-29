import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
import { AppProvider } from "./contexts/useAppContext";
import { EventProvider } from "./contexts/useMouseEvent";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <AppProvider>
    <EventProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </EventProvider>
  </AppProvider>
);
