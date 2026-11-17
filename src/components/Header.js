"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";

const CATEGORIES = [
  { label: "New Arrivals", href: "/" },
  { label: "Tops", href: "/?cat=Tops" },
  { label: "Dresses", href: "/?cat=Dresses" },
  { label: "Bottoms", href: "/?cat=Bottoms" },
  { label: "Outerwear", href: "/?cat=Outerwear" },
  { label: "Shoes", href: "/?cat=Shoes" },
  { label: "Accessories", href: "/?cat=Accessories" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-serif text-2xl italic"
          >
            V
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">VELORA</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {CATEGORIES.map((c) => {
            const active = pathname === c.href;
            return (
              <Link
                key={c.href}
                href={c.href}
                className={`px-4 py-2 text-sm font-medium transition-all relative group ${
                  active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {c.label}
                <motion.span
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-neutral-900"
                  initial={false}
                  animate={{ scaleX: active ? 1 : 0 }}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <ShoppingBag size={22} className="text-neutral-800" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            className="lg:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-neutral-100 overflow-hidden shadow-xl"
          >
            <nav className="p-6 flex flex-col gap-4">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="text-lg font-medium text-neutral-800 hover:text-amber-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}