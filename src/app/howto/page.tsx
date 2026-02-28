import type { Metadata } from 'next';
import HowToClient from './HowToClient';

export const metadata: Metadata = {
    title: 'How to Use',
    description:
        'Step-by-step guide to extract frames from any video using FrameXtractor. Free, no sign-up — drop a video, configure settings, and download PNG or JPEG frames in seconds.',
    keywords: ['how to extract video frames', 'video frame guide', 'framextractor tutorial', 'screenshot from video free'],
    alternates: { canonical: 'https://framextractor.vercel.app/howto' },
    openGraph: {
        title: 'How to Use FrameXtractor — Free Video Frame Extraction Guide',
        description: 'Four simple steps to extract high-quality frames from any video. Free, private, no account required.',
        url: 'https://framextractor.vercel.app/howto',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FrameXtractor — How to Use' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'How to Use FrameXtractor',
        description: 'Extract video frames in 4 steps — free, private, in your browser.',
    },
};

export default function HowToPage() {
    return <HowToClient />;
}
