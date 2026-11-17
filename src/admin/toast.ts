import { createContext, useContext } from "react";

export interface Toast {
  id: number;
  kind: "success" | "error";
  message: string;
}

export interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

/** Shows a short success or error message in the admin. */
export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside the admin layout");
  return context;
}

/** Turns any thrown value into a message for a toast. */
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong.";
}
