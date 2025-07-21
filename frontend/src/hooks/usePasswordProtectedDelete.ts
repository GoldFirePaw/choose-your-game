import { useState } from "react";

interface UsePasswordProtectedDeleteResult {
  showPasswordDialog: boolean;
  loading: boolean;
  error: string;
  openPasswordDialog: () => void;
  closePasswordDialog: () => void;
  handlePasswordConfirm: (
    password: string,
    deleteAction: (
      password: string
    ) => Promise<{ success: boolean; error?: string }>
  ) => Promise<void>;
  clearError: () => void;
}

export const usePasswordProtectedDelete =
  (): UsePasswordProtectedDeleteResult => {
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const openPasswordDialog = () => {
      setShowPasswordDialog(true);
      setError("");
    };

    const closePasswordDialog = () => {
      setShowPasswordDialog(false);
      setError("");
      setLoading(false);
    };

    const handlePasswordConfirm = async (
      password: string,
      deleteAction: (
        password: string
      ) => Promise<{ success: boolean; error?: string }>
    ) => {
      setLoading(true);
      setError("");

      try {
        const result = await deleteAction(password);

        if (result.success) {
          closePasswordDialog();
        } else {
          setError(result.error || "Erreur lors de la suppression");
        }
      } catch (error) {
        setError("Erreur inattendue lors de la suppression");
        console.error("Delete error:", error);
      } finally {
        setLoading(false);
      }
    };

    const clearError = () => {
      setError("");
    };

    return {
      showPasswordDialog,
      loading,
      error,
      openPasswordDialog,
      closePasswordDialog,
      handlePasswordConfirm,
      clearError,
    };
  };
