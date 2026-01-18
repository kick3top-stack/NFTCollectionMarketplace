import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./redux/store";

import "../src/styles/collection.css";
import "../src/styles/globals.css";
import "../src/styles/layout.css";
import "../src/styles/nft.css";
import "../src/styles/slider.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
