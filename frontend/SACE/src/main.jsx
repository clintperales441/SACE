import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// 1. Import the GoogleOAuthProvider
import { GoogleOAuthProvider } from '@react-oauth/google';

// 2. Define your Google Client ID
// NOTE: Best practice is to load this from an environment variable (e.g., in a .env file).
// Replace 'YOUR_GOOGLE_CLIENT_ID_HERE' with the ID you obtained from the Google Cloud Console.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '742815630040-7o1redrna3nfr61giflrhch9erinf8a2.apps.googleusercontent.com'; 

createRoot(document.getElementById("root")).render(
  // 3. Wrap your App component with the Provider
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);