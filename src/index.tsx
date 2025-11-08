import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WaitlistBeta } from "./screens/WaitlistBeta";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <WaitlistBeta />
  </StrictMode>,
);
