import { useState } from "react";
import styles from "./PasswordDialog.module.css";

interface PasswordDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const PasswordDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: PasswordDialogProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Le mot de passe est requis");
      return;
    }
    setError("");
    onConfirm(password);
  };

  const handleCancel = () => {
    setPassword("");
    setError("");
    onCancel();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button
            className={styles.closeButton}
            onClick={handleCancel}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>{message}</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="admin-password" className={styles.label}>
                Mot de passe administrateur:
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={styles.passwordInput}
                placeholder="Entrez le mot de passe"
                disabled={loading}
                autoFocus
              />
              {error && <p className={styles.error}>{error}</p>}
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className={styles.confirmButton}
                disabled={loading}
              >
                {loading ? "Suppression..." : "Confirmer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
