import { Divider } from "@heroui/react";
import { FaInstagram, FaTiktok, FaFacebook, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: <FaInstagram size={20} />,
  },
  { href: "https://tiktok.com", label: "TikTok", icon: <FaTiktok size={20} /> },
  { href: "https://x.com", label: "X", icon: <FaXTwitter size={20} /> },
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: <FaFacebook size={20} />,
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    icon: <FaYoutube size={20} />,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-default-200 bg-default-50">
      <div className="container mx-auto max-w-5xl px-4 py-10 flex flex-col items-center gap-6">
        {/* Brand */}
        <span className="text-xl font-bold text-primary tracking-tight">
          My Blog
        </span>

        <Divider className="w-16 opacity-40" />

        {/* Social icons */}
        <div className="flex gap-5">
          {SOCIAL_LINKS.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-default-400 hover:text-primary hover:scale-125 transition-all duration-200"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-default-400 text-center">
          © {year} My Blog. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
