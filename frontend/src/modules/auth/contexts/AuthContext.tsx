import { useCallback, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import axios from "axios";

import {
  fetchCurrentUser,
  initializeCsrf,
  sendLoginRequest,
  sendLogoutRequest,
  sendRegisterRequest,
} from "../api/auth-api";
import type {
  AuthenticatedUser,
  LoginRequest,
  RegisterRequest,
} from "../types/index";
import { AuthContext, type AuthContextValue } from "./auth-context";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  const [isInitializing, setIsInitializing] = useState(true);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const currentUser = await fetchCurrentUser();

      setUser(currentUser);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUser(null);
        return;
      }

      setUser(null);
      throw error;
    }
  }, []);

  const login = useCallback(async (payload: LoginRequest): Promise<void> => {
    //  Garante a existência de um token CSRF válido antes
    //  da requisição que altera o estado da autenticação.

    await initializeCsrf();

    const authenticatedUser = await sendLoginRequest(payload);

    setUser(authenticatedUser);

    //  O Spring Security pode renovar o token após a
    //  autenticação. Esta chamada atualiza o cookie para
    //  as próximas operações mutáveis.

    await initializeCsrf();
  }, []);

  const register = useCallback(
    async (payload: RegisterRequest): Promise<AuthenticatedUser> => {
      await initializeCsrf();

      // O cadastro não cria uma sessão autenticada no backend.
      // Por isso, não atualizamos `user` aqui.

      return sendRegisterRequest(payload);
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    await initializeCsrf();
    await sendLogoutRequest();

    setUser(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuthentication(): Promise<void> {
      try {
        //   Inicializa o cookie XSRF-TOKEN utilizado nas futuras
        //   requisições POST, PATCH e DELETE.

        await initializeCsrf();

        const currentUser = await fetchCurrentUser();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch (error: unknown) {
        const isUnauthorized =
          axios.isAxiosError(error) && error.response?.status === 401;

        if (!isUnauthorized) {
          console.error("Could not initialize authentication", error);
        }

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    void initializeAuthentication();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isInitializing, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
