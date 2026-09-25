import React from "react";
import "./ConfirmDialog.css";
import { useApp } from "../context/AppContext";

export default function ConfirmDialog() {
  const { confirmDialog, hideConfirmDialog } = useApp();

  if (!confirmDialog) return null;

  const handleConfirm = () => {
    hideConfirmDialog();
    if (typeof confirmDialog.onConfirm === "function") {
      confirmDialog.onConfirm();
    }
  };

  const handleCancel = () => {
    hideConfirmDialog();
    if (typeof confirmDialog.onCancel === "function") {
      confirmDialog.onCancel();
    }
  };

  return (
    <div className="confirm-dialog-overlay" onClick={handleCancel}>
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div id="confirm-dialog-title" className="confirm-dialog-title">
          {confirmDialog.title || "Confirm"}
        </div>

        <div className="confirm-dialog-message">
          {confirmDialog.message || "Are you sure?"}
        </div>

        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="confirm-dialog-button confirm-dialog-button-primary"
            onClick={handleConfirm}
          >
            {confirmDialog.confirmText || "OK"}
          </button>

          <button
            type="button"
            className="confirm-dialog-button confirm-dialog-button-secondary"
            onClick={handleCancel}
          >
            {confirmDialog.cancelText || "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
