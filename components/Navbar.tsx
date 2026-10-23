'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bell,
  Menu,
  X,
  CircleParking,
  User as UserIcon,
  LogOut,
  CalendarCheck,
  Car,
} from 'lucide-react';
import axios from 'axios';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/vehicles', label: 'Vehicles' },
  { href: '/my-bookings', label: 'My Bookings' },
  { href: '/history', label: 'History' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname === href;



  async function user() {
    try {
      const response = await axios.get("/api/me");

      if (response.data?.name && response.data?.email) {
        setName(response.data?.name);
        setEmail(response.data?.email);
      }

    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {

    user();

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function logout() {
    setMenuOpen(false);
    setDrawerOpen(false);
    setName('');
    setEmail('');
    try {
      await axios.post('/api/logout');
    } catch {
      // Cookie is cleared server-side even if Laravel is unreachable
    }
    router.replace('/login');
  }

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 h-16 ps-transition"
      style={{
        backgroundColor: scrolled ? 'rgba(15,15,26,0.95)' : 'rgba(15,15,26,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(108,99,255,0.1)',
      }}
    >
      <nav className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CircleParking className="text-ps-primary" size={26} />
          <span className="text-white font-bold text-lg">ParkSense AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => {
            const activeLink = isActive(l.href);
            return (
              <Link
                key={l.label}
                href={l.href}
                className={`relative text-sm ps-transition ${activeLink
                  ? 'text-ps-primary font-semibold'
                  : 'text-ps-text-muted hover:text-white'
                  }`}
              >
                {l.label}
                {activeLink && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ps-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            className="relative w-10 h-10 rounded-btn border border-white/10 text-ps-text-muted hover:text-white hover:border-ps-primary/40 ps-transition flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-ps-available" />
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((m) => !m)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-ps-primary to-ps-primary-hover text-white font-semibold flex items-center justify-center ps-transition hover:ps-glow"
              aria-label="Account menu"
            >
              {name[0]?.toUpperCase() ?? '?'}
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 ps-card p-2 z-50 animate-scale-in">
                  <div className="px-3 py-2 text-xs text-ps-text-muted border-b border-white/5 mb-1">
                    Signed in as <span className="text-white">{email}</span>
                  </div>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-ps-text-muted hover:text-white hover:bg-white/5 rounded-md ps-transition">
                    <UserIcon size={15} /> Profile
                  </Link>
                  <Link href="/vehicles" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-ps-text-muted hover:text-white hover:bg-white/5 rounded-md ps-transition">
                    <Car size={15} /> Vehicles
                  </Link>
                  <Link href="/my-bookings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-ps-text-muted hover:text-white hover:bg-white/5 rounded-md ps-transition">
                    <CalendarCheck size={15} /> My Bookings
                  </Link>
                  <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ps-occupied hover:bg-white/5 rounded-md ps-transition">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-white"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-72 max-w-[80%] bg-ps-card border-l border-ps-primary/15 p-5 flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-bold">Menu</span>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="text-ps-text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => {
                const activeLink = isActive(l.href);
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`px-3 py-3 rounded-md text-sm ps-transition ${activeLink
                      ? 'text-ps-primary bg-ps-primary/10 font-semibold'
                      : 'text-ps-text-muted hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-auto flex flex-col gap-2">
              <Link href="/login" className="h-11 rounded-btn border border-ps-primary/40 text-ps-primary text-sm font-semibold flex items-center justify-center hover:bg-ps-primary/10 ps-transition">
                Login
              </Link>
              <Link href="/register" className="h-11 rounded-btn bg-ps-primary text-white text-sm font-semibold flex items-center justify-center hover:bg-ps-primary-hover ps-transition">
                Register
              </Link>
              <button onClick={logout} className="h-11 rounded-btn text-ps-occupied text-sm font-semibold flex items-center justify-center hover:bg-white/5 ps-transition">
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
