'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Code2, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';

const features = [
    { icon: <Shield size={15} />, title: 'Privacy Focused', desc: 'Zero server uploads. All processing happens locally via the browser Canvas API.' },
    { icon: <Zap size={15} />, title: 'High Performance', desc: 'Optimized frame seeking and capture using modern browser APIs — no server latency.' },
    { icon: <Code2 size={15} />, title: 'Open & Simple', desc: 'No account, no paywalls, no tracking. Pure web tech — works in any modern browser.' },
    { icon: <Sparkles size={15} />, title: 'Free Forever', desc: 'Completely free with no usage limits, no sign-up, and no credit card required.' },
];

const Fade = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay, ease: [0.4, 0, 0.2, 1] }}>
        {children}
    </motion.div>
);

export default function AboutClient() {
    return (
        <div className="relative z-10 max-w-2xl mx-auto px-4 pb-20">
            <Fade>
                <div className="text-center pt-10 pb-8">
                    <h1 className="text-[clamp(1.8rem,5vw,2.8rem)] font-bold tracking-[-0.03em] mb-3">
                        About <span className="text-[#5865F2]">FrameXtractor</span>
                    </h1>
                    <p className="text-[0.9rem] text-white/45 leading-relaxed">
                        A privacy-first, client-side video frame extractor. <span className="text-white/70 font-medium">Free forever</span> — no accounts, no servers, no data collected.
                    </p>
                </div>
            </Fade>

            <Fade delay={0.07}>
                <div className="rounded-2xl border border-white/8 overflow-hidden mb-4" style={{ background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                    {/* Titlebar */}
                    <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-white/6 bg-white/[0.015]">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                        <span className="flex-1 text-center text-[0.7rem] text-white/22 mr-9" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
                            about.md
                        </span>
                    </div>

                    <div className="p-6">
                        <p className="text-[0.86rem] text-white/45 leading-relaxed mb-6">
                            FrameXtractor was built to solve a simple problem: extract frames from video without uploading anything to a third-party server.
                            Every operation happens inside your browser — the video never moves, the quality stays intact, and your privacy is guaranteed.
                            And it&apos;s completely free with no limits.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                            {features.map((f, i) => (
                                <motion.div key={f.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}
                                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/7">
                                    <div className="w-7 h-7 min-w-[28px] rounded-lg flex items-center justify-center bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2]">
                                        {f.icon}
                                    </div>
                                    <div>
                                        <div className="text-[0.82rem] font-semibold mb-0.5">{f.title}</div>
                                        <div className="text-[0.75rem] text-white/35 leading-snug">{f.desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-5 border-t border-white/6 flex flex-col gap-2 text-[0.8rem] text-white/30">
                            <div className="flex items-center gap-2">
                                <span>Built by</span>
                                <a href="https://caosdev.vercel.app/" target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[#5865F2] no-underline hover:opacity-75 transition-opacity font-medium">
                                    caosdev <ExternalLink size={11} />
                                </a>
                            </div>
                            <div>
                                Design inspired by{' '}
                                <a href="https://github.com/henriqqw/EasyWebPConverter" target="_blank" rel="noopener noreferrer"
                                    className="text-[#5865F2] no-underline hover:opacity-75 transition-opacity">
                                    EasyWebPConverter
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Fade>

            <Fade delay={0.18}>
                <div className="flex gap-2.5 flex-wrap justify-center">
                    <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-[0.85rem] font-medium no-underline transition-all shadow-[0_4px_16px_rgba(88,101,242,0.3)]">
                        Try FrameXtractor →
                    </Link>
                    <Link href="/howto" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-white/50 text-[0.85rem] hover:text-white hover:border-white/20 hover:bg-white/5 no-underline transition-all">
                        How to Use
                    </Link>
                </div>
            </Fade>
        </div>
    );
}
