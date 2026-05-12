import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { configureApiClient } from "./api/client";

configureApiClient();
createRoot(document.getElementById("root")!).render(<App />);
