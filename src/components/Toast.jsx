import React from "react";
import "./Toast.css";
import { useApp } from "../context/AppContext";
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from "lucide-react";

export default function Toast() {
  const { toasts, removeToast } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container inline-toast-0">
      {toasts.map((toast) => {
        let toneClass = "toast toast-info";
        let IconComponent = Info;

        if (toast.type === "success") {
          toneClass = "toast toast-success";
          IconComponent = CheckCircle2;
        } else if (toast.type === "warning") {
          toneClass = "toast toast-warning";
          IconComponent = AlertCircle;
        } else if (toast.type === "danger") {
          toneClass = "toast toast-danger";
          IconComponent = AlertCircle;
        } else if (toast.type === "confirmation") {
          toneClass = "toast toast-confirmation";
          IconComponent = Sparkles;
        }

        return (
          <div key={toast.id} className={toneClass}>
            <div className="toast-icon-wrap">
              <IconComponent size={18} />
            </div>

            <div className="inline-toast-1">
              <div className="inline-toast-2">
                {toast.title}
                <Sparkles size={11} />
              </div>
              <div className="inline-toast-3">{toast.message}</div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="inline-toast-4"
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
