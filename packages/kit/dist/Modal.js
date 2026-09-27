// src/Modal/Modal.jsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Modal({
  id,
  trigger,
  children,
  className = "",
  triggerClassName = "",
  triggerProps = {}
}) {
  if (!id) {
    throw new Error("Modal requires an id prop");
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        commandfor: id,
        command: "show-modal",
        className: triggerClassName,
        ...triggerProps,
        children: trigger
      }
    ),
    /* @__PURE__ */ jsxs(
      "dialog",
      {
        id,
        className,
        closedby: "any",
        children: [
          /* @__PURE__ */ jsx("div", { className: "modal-content", children }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              commandfor: id,
              command: "close",
              className: "modal-close",
              "aria-label": "Close",
              children: "\xD7"
            }
          )
        ]
      }
    )
  ] });
}
export {
  Modal
};
//# sourceMappingURL=Modal.js.map