import * as React from "react";

import { createRoot } from "react-dom/client";
import Page from "./app/v2/page";

const check = () => {
  if (document.readyState !== "complete") return;

  document.removeEventListener("readystatechange", check);

  createRoot(document.body).render(
    // FIXME: Disabled: incompatible with GeoMap pin tracking
    // <React.StrictMode>
    <Page />
    // </React.StrictMode>,
  );
};

document.addEventListener("readystatechange", check);
check();
