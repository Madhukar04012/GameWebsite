"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { FaTwitter, FaYoutube, FaTwitch, FaGithub } from "react-icons/fa";

const columns = [
  {
    title: "Game",
    links: [
      { label: "Download", href: "#" },
      { label: "Patch Notes", href: "#" },
      { label: "System Req.", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Forums", href: "#" },
      { label: "Discord", href: "#" },
      { label: "Leaderboards", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Account Security", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "EULA", href: "#" },
    ],
  },
];

const socials = [
  { label: "Twitter / X", icon: FaTwitter, href: "#" },
  { label: "YouTube", icon: FaYoutube, href: "#" },
  { label: "Twitch", icon: FaTwitch, href: "#" },
  { label: "GitHub", icon: FaGithub, href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="bg-background border-t border-border relative overflow-hidden">
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 pt-16 pb-8 relative z-10">
        {/* Newsletter */}
        <div className="mb-12 pb-12 border-b border-border/50">
          <div className="max-w-lg mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-heading text-primary mb-2">
              Stay in the Realm
            </h3>
            <p className="text-sm text-text-secondary font-body mb-6">
              Get patch notes, event announcements, and exclusive lore delivered to your inbox.
            </p>
            {subscribed ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-accent-green font-body text-sm"
              >
                You&apos;re subscribed! Watch your inbox for the next dispatch.
              </motion.p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    aria-label="Email for newsletter"
                    className="w-full bg-surface border border-border rounded-sm pl-10 pr-3 py-2.5 text-sm text-text-primary font-body placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-background px-4 rounded-sm hover:bg-primary-hover transition-colors"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-text-primary font-heading text-xl mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-primary transition-colors font-body relative inline-block group"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-text-muted font-body">
          <p>&copy; {year} LEGEND STUDIO. All rights reserved.</p>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-text-muted hover:text-primary transition-colors"
              >
                <s.icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
