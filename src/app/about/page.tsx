import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About',
    description:
        'FrameXtractor is a free, privacy-first video frame extraction tool built by caosdev. No uploads, no account, no server — 100% client-side using the browser Canvas API.',
    keywords: ['about framextractor', 'caosdev', 'free video tool', 'privacy video extractor', 'client-side video processing'],
    alternates: { canonical: 'https://framextractor.vercel.app/about' },
    openGraph: {
        title: 'About FrameXtractor — Free, Private Video Frame Extractor',
        description: 'Built by caosdev. No uploads, no servers, no tracking. Completely free video frame extraction in your browser.',
        url: 'https://framextractor.vercel.app/about',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About FrameXtractor' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About FrameXtractor',
        description: 'Free, private video frame extractor. Built by caosdev. No uploads ever.',
    },
};

export default function AboutPage() {
    return <AboutClient />;
}
