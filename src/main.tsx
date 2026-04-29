
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

// 🔥 Fix for sockjs-client (TypeScript safe)
declare global {
  interface Window {
    global: Window;
  }
}

window.global = window;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);