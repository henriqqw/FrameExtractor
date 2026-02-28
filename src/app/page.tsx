'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Zap, Shield, ImageIcon,
  Download, RotateCcw, StopCircle, Film,
  CheckCircle, ChevronRight, Sparkles,
} from 'lucide-react';

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

interface Frame { dataUrl: string; filename: string; }

const Fade = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.42, delay, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

function TitleBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-white/6 bg-white/[0.015]">
      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      <span
        className="flex-1 text-center text-[0.7rem] text-white/22 mr-9"
        style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
      >
        {title}
      </span>
    </div>
  );
}

function Seg<T extends string>({
  options, value, onChange,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex bg-white/4 border border-white/8 rounded-xl p-0.5 gap-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 py-1.5 rounded-[10px] text-[0.82rem] font-medium transition-all cursor-pointer border-0 ${value === o.value
              ? 'bg-white/10 text-white'
              : 'bg-transparent text-white/38 hover:text-white/65'
            }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[0.67rem] font-semibold text-white/32 uppercase tracking-widest mb-2">
      {children}
    </span>
  );
}

export default function HomePage() {
  const [phase, setPhase] = useState<'upload' | 'editing' | 'done'>('upload');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [duration, setDuration] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);

  const [mode, setMode] = useState<'first' | 'all'>('first');
  const [method, setMethod] = useState<'fps' | 'total'>('fps');
  const [fps, setFps] = useState(1);
  const [totalFrames, setTotalFrames] = useState(100);
  const [resolution, setResolution] = useState<'original' | 'custom'>('original');
  const [widthPreset, setWidthPreset] = useState(1920);
  const [customWidth, setCustomWidth] = useState(1920);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg'>('image/png');

  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [frames, setFrames] = useState<Frame[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stopRef = useRef(false);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) return;
    setVideoSrc(URL.createObjectURL(file));
    setFileName(file.name);
    setPhase('editing');
    setFrames([]);
    setProgress(0);
  }, []);

  const onVideoMeta = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
    setDims({ w: v.videoWidth, h: v.videoHeight });
  };

  const doExtract = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const outW = resolution === 'original' ? video.videoWidth : (widthPreset || customWidth);
    const outH = resolution === 'original' ? video.videoHeight : Math.round((video.videoHeight / video.videoWidth) * (widthPreset || customWidth));
    canvas.width = outW; canvas.height = outH;
    const ctx = canvas.getContext('2d')!;
    const ext = format === 'image/png' ? 'png' : 'jpg';
    stopRef.current = false; setProcessing(true); setProgress(0); setFrames([]);

    const captureAt = (time: number, name: string): Promise<Frame> =>
      new Promise(resolve => {
        video.currentTime = time;
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          ctx.drawImage(video, 0, 0, outW, outH);
          resolve({ dataUrl: canvas.toDataURL(format, 0.95), filename: `${name}.${ext}` });
        };
        video.addEventListener('seeked', onSeeked);
      });

    const results: Frame[] = [];
    if (mode === 'first') {
      results.push(await captureAt(0, 'frame_0001'));
      setProgress(100);
    } else {
      const ts: number[] = [];
      if (method === 'fps') { const i = 1 / fps; for (let t = 0; t < video.duration; t += i) ts.push(t); }
      else { const step = video.duration / totalFrames; for (let i = 0; i < totalFrames; i++) ts.push(i * step); }
      for (let i = 0; i < ts.length; i++) {
        if (stopRef.current) break;
        results.push(await captureAt(ts[i], `frame_${String(i + 1).padStart(4, '0')}`));
        setProgress(Math.round(((i + 1) / ts.length) * 100));
        setFrames([...results]);
      }
    }
    setFrames(results); setProcessing(false);
    if (results.length > 0) setPhase('done');
  }, [mode, method, fps, totalFrames, resolution, widthPreset, customWidth, format]);

  const downloadAll = useCallback(async () => {
    if (!frames.length) return;
    if (frames.length === 1) {
      const a = document.createElement('a'); a.href = frames[0].dataUrl; a.download = frames[0].filename; a.click(); return;
    }
    const { default: JSZip } = await import('jszip');
    const { saveAs } = await import('file-saver');
    const zip = new JSZip();
    frames.forEach(f => zip.file(f.filename, f.dataUrl.split(',')[1], { base64: true }));
    saveAs(await zip.generateAsync({ type: 'blob' }), `frames_${fileName.replace(/\.[^.]+$/, '')}.zip`);
  }, [frames, fileName]);

  const reset = () => {
    setPhase('upload'); setVideoSrc(null); setFrames([]);
    setProgress(0); setProcessing(false); stopRef.current = false;
  };

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-4 pb-20">

      {/* ── Hero ── */}
      <Fade>
        <div className="text-center pt-10 pb-8">
          {/* Status badges */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] text-[0.7rem] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              100% Client-Side · No Uploads
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/55 text-[0.7rem] font-medium">
              <Sparkles size={10} className="text-yellow-400" />
              Completely Free · No Account
            </span>
          </div>

          <h1 className="text-[clamp(2rem,6vw,3.4rem)] font-bold tracking-[-0.035em] leading-[1.08] mb-4">
            Extract video frames<br />
            <span className="text-[#5865F2]">instantly.</span>
          </h1>
          <p className="text-[0.95rem] text-white/48 max-w-md mx-auto leading-relaxed">
            Drop any video, export frames as PNG or JPEG.{' '}
            <span className="text-white/70 font-medium">Free, forever.</span>{' '}
            Everything stays in your browser — zero tracking.
          </p>
        </div>
      </Fade>

      {/* ── Feature chips ── */}
      <Fade delay={0.07}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-8">
          {[
            { icon: <Zap size={13} />, title: 'Fast', desc: 'Instant frame capture from MP4, WebM, Ogg.' },
            { icon: <Shield size={13} />, title: 'Private', desc: 'Files never leave your device.' },
            { icon: <ImageIcon size={13} />, title: 'HD Quality', desc: 'Full-res PNG · JPEG · batch ZIP.' },
            { icon: <Sparkles size={13} />, title: 'Free Forever', desc: 'No account, no limits, $0.' },
          ].map(f => (
            <div key={f.title}
              className="flex flex-col items-center text-center gap-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/7 hover:bg-white/4 hover:border-white/12 transition-all"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2]">
                {f.icon}
              </div>
              <div>
                <div className="text-[0.8rem] font-semibold mb-0.5">{f.title}</div>
                <div className="text-[0.72rem] text-white/32 leading-snug">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Fade>

      {/* ── Main tool card ── */}
      <AnimatePresence mode="wait">

        {/* Upload */}
        {phase === 'upload' && (
          <motion.div key="upload"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/8 overflow-hidden"
            style={{ background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
          >
            <TitleBar title="framextractor — drop zone" />
            <div className="p-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
                className={`border border-dashed rounded-2xl py-14 px-8 text-center cursor-pointer transition-all duration-200 ${dragging ? 'border-[#5865F2]/60 bg-[#5865F2]/7' : 'border-white/10 bg-white/[0.015] hover:border-white/20 hover:bg-white/4'
                  }`}
              >
                <motion.div animate={dragging ? { scale: 1.03 } : { scale: 1 }} className="flex flex-col items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${dragging ? 'bg-[#5865F2]/15 border-[#5865F2]/35 text-[#5865F2]' : 'bg-white/4 border-white/9 text-white/28'
                    }`}>
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-[0.95rem] mb-1">
                      {dragging ? 'Drop to upload' : 'Drag & drop your video'}
                    </p>
                    <p className="text-[0.78rem] text-white/30 mb-3">or click to browse — MP4, WebM, Ogg supported</p>
                    <button
                      onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[0.78rem] font-medium border border-white/11 text-white/55 hover:text-white hover:border-white/22 hover:bg-white/5 transition-all cursor-pointer bg-transparent"
                    >
                      <Film size={12} /> Select video
                    </button>
                  </div>
                  <p className="text-[0.7rem] text-white/22">✓ Free · ✓ Private · ✓ No sign-up required</p>
                </motion.div>
                <input ref={fileInputRef} type="file" accept="video/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Editing */}
        {phase === 'editing' && videoSrc && (
          <motion.div key="editing"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/8 overflow-hidden"
            style={{ background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
          >
            <TitleBar title={fileName} />

            {/* Video */}
            <div className="p-4 pb-0">
              <div className="rounded-xl overflow-hidden bg-black aspect-video">
                <video ref={videoRef} src={videoSrc} controls muted playsInline
                  onLoadedMetadata={onVideoMeta}
                  className="w-full h-full object-contain block"
                />
              </div>
            </div>

            {/* Video info */}
            {duration > 0 && (
              <div className="flex items-center justify-center gap-4 flex-wrap px-4 pt-3 pb-0 text-[0.7rem]">
                {[['File', fileName], ['Duration', formatDuration(duration)], ['Resolution', `${dims.w}×${dims.h}`]].map(([label, val], i) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className="text-white/22 uppercase tracking-widest text-[0.62rem]">{label}</span>
                    <span className="text-white/45 max-w-[150px] truncate">{val}</span>
                    {i < 2 && <span className="w-px h-3 bg-white/9 ml-2" />}
                  </span>
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="p-4 flex flex-col gap-4">

              <div>
                <Label>Extraction Mode</Label>
                <Seg options={[{ value: 'first', label: 'First Frame' }, { value: 'all', label: 'All Frames' }]} value={mode} onChange={setMode} />
              </div>

              <AnimatePresence>
                {mode === 'all' && (
                  <motion.div key="all" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden flex flex-col gap-4">
                    <div>
                      <Label>Extraction Method</Label>
                      <Seg options={[{ value: 'fps', label: 'By FPS' }, { value: 'total', label: 'Total Count' }]} value={method} onChange={setMethod} />
                    </div>
                    {method === 'fps' ? (
                      <div>
                        <Label>Sampling Rate</Label>
                        <div className="flex items-center gap-3">
                          <input type="range" min={0.5} max={30} step={0.5} value={fps}
                            onChange={e => setFps(Number(e.target.value))} className="flex-1" />
                          <span className="text-[0.85rem] font-semibold text-white min-w-[60px] text-right">{fps} FPS</span>
                        </div>
                        <p className="text-[0.7rem] text-white/25 mt-1.5">Higher FPS = more frames & longer processing.</p>
                      </div>
                    ) : (
                      <div>
                        <Label>Number of Frames</Label>
                        <div className="flex items-center rounded-xl border border-white/10 overflow-hidden bg-white/4 focus-within:border-[#5865F2]/50 transition-colors">
                          <input type="number" value={totalFrames} min={1} max={5000}
                            onChange={e => setTotalFrames(Number(e.target.value))}
                            className="flex-1 bg-transparent border-0 px-3 py-2.5 text-[0.88rem] text-white outline-none" />
                          <span className="px-3 text-[0.72rem] text-white/28 border-l border-white/8">frames</span>
                        </div>
                        <p className="text-[0.7rem] text-white/25 mt-1.5">Evenly distributed across the full video.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <Label>Output Resolution</Label>
                <Seg options={[{ value: 'original', label: 'Original' }, { value: 'custom', label: 'Custom Width' }]} value={resolution} onChange={setResolution} />
                <AnimatePresence>
                  {resolution === 'custom' && (
                    <motion.div key="cres" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden pt-3 flex flex-col gap-2">
                      <Label>Width Preset</Label>
                      <select value={widthPreset} onChange={e => setWidthPreset(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[0.88rem] text-white outline-none pr-8 focus:border-[#5865F2]/50 cursor-pointer">
                        <option value={3840}>4K (3840px)</option>
                        <option value={2560}>2K (2560px)</option>
                        <option value={1920}>1080p (1920px)</option>
                        <option value={1280}>720p (1280px)</option>
                        <option value={854}>480p (854px)</option>
                        <option value={0}>Custom…</option>
                      </select>
                      {widthPreset === 0 && (
                        <div className="flex items-center rounded-xl border border-white/10 overflow-hidden bg-white/4 focus-within:border-[#5865F2]/50 transition-colors">
                          <input type="number" value={customWidth} min={100} max={7680}
                            onChange={e => setCustomWidth(Number(e.target.value))}
                            className="flex-1 bg-transparent border-0 px-3 py-2.5 text-[0.88rem] text-white outline-none" placeholder="Width in px…" />
                          <span className="px-3 text-[0.72rem] text-white/28 border-l border-white/8">px</span>
                        </div>
                      )}
                      <p className="text-[0.7rem] text-white/25">Height auto-calculated to maintain aspect ratio.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <Label>Output Format</Label>
                <select value={format} onChange={e => setFormat(e.target.value as typeof format)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[0.88rem] text-white outline-none pr-8 focus:border-[#5865F2]/50 cursor-pointer">
                  <option value="image/png">PNG (lossless)</option>
                  <option value="image/jpeg">JPEG (smaller size)</option>
                </select>
              </div>

              {/* Progress */}
              <AnimatePresence>
                {processing && (
                  <motion.div key="prog" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div className="flex justify-between mb-1.5 text-[0.7rem] text-white/30">
                      <span>Processing frames…</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-[3px] bg-white/8 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full bg-[#5865F2]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.18 }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                {!processing ? (
                  <button onClick={doExtract}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-[0.88rem] font-medium transition-all cursor-pointer border-0 shadow-[0_4px_16px_rgba(88,101,242,0.3)]">
                    <Zap size={14} /> {mode === 'first' ? 'Extract Frame' : 'Extract All Frames'}
                  </button>
                ) : (
                  <button onClick={() => { stopRef.current = true; setProcessing(false); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-red-500/12 border border-red-500/28 text-red-400 text-[0.88rem] font-medium hover:bg-red-500/22 transition-all cursor-pointer">
                    <StopCircle size={14} /> Stop
                  </button>
                )}
                <button onClick={reset}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/10 text-white/45 text-[0.8rem] hover:text-white hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer bg-transparent">
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              {/* Live preview */}
              <AnimatePresence>
                {frames.length > 0 && processing && (
                  <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-[0.7rem] text-white/28 mb-2">{frames.length} frame{frames.length !== 1 ? 's' : ''} captured so far</p>
                    <img src={frames[frames.length - 1]?.dataUrl} alt=""
                      className="w-full max-h-44 object-contain rounded-xl border border-white/8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Done */}
        {phase === 'done' && (
          <motion.div key="done"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.28 }}
            className="rounded-2xl border border-white/8 overflow-hidden"
            style={{ background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
          >
            <TitleBar title="framextractor — results" />
            <div className="p-5">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-green-500/7 border border-green-500/18 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500/15 border border-green-500/22 text-green-400">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <div className="font-semibold text-[0.88rem] mb-0.5">Extraction Complete</div>
                  <div className="text-[0.72rem] text-white/32">{frames.length} frame{frames.length !== 1 ? 's' : ''} ready to download</div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                {frames.slice(0, 8).map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                    className="aspect-video rounded-lg overflow-hidden border border-white/8 bg-black">
                    <img src={f.dataUrl} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
                {frames.length > 8 && (
                  <div className="aspect-video rounded-lg border border-white/8 bg-white/3 flex items-center justify-center text-[0.72rem] text-white/28">
                    +{frames.length - 8} more
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <button onClick={downloadAll}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-[0.88rem] font-medium transition-all cursor-pointer border-0 shadow-[0_4px_16px_rgba(88,101,242,0.3)]">
                  <Download size={14} /> {frames.length === 1 ? 'Download Frame' : `Download ZIP (${frames.length})`}
                </button>
                <button onClick={() => { setPhase('editing'); setFrames([]); }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/10 text-white/45 text-[0.8rem] hover:text-white hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer bg-transparent">
                  <ChevronRight size={12} /> Re-extract
                </button>
                <button onClick={reset}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/10 text-white/45 text-[0.8rem] hover:text-white hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer bg-transparent">
                  <RotateCcw size={12} /> New video
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* SEO section */}
      <div className="mt-16 pt-8 border-t border-white/5 text-center">
        {[
          { title: 'Extract frames from MP4, WebM and more', desc: 'FrameXtractor supports all video formats your browser can play — grab the perfect shot from any footage with zero server involvement.' },
          { title: 'Free · Private · Zero-upload', desc: 'No account, no payment, no data collection. All processing runs via the Canvas API locally in your browser.' },
          { title: 'Batch export · Flexible resolution · PNG & JPEG', desc: 'Export hundreds of frames at once. Choose 4K, 1080p, 720p or a custom width. Download individually or as a ZIP.' },
        ].map(item => (
          <div key={item.title} className="mb-6">
            <h2 className="text-[0.88rem] font-medium text-white/35 mb-1.5">{item.title}</h2>
            <p className="text-[0.78rem] text-white/20 max-w-xl mx-auto leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
