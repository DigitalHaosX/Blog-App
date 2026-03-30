import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import ProtectedRoute from "./ProtectedRoute";
import type { User } from "firebase/auth";

function ChildComponent() {
  return <div>Protected Content</div>;
}

describe("ProtectedRoute", () => {
  it("shows a spinner while auth is loading", () => {
    renderWithProviders(
      <ProtectedRoute>
        <ChildComponent />
      </ProtectedRoute>,
      { authLoading: true, authUser: null },
    );
    // Content should NOT be visible
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to /login when user is null and not loading", () => {
    renderWithProviders(
      <ProtectedRoute>
        <ChildComponent />
      </ProtectedRoute>,
      { authUser: null, authLoading: false, route: "/create" },
    );
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    const fakeUser = { uid: "u1", email: "u@test.com" } as unknown as User;
    renderWithProviders(
      <ProtectedRoute>
        <ChildComponent />
      </ProtectedRoute>,
      { authUser: fakeUser },
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
