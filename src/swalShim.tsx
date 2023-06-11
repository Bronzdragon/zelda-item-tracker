import React from "react";
import ReactDOM from "react-dom/client";
import swal from "sweetalert";
import { SwalOptions } from "sweetalert/typings/modules/options";

function swalWithReact(reactNode: JSX.Element, ...other: Partial<SwalOptions>[]) {
  const body = document.createElement("output");

  const root = ReactDOM.createRoot(body);
  root.render(<React.StrictMode>{reactNode}</React.StrictMode>);

  return swal(Object.assign({}, { content: body }, ...other));
}

export default swalWithReact;
