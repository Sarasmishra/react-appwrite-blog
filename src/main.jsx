import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { getThemeState, applyTheme } from "./utils/theme";

const { mode, color } = getThemeState();
applyTheme(mode, color);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#111",
            color: "#fff",
          },
        }}
      />
      <App />
    </>
  </Provider>
);
