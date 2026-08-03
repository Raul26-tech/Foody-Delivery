import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Divider,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { type SyntheticEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import type { ApiErrorResponse } from "../../../types/api-error-response";
import {
  loginSchema,
  registerSchema,
  type LoginDto,
  type RegisterDto,
} from "../schemas";

type AuthMode = "login" | "register";

type AuthTextFieldProps = {
  autoComplete: string;
  error?: boolean;
  helperText?: string;
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onBlur: () => void;
  onChange: (value: string) => void;
};

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      "Nao foi possivel concluir a operacao. Tente novamente."
    );
  }

  return "Nao foi possivel concluir a operacao. Tente novamente.";
}

function AuthTextField({
  autoComplete,
  error,
  helperText,
  icon,
  label,
  onBlur,
  onChange,
  placeholder,
  type = "text",
  value,
}: AuthTextFieldProps) {
  return (
    <Box sx={{ mb: helperText ? 1.25 : 2 }}>
      <Typography
        component="label"
        sx={{
          color: "text.secondary",
          display: "block",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: 0,
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <TextField
        autoComplete={autoComplete}
        error={error}
        fullWidth
        helperText={helperText}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value ?? ""}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiFormHelperText-root": {
            fontSize: 10,
            mx: 0,
            mt: 0.5,
          },
          "& .MuiOutlinedInput-root": {
            bgcolor: "background.paper",
            borderRadius: 1,
            color: "#111827",
            fontSize: 12,
            height: 35,
            px: 0.75,
          },
          "& .MuiOutlinedInput-input": {
            py: 0,
          },
        }}
      />
    </Box>
  );
}

function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "#e80000",
        borderRadius: size > 40 ? "14px" : "10px",
        color: "common.white",
        display: "inline-flex",
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      <DeliveryDiningIcon sx={{ fontSize: Math.round(size * 0.55) }} />
    </Box>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing, login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loginForm = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isSubmitting =
    loginForm.formState.isSubmitting || registerForm.formState.isSubmitting;

  if (!isInitializing && isAuthenticated) {
    return <Navigate to="/orders" replace />;
  }

  async function handleLoginSubmit(values: LoginDto): Promise<void> {
    setFeedbackMessage(null);

    try {
      await login(values);
      navigate("/orders", { replace: true });
    } catch (error: unknown) {
      setFeedbackMessage(getApiErrorMessage(error));
    }
  }

  async function handleRegisterSubmit(values: RegisterDto) {
    setFeedbackMessage(null);

    try {
      await register(values);
      loginForm.reset({
        email: values.email,
        password: "",
      });
      registerForm.reset();
      setMode("login");
    } catch (error: unknown) {
      setFeedbackMessage(getApiErrorMessage(error));
    }
  }

  function handleModeChange(_: SyntheticEvent, value: AuthMode): void {
    setFeedbackMessage(null);
    setMode(value);
  }

  return (
    <Box
      sx={{
        bgcolor: "#f8faf9",
        minHeight: "100vh",
      }}
    >
      <Box
        component="header"
        sx={{
          alignItems: "center",
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          height: 58,
          px: { xs: 2, sm: 6, md: 19 },
        }}
      >
        <LogoMark size={34} />
        <Box sx={{ ml: 1.5 }}>
          <Typography
            component="span"
            sx={{ color: "#111827", fontSize: 14, fontWeight: 800 }}
          >
            Foody
            <Box component="span" sx={{ color: "#e80000" }}>
              .
            </Box>
          </Typography>
          <Typography
            component="span"
            sx={{
              color: "text.secondary",
              fontSize: 12,
              fontWeight: 700,
              ml: 0.5,
            }}
          >
            Delivery
          </Typography>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          px: 2,
          py: { xs: 3, sm: 2 },
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <LogoMark />
          <Typography
            component="h1"
            sx={{
              color: "#111827",
              fontSize: 22,
              fontWeight: 900,
              lineHeight: 1.15,
              mt: 1.5,
            }}
          >
            Foody
            <Box component="span" sx={{ color: "#e80000" }}>
              .
            </Box>
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 12, mt: 0.75 }}>
            Rastreador de Pedidos
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.05)",
            maxWidth: 346,
            p: { xs: 2.5, sm: 2.75 },
            width: "100%",
          }}
        >
          <Tabs
            onChange={handleModeChange}
            value={mode}
            variant="fullWidth"
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              minHeight: 44,
              mb: 2.25,
              "& .MuiTab-root": {
                color: "text.disabled",
                fontSize: 12,
                fontWeight: 800,
                minHeight: 44,
                textTransform: "none",
              },
              "& .Mui-selected": {
                color: "#e80000",
              },
              "& .MuiTabs-indicator": {
                bgcolor: "#e80000",
              },
            }}
          >
            <Tab label="Entrar" value="login" />
            <Tab label="Criar Conta" value="register" />
          </Tabs>

          {feedbackMessage ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {feedbackMessage}
            </Alert>
          ) : null}

          {mode === "login" ? (
            <Box
              component="form"
              noValidate
              onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
            >
              <Controller
                control={loginForm.control}
                name="email"
                render={({ field, fieldState }) => (
                  <AuthTextField
                    autoComplete="email"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    icon={
                      <MailOutlinedIcon
                        sx={{ color: "text.disabled", fontSize: 17 }}
                      />
                    }
                    label="E-MAIL"
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    placeholder="seu@email.com"
                    type="email"
                    value={field.value}
                  />
                )}
              />

              <Controller
                control={loginForm.control}
                name="password"
                render={({ field, fieldState }) => (
                  <AuthTextField
                    autoComplete="current-password"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    icon={
                      <LockOutlinedIcon
                        sx={{ color: "text.disabled", fontSize: 17 }}
                      />
                    }
                    label="SENHA"
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    placeholder="********"
                    type="password"
                    value={field.value}
                  />
                )}
              />

              <Button
                disabled={isSubmitting}
                endIcon={<ArrowForwardIcon />}
                fullWidth
                size="large"
                type="submit"
                variant="text"
                sx={{
                  color: "white",
                  bgcolor: "#c00000",
                  borderRadius: 1,
                  fontSize: 12,
                  fontWeight: 800,
                  minHeight: 36,
                  mt: 0.5,
                  textTransform: "none",
                }}
              >
                {loginForm.formState.isSubmitting
                  ? "Entrando..."
                  : "Entrar no Sistema"}
              </Button>
            </Box>
          ) : (
            <Box
              component="form"
              noValidate
              onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
            >
              <Controller
                control={registerForm.control}
                name="name"
                render={({ field, fieldState }) => (
                  <AuthTextField
                    autoComplete="name"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    icon={
                      <PersonOutlinedIcon
                        sx={{ color: "text.disabled", fontSize: 17 }}
                      />
                    }
                    label="NOME"
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    placeholder="Seu nome"
                    value={field.value}
                  />
                )}
              />

              <Controller
                control={registerForm.control}
                name="email"
                render={({ field, fieldState }) => (
                  <AuthTextField
                    autoComplete="email"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    icon={
                      <MailOutlinedIcon
                        sx={{ color: "text.disabled", fontSize: 17 }}
                      />
                    }
                    label="E-MAIL"
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    placeholder="seu@email.com"
                    type="email"
                    value={field.value}
                  />
                )}
              />

              <Controller
                control={registerForm.control}
                name="password"
                render={({ field, fieldState }) => (
                  <AuthTextField
                    autoComplete="new-password"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    icon={
                      <LockOutlinedIcon
                        sx={{ color: "text.disabled", fontSize: 17 }}
                      />
                    }
                    label="SENHA"
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    placeholder="********"
                    type="password"
                    value={field.value}
                  />
                )}
              />

              <Button
                disabled={isSubmitting}
                endIcon={<ArrowForwardIcon />}
                fullWidth
                size="large"
                type="submit"
                variant="text"
                sx={{
                  color: "white",
                  bgcolor: "#c00000",
                  borderRadius: 1,
                  fontSize: 12,
                  fontWeight: 800,
                  minHeight: 36,
                  mt: 0.5,
                  textTransform: "none",
                }}
              >
                {registerForm.formState.isSubmitting
                  ? "Cadastrando..."
                  : "Cadastrar e Entrar"}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2.25 }} />

          <Typography
            component="button"
            onClick={() => {
              loginForm.setValue("email", "atendimento@foodydelivery.com.br", {
                shouldDirty: true,
                shouldValidate: true,
              });
              registerForm.setValue(
                "email",
                "atendimento@foodydelivery.com.br",
                {
                  shouldDirty: true,
                  shouldValidate: true,
                },
              );
            }}
            sx={{
              bgcolor: "transparent",
              border: 0,
              color: "text.secondary",
              cursor: "pointer",
              display: "block",
              fontFamily: "inherit",
              fontSize: 12,
              mx: "auto",
              p: 0,
              textDecoration: "underline",
            }}
            type="button"
          >
            Usar e-mail de teste (atendimento@foodydelivery.com.br)
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
