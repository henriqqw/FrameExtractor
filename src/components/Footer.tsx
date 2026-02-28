'use client';

import Link from 'next/link';
import { Film, ExternalLink } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/6 mt-16 py-8 px-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
                <div className="flex items-center gap-5 flex-wrap justify-center text-[0.78rem] text-white/30">
                    <Link href="/" className="no-underline hover:text-white/60 transition-colors">Home</Link>
                    <span className="w-1 h-1 rounded-full bg-white/15" />
                    <Link href="/howto" className="no-underline hover:text-white/60 transition-colors">How to Use</Link>
                    <span className="w-1 h-1 rounded-full bg-white/15" />
                    <Link href="/about" className="no-underline hover:text-white/60 transition-colors">About</Link>
                    <span className="w-1 h-1 rounded-full bg-white/15" />
                    <a
                        href="https://caosdev.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 no-underline text-[#5865F2]/70 hover:text-[#5865F2] transition-colors"
                    >
                        caosdev <ExternalLink size={10} />
                    </a>
                </div>
                <div className="flex items-center gap-1.5 text-[0.75rem] text-white/20">
                    <Film size={11} />
                    <span>FrameXtractor · Built by caosdev · Privacy first, no uploads</span>
                </div>
            </div>
        </footer>
    );
}
