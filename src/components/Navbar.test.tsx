import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/renderWithProviders";
import AppNavbar from "./Navbar";
import type { User } from "firebase/auth";

// useNavigate is used inside the component — MemoryRouter from renderWithProviders covers it.

describe("AppNavbar – logged out", () => {
  it("renders the brand name", () => {
    renderWithProviders(<AppNavbar />);
    expect(screen.getByText("My Blog")).toBeInTheDocument();
  });

  it("renders a Login button", () => {
    renderWithProviders(<AppNavbar />);
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("does NOT render avatar when logged out", () => {
    renderWithProviders(<AppNavbar />);
    expect(
      screen.queryByRole("img", { name: /user/i }),
    ).not.toBeInTheDocument();
  });
});

describe("AppNavbar – logged in", () => {
  const fakeUser = {
    uid: "uid-abc",
    email: "test@example.com",
    photoURL: null,
  } as unknown as User;

  it("renders the user avatar instead of the login button", () => {
    renderWithProviders(<AppNavbar />, { authUser: fakeUser });
    // Avatar renders the initials or an img – login button should be gone
    expect(
      screen.queryByRole("button", { name: /login/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the Home nav link for authenticated users", () => {
    renderWithProviders(<AppNavbar />, { authUser: fakeUser });
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("shows the New Article nav link for authenticated users", () => {
    renderWithProviders(<AppNavbar />, { authUser: fakeUser });
    expect(screen.getByText("New Article")).toBeInTheDocument();
  });
});
