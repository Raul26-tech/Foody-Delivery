import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { useMemo, useState } from "react";
import type { PropsWithChildren, SyntheticEvent } from "react";

import type { ApiErrorResponse } from "../../types/api-error-response";
import {
  NotificationContext,
  type NotificationSeverity,
} from "./notification-context";

type NotificationState = {
  id: number;
  message: string;
  severity: NotificationSeverity;
};

function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Nao foi possivel concluir a operacao.",
): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  const responseData = error.response?.data;

  if (!responseData) {
    return fallbackMessage;
  }

  const firstFieldError = Object.values(responseData.fieldErrors ?? {})[0];

  return firstFieldError ?? responseData.message ?? fallbackMessage;
}

export function NotificationProvider({ children }: PropsWithChildren) {
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  function handleClose(
    _: Event | SyntheticEvent,
    reason?: string,
  ): void {
    if (reason === "clickaway") {
      return;
    }

    setNotification(null);
  }

  const value = useMemo(
    () => ({
      notifySuccess: (message: string) => {
        setNotification({ id: Date.now(), message, severity: "success" });
      },
      notifyError: (message: string) => {
        setNotification({ id: Date.now(), message, severity: "error" });
      },
      notifyApiError: (error: unknown, fallbackMessage?: string) => {
        setNotification({
          id: Date.now(),
          message: getApiErrorMessage(error, fallbackMessage),
          severity: "error",
        });
      },
    }),
    [],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        autoHideDuration={5000}
        key={notification?.id}
        onClose={handleClose}
        open={notification !== null}
        sx={{ mt: 7, zIndex: (theme) => theme.zIndex.snackbar + 1000 }}
      >
        <Alert
          onClose={handleClose}
          severity={notification?.severity ?? "success"}
          variant="filled"
          sx={{
            alignItems: "center",
            borderRadius: 1.5,
            boxShadow: "0 12px 24px rgba(15, 23, 42, 0.16)",
            fontSize: 13,
            fontWeight: 800,
            maxWidth: 520,
            width: "100%",
            "&.MuiAlert-filledError": {
              bgcolor: "#e80000",
            },
            "&.MuiAlert-filledSuccess": {
              bgcolor: "#059669",
            },
          }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
