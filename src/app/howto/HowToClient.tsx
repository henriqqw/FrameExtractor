'use client';

import { motion } from 'framer-motion';
import { Upload, Settings, Zap, Download, Lightbulb } from 'lucide-react';

const steps = [
    { icon: <Upload size={15} />, title: 'Upload Your Video', desc: 'Drag and drop a video file (MP4, WebM, Ogg) into the drop zone, or click "Select video" to browse your files. Free — no sign-up needed.' },
    { icon: <Settings size={15} />, title: 'Select Extraction Mode', desc: '"First Frame" grabs only the opening frame. "All Frames" extracts multiple frames — choose by FPS rate or a total count evenly distributed across the video.' },
    { icon: <Zap size={15} />, title: 'Configure Settings', desc: 'Set your FPS or total frame count. Choose output resolution (original or custom width) and format — PNG for lossless quality, JPEG for compact files.' },
    { icon: <Download size={15} />, title: 'Extract & Download', desc: 'Click "Extract" and watch the live progress. When complete, download a single frame or a ZIP archive with all images — completely free.' },
];

const Fade = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay, ease: [0.4, 0, 0.2, 1] }}>
        {children}
    </motion.div>
);

export default function HowToClient() {
    return (
        <div className="relative z-10 max-w-2xl mx-auto px-4 pb-20">
            <Fade>
                <div className="text-center pt-10 pb-8">
                    <h1 className="text-[clamp(1.8rem,5vw,2.8rem)] font-bold tracking-[-0.03em] mb-3">
                        How to <span className="text-[#5865F2]">use</span> FrameXtractor
                    </h1>
                    <p className="text-[0.9rem] text-white/45 leading-relaxed">
                        Four simple steps — no sign-up, no server, <span className="text-white/70 font-medium">100% free forever.</span>
                    </p>
                </div>
            </Fade>

            <Fade delay={0.08}>
                <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                    {/* Titlebar */}
                    <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-white/6 bg-white/[0.015]">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                        <span className="flex-1 text-center text-[0.7rem] text-white/22 mr-9" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
                            how-to-guide.md
                        </span>
                    </div>

                    <div className="p-6">
                        {steps.map((step, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.07 }}
                                className="flex gap-4 pb-6 relative last:pb-0">
                                {/* Connector line */}
                                {i < steps.length - 1 && (
                                    <div className="absolute left-4 top-8 bottom-0 w-px bg-white/6" />
                                )}
                                <div className="w-8 h-8 min-w-[32px] rounded-full flex items-center justify-center bg-[#5865F2]/10 border border-[#5865F2]/22 text-[0.78rem] font-semibold text-[#5865F2] z-10">
                                    {i + 1}
                                </div>
                                <div className="pt-0.5">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[#5865F2]/70">{step.icon}</span>
                                        <span className="font-semibold text-[0.9rem]">{step.title}</span>
                                    </div>
                                    <p className="text-[0.82rem] text-white/42 leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Pro tip */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                            className="mt-5 flex items-start gap-3 p-3.5 rounded-xl bg-[#5865F2]/7 border border-[#5865F2]/18">
                            <div className="w-7 h-7 min-w-[28px] rounded-lg flex items-center justify-center bg-[#5865F2]/12 border border-[#5865F2]/22 text-[#5865F2]">
                                <Lightbulb size={13} />
                            </div>
                            <p className="text-[0.8rem] text-white/45 leading-relaxed">
                                <span className="text-[#5865F2] font-semibold">Pro tip:</span> For large videos, test with a short clip first to validate your settings before processing the full file.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </Fade>

            <Fade delay={0.2}>
                <div className="mt-14 pt-8 border-t border-white/5 text-center">
                    <h2 className="text-[0.88rem] font-medium text-white/35 mb-1.5">Fast local frame extraction</h2>
                    <p className="text-[0.78rem] text-white/20 max-w-md mx-auto leading-relaxed mb-6">
                        FrameXtractor uses your browser&apos;s native Canvas API to capture video frames without any server. Your files stay entirely on your machine.
                    </p>
                    <h2 className="text-[0.88rem] font-medium text-white/35 mb-1.5">Batch ZIP export</h2>
                    <p className="text-[0.78rem] text-white/20 max-w-md mx-auto leading-relaxed">
                        Extract hundreds of frames and download a single ZIP — ideal for ML datasets, video editing references, or sprite sheets.
                    </p>
                </div>
            </Fade>
        </div>
    );
}
