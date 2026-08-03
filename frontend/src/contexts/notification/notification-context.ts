import { createContext } from "react";

export type NotificationSeverity = "success" | "error";

export type NotificationContextValue = {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyApiError: (error: unknown, fallbackMessage?: string) => void;
};

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);
