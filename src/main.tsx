import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.tsx";
import store, { persistor } from "./redux/store";
import "./styles/index.css";
import "./styles/demo.css";
import "./styles/app.css";
import "./styles/setup.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      {/* Persisted login state load hone tak UI render nahi hota, warna ek pal ke liye login page dikhta */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
