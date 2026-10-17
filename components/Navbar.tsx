"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { site } from "../lib/site";
import { useCart } from "../lib/cart";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const router = useRouter();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const close = () => {
    setOpen(false);
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen((s) => !s);
    setOpen(false);
  };

  const toggleMenu = () => {
    setOpen((o) => !o);
    setSearchOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery("");
  };

  const iconButton = "rounded-full p-2 transition-colors hover:bg-petal";

  return (
    <header className="sticky top-0 z-50 border-b border-petal bg-blush/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo / name */}
        <Link
          href="/"
          onClick={close}
          className="font-display text-xl font-semibold text-berry md:text-2xl"
        >
          {site.name}
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-rosy"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side icons */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button
            onClick={toggleSearch}
            aria-label="Search"
            aria-expanded={searchOpen}
            className={`${iconButton} ${searchOpen ? "bg-petal" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="h-6 w-6"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            onClick={close}
            aria-label={`Cart, ${count} items`}
            className={`relative ${iconButton}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-berry px-1 text-xs font-semibold text-white">
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/book"
            className="ml-2 hidden rounded-full bg-rosy px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-berry md:inline-block"
          >
            Book Now
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={open}
            className={`${iconButton} md:hidden`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="h-6 w-6"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Search bar (appears after tapping the icon) */}
      {searchOpen && (
        <div className="border-t border-petal bg-blush px-4 py-3">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-6xl items-center gap-2">
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
              placeholder="Search services & products…"
              aria-label="Search services and products"
              className="w-full rounded-full border border-pink-soft bg-white px-5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-rosy"
            />
            <button
              type="submit"
              className="rounded-full bg-rosy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-berry"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-petal bg-blush px-4 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="block border-b border-petal py-3 text-lg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/book"
            onClick={close}
            className="mt-5 block rounded-full bg-rosy py-3 text-center font-medium text-white shadow-sm"
          >
            Book an Appointment
          </Link>
        </div>
      )}
    </header>
  );
}