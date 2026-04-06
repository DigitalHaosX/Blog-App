// src/components/Navbar.tsx
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
} from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useTheme } from "../context/ThemeContext";
import { OWNER_UID } from "../config/owner";
import { FiSun, FiMoon } from "react-icons/fi";
import { FaInstagram, FaTiktok, FaFacebook, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isOwner = !!user && OWNER_UID.length > 0 && user.uid === OWNER_UID;
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout?.();
    navigate("/login");
  };

  return (
    <Navbar
      isBordered
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Left: mobile toggle + brand */}
      <NavbarContent justify="start">
        <NavbarMenuToggle aria-label="Toggle menu" className="sm:hidden" />
        <NavbarBrand>
          <Link to="/" className="font-bold text-xl text-primary">
            My Blog
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop nav links */}
      <NavbarContent className="hidden sm:flex gap-2" justify="center">
        <NavbarItem>
          <Link
            to="/"
            className="px-4 py-2 rounded-xl text-base font-medium text-default-600 hover:text-primary bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-primary/15 hover:border-primary/30 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            to="/landing"
            className="px-4 py-2 rounded-xl text-base font-medium text-default-600 hover:text-primary bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-primary/15 hover:border-primary/30 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
          >
            About
          </Link>
        </NavbarItem>
        {user && (
          <NavbarItem>
            <Link
              to="/create"
              className="px-4 py-2 rounded-xl text-base font-medium text-default-600 hover:text-primary bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-primary/15 hover:border-primary/30 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
            >
              New Article
            </Link>
          </NavbarItem>
        )}
        {isOwner && (
          <NavbarItem>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl text-base font-medium text-default-600 hover:text-primary bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-primary/15 hover:border-primary/30 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
            >
              Dashboard
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Right side: social links + theme toggle + user */}
      <NavbarContent justify="end" className="gap-1">
        {/* Social icon buttons (desktop only) */}
        <NavbarItem className="hidden sm:flex gap-0">
          <Button
            as="a"
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            isIconOnly
            variant="light"
            aria-label="Instagram"
            className="text-default-500 hover:text-foreground hover:scale-110 transition-all"
          >
            <FaInstagram size={18} />
          </Button>
          <Button
            as="a"
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            isIconOnly
            variant="light"
            aria-label="TikTok"
            className="text-default-500 hover:text-foreground hover:scale-110 transition-all"
          >
            <FaTiktok size={18} />
          </Button>
          <Button
            as="a"
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            isIconOnly
            variant="light"
            aria-label="X"
            className="text-default-500 hover:text-foreground hover:scale-110 transition-all"
          >
            <FaXTwitter size={18} />
          </Button>
          <Button
            as="a"
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            isIconOnly
            variant="light"
            aria-label="Facebook"
            className="text-default-500 hover:text-foreground hover:scale-110 transition-all"
          >
            <FaFacebook size={18} />
          </Button>
          <Button
            as="a"
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            isIconOnly
            variant="light"
            aria-label="YouTube"
            className="text-default-500 hover:text-foreground hover:scale-110 transition-all"
          >
            <FaYoutube size={18} />
          </Button>
        </NavbarItem>

        {/* Theme toggle */}
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            aria-label="Toggle theme"
            onPress={toggleTheme}
            className="text-default-500 hover:text-foreground hover:scale-110 transition-all"
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </Button>
        </NavbarItem>

        {/* User area */}
        {user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                size="sm"
                className="cursor-pointer"
                src={user.photoURL || undefined}
                name={user.email || "User"}
              />
            </DropdownTrigger>

            <DropdownMenu aria-label="User menu" variant="flat">
              <DropdownItem
                key="info"
                className="gap-1 py-3"
                textValue={user.email ?? ""}
              >
                <p className="font-semibold text-xs text-default-500">
                  Signed in as
                </p>
                <p className="font-semibold text-sm text-foreground">
                  {user.email}
                </p>
                <p
                  className="text-xs text-default-400 font-mono mt-1 cursor-pointer hover:text-primary transition-colors"
                  title="Click to copy your UID"
                  onClick={() => navigator.clipboard.writeText(user.uid)}
                >
                  UID: {user.uid}
                </p>
              </DropdownItem>
              <DropdownItem
                key="new-article"
                textValue="New Article"
                onPress={() => navigate("/create")}
              >
                ✏️ New Article
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                textValue="Log Out"
                onPress={handleLogout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button
              color="primary"
              variant="flat"
              size="sm"
              onPress={() => navigate("/login")}
            >
              Log in
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu>
        <NavbarMenuItem>
          <Link
            to="/"
            className="w-full text-default-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            to="/landing"
            className="w-full text-default-700"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
        </NavbarMenuItem>

        {/* Social links row in mobile menu */}
        <NavbarMenuItem>
          <div className="flex gap-4 py-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-default-500 hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-default-500 hover:text-foreground transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok size={20} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-default-500 hover:text-foreground transition-colors"
              aria-label="X"
            >
              <FaXTwitter size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-default-500 hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-default-500 hover:text-foreground transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube size={20} />
            </a>
          </div>
        </NavbarMenuItem>

        {user ? (
          <>
            <NavbarMenuItem>
              <Link
                to="/create"
                className="w-full text-default-700"
                onClick={() => setIsMenuOpen(false)}
              >
                New Article
              </Link>
            </NavbarMenuItem>
            {isOwner && (
              <NavbarMenuItem>
                <Link
                  to="/dashboard"
                  className="w-full text-default-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </NavbarMenuItem>
            )}
            <NavbarMenuItem>
              <Button
                variant="light"
                color="danger"
                className="w-full justify-start px-0"
                onPress={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Log Out
              </Button>
            </NavbarMenuItem>
          </>
        ) : (
          <NavbarMenuItem>
            <Link
              to="/login"
              className="w-full text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
