import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import type { ReactElement } from "react";
import type { User } from "firebase/auth";
import AuthContext, { type AuthContextType } from "../auth/AuthContext";

interface Options extends RenderOptions {
  route?: string;
  authUser?: Partial<User> | null;
  authLoading?: boolean;
}

const DEFAULT_AUTH: AuthContextType = {
  user: null,
  loading: false,
  logout: async () => {},
};

export function renderWithProviders(
  ui: ReactElement,
  {
    route = "/",
    authUser = null,
    authLoading = false,
    ...renderOptions
  }: Options = {},
) {
  const authValue: AuthContextType = {
    user: authUser as User | null,
    loading: authLoading,
    logout: async () => {},
  };

  return render(
    <HeroUIProvider>
      <MemoryRouter initialEntries={[route]}>
        <AuthContext.Provider value={authValue}>{ui}</AuthContext.Provider>
      </MemoryRouter>
    </HeroUIProvider>,
    renderOptions,
  );
}

export { DEFAULT_AUTH };
