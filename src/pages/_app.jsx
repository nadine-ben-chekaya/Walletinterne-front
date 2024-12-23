import { AuthProvider } from "../context/AuthContext";
import "../styles.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
