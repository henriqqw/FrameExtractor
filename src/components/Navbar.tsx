'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Menu, X } from 'lucide-react';

const links = [
    { href: '/', label: 'Home' },
    { href: '/howto', label: 'How to Use' },
    { href: '/about', label: 'About' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <>
            {/* Fixed floating nav — getaxion style */}
            <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                <motion.nav
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="pointer-events-auto relative flex items-center w-full max-w-[700px] px-4 py-2.5 rounded-full border transition-all duration-300"
                    style={{
                        background: scrolled ? 'rgba(3,3,3,0.92)' : 'rgba(3,3,3,0.65)',
                        backdropFilter: 'blur(28px)',
                        WebkitBackdropFilter: 'blur(28px)',
                        borderColor: scrolled ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.08)',
                        boxShadow: scrolled
                            ? '0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)'
                            : '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
                    }}
                >
                    {/* Logo — left */}
                    <Link href="/" className="flex items-center gap-2 text-white no-underline shrink-0 z-10">
                        <div className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center bg-[#5865F2]/12 border border-[#5865F2]/25 text-[#5865F2]">
                            <Film size={12} />
                        </div>
                        <span
                            className="text-[0.88rem] font-semibold tracking-tight"
                            style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
                        >
                            Frame<span className="text-[#5865F2]">Xtractor</span>
                        </span>
                    </Link>

                    {/* Links — absolutely centered */}
                    <div className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none">
                        <div className="flex items-center gap-0.5 pointer-events-auto">
                            {links.map(({ href, label }) => {
                                const active = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`px-3.5 py-1.5 rounded-full text-[0.82rem] no-underline transition-all duration-150 ${active
                                                ? 'bg-white/9 text-white font-medium'
                                                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                                            }`}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="ml-auto flex items-center gap-2 shrink-0 z-10">
                        <a
                            href="https://caosdev.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[0.75rem] font-medium text-white/45 border border-white/9 hover:text-white/75 hover:border-white/18 hover:bg-white/4 no-underline transition-all duration-150"
                        >
                            caosdev ↗
                        </a>
                        {/* Mobile toggle */}
                        <button
                            onClick={() => setOpen(v => !v)}
                            className="sm:hidden w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/45 hover:text-white hover:bg-white/6 transition-all cursor-pointer bg-transparent"
                            aria-label="Toggle menu"
                        >
                            {open ? <X size={14} /> : <Menu size={14} />}
                        </button>
                    </div>
                </motion.nav>

                {/* Mobile dropdown */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            key="mobile-menu"
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.18 }}
                            className="pointer-events-auto absolute top-14 w-full max-w-[700px] rounded-2xl border border-white/10 p-2 flex flex-col gap-1"
                            style={{
                                background: 'rgba(3,3,3,0.97)',
                                backdropFilter: 'blur(28px)',
                                WebkitBackdropFilter: 'blur(28px)',
                            }}
                        >
                            {links.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setOpen(false)}
                                    className={`block px-4 py-2.5 rounded-xl text-[0.88rem] no-underline transition-all ${pathname === href
                                            ? 'bg-white/8 text-white font-medium'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}
                            <div className="h-px bg-white/6 my-1" />
                            <a
                                href="https://caosdev.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2.5 rounded-xl text-[0.88rem] text-[#5865F2]/70 hover:text-[#5865F2] no-underline transition-all"
                            >
                                caosdev ↗
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Spacer */}
            <div className="h-[72px]" />
        </>
    );
}
