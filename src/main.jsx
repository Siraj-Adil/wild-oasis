import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ui/ErrorFallback.jsx";

createRoot(document.getElementById("root")).render(
    // react-error-boundary only catches error that happens only due to React Rendering
    // Other errors due to eventHandlers, asynchronous code, useEffects will not be caught by react-error-boundary
    <StrictMode>
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => window.location.replace("/")}
        >
            <App />
        </ErrorBoundary>
    </StrictMode>
);
