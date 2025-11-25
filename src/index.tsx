import React from "react";
import ReactDOM from "react-dom/client";
import { WaitlistBeta } from "./screens/WaitlistBeta";
import "./index.css";

ReactDOM.createRoot(document.getElementById("app")!).render(
    <React.StrictMode>
        <WaitlistBeta />
    </React.StrictMode>
);
