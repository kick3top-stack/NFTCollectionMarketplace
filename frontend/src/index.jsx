import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "../src/styles/globals.css";
import "../src/styles/layout.css";
import "../src/styles/nft.css";
import "../src/styles/collection.css";
import "../src/styles/slider.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
