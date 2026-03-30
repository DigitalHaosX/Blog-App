import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/renderWithProviders";
import Login from "./Login";

// Mock Firebase Auth so we don't make real network calls
vi.mock("../services/firebase", () => ({
  auth: {},
  db: {},
  storage: {},
}));

vi.mock("firebase/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/auth")>();
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn(() => () => {}),
    signOut: vi.fn(),
  };
});

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

describe("Login page", () => {
  it("renders email and password inputs", () => {
    renderWithProviders(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders Sign In and Create Account buttons", () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("calls signInWithEmailAndPassword on sign in", async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as any);

    renderWithProviders(<Login />);
    await user.type(screen.getByLabelText(/email/i), "test@test.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@test.com",
        "password123",
      );
    });
  });

  it("shows error message on failed login", async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
      new Error("Invalid credentials"),
    );

    renderWithProviders(<Login />);
    await user.type(screen.getByLabelText(/email/i), "bad@test.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("calls createUserWithEmailAndPassword on register", async () => {
    const user = userEvent.setup();
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({} as any);

    renderWithProviders(<Login />);
    await user.type(screen.getByLabelText(/email/i), "new@test.com");
    await user.type(screen.getByLabelText(/password/i), "newpass123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "new@test.com",
        "newpass123",
      );
    });
  });
});
