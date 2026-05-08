import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { ToastItem, ToastType } from "../components/ui/Toast";
import { ToastContainer } from "../components/ui/ToastContainer";

type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = crypto.randomUUID();

      setToasts((current) => [
        ...current,
        {
          id,
          type,
          message,
        },
      ]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      success: (message: string) => addToast("success", message),
      error: (message: string) => addToast("error", message),
      info: (message: string) => addToast("info", message),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }

  return context;
}