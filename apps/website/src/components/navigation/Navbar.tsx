"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, Gamepad2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";

const links = [
  { name: "Home", href: "/" },
  { name: "World", href: "/world" },
  { name: "Systems", href: "/systems" },
  { name: "Rankings", href: "/rankings" },
  { name: "News", href: "/news" },
  { name: "Races", href: "/races" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/10"
          : "bg-background/0"
      }`}
    >
      <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-heading text-primary tracking-widest hover:text-primary-hover transition-colors relative"
        >
          LEGEND
          <motion.span
            className="absolute -bottom-1 left-0 h-[2px] bg-primary"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm uppercase tracking-wider font-body transition-colors rounded-sm ${
                  isActive
                    ? "text-primary"
                    : "text-text-secondary hover:text-primary"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary-muted rounded-sm border border-primary/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-text-secondary hover:text-primary uppercase tracking-wider font-body transition-colors flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            Login
          </Link>
          <Link href="/play">
            <Button variant="primary" size="sm">
              <Gamepad2 className="w-4 h-4" />
              Play Now
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-text-primary hover:text-primary transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-background/95 backdrop-blur-lg border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg uppercase tracking-wider font-body transition-colors ${
                      isActive ? "text-primary" : "text-text-secondary hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <hr className="border-border my-2" />
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-lg text-text-secondary hover:text-primary uppercase tracking-wider font-body transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link href="/play" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="md" className="w-full mt-2">
                  <Gamepad2 className="w-4 h-4" />
                  Play Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
