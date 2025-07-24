// pages/_app.js
import { Buffer } from "buffer";
import process from "process";

import "@near-wallet-selector/modal-ui/styles.css";
import "../styles/globals.css";

// polyfills for browser compatibility
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
  window.process = process;
  window.global = window;
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
