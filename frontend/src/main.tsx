import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ReactLenis } from "lenis/react";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactLenis root options={{ smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 2 }}>
      <App />
    </ReactLenis>
  </StrictMode>
);
