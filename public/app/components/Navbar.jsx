'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "motion/react";
import { IconMenu, IconX, IconMicrophone } from "@tabler/icons-react";
import { auth } from '../../lib/auth.js';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const ref = useRef(null);

  // Auth check
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = auth.isAuthenticated() && !auth.isTokenExpired();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUser(auth.getCurrentUser());
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll detection
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 70) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    auth.logout();
  };

  const navItems = isAuthenticated ? [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
  ] : [
    { href: "/", label: "Home" },
  ];

  return (
    <header className="bg-transparent fixed top-2 w-full z-50">
      <motion.div
        initial={{
          maxWidth: isMobile ? "90vw" : "64rem",
        }}
        animate={{
          maxWidth: isMobile ? "90%" : visible ? "56rem" : "64rem",
        }}
        transition={{
          duration: 0.5,
        }}
        ref={ref}
          className={`
          container overflow-hidden bg-transparent rounded-xl 
          mx-auto px-4 md:px-6 py-3 md:py-4 
          flex items-center justify-between 
          max-w-[90%] lg:max-w-5xl relative
          ${visible ? "backdrop-blur-lg border border-gray-200/50 supports-[backdrop-filter]:bg-white/80" : ""}
        `}
      >
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <IconMicrophone className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            TalentLoop
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                text-gray-900 text-sm font-medium transition-all duration-200
                ${pathname === item.href 
                  ? "opacity-100 font-semibold" 
                  : "opacity-70 hover:opacity-100"
                }
              `}
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#BCCCDC] hover:bg-[#9AA6B2] text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#BCCCDC] hover:bg-[#9AA6B2] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-center items-center">
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {open ? (
              <IconX className="w-6 h-6" />
            ) : (
              <IconMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden"
            >
              <div className="p-6">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                      <IconMicrophone className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      TalentLoop
                    </span>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <IconX className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`
                        px-4 py-3 rounded-lg text-base font-medium transition-all
                        ${pathname === item.href
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-200 mt-4 pt-4">
                        Welcome, {user?.email}
                      </div>
                      <button
                        onClick={() => { handleLogout(); setOpen(false); }}
                        className="mx-4 bg-[#BCCCDC] hover:bg-[#9AA6B2] text-white px-4 py-3 rounded-lg text-base font-medium transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="mx-4 bg-[#BCCCDC] hover:bg-[#9AA6B2] text-white px-4 py-3 rounded-lg text-base font-medium transition-colors text-center"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
