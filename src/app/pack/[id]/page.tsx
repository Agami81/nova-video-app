/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

// Mock Data (In a real app, this would come from a DB or Config)
const PACKS: Record<string, any> = {
    suit: {
        id: 'suit',
        title: 'Professional Suit',
        image: 'https://v3b.fal.media/files/monkey/A_professional_headshot_of_a_person_wearing_a_navy_blue_business_suit.png',
        description: 'Slide into next-level style with suits that do it all—sharp, smooth, and made to move with you. Whether it\'s boardroom power or rooftop drinks, you\'re covered.',
        features: [
            'Suit & Tie Headshot',
            'Suit Office Portrait',
            'Boardroom Suit Snapshot',
            'Professional Suit Profile',
            'Professional Suit Selfie'
        ],
        gallery: [
            'https://v3b.fal.media/files/kangaroo/business_man_office.png',
            'https://v3b.fal.media/files/lion/suit_portrait_studio.png',
            'https://v3b.fal.media/files/tiger/corporate_lifestyle.png'
        ]
    },
    decades: {
        id: 'decades',
        title: 'Decades Transformation',
        image: 'https://images.unsplash.com/photo-1548142353-6231d6dF4F5d?q=80&w=800&auto=format&fit=crop',
        description: 'Travel through time with a collection that reimagines you in the iconic styles of the 20s, 50s, 80s, and beyond. Vintage vibes, classic cuts, and timeless appeal.',
        features: [
            '1920s Gatsby Glamour',
            '1950s Rockabilly',
            '1980s Neon Pop',
            '90s Grunge Aesthetic',
            'Classic Hollywood Portrait'
        ],
        gallery: []
    },
    classy: {
        id: 'classy',
        title: 'Classy & Elegant',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
        description: 'Exude sophistication and grace. Perfect for high-end profiles, luxury visuals, or just looking your absolute best in evening wear and designer chic.',
        features: [
            'Evening Gown / Tuxedo',
            'Luxury Yacht Lifestyle',
            'High-Fashion Editorial',
            'Minimalist Chic',
            'Red Carpet Moment'
        ],
        gallery: []
    },
    hair: {
        id: 'hair',
        title: 'Hair Styles',
        image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop',
        description: 'Experiment with your look without the commitment. Try bangs, bobs, crazy colors, and flowing lengths to find your perfect new hairstyle.',
        features: [
            'Short Bob & Pixie Cut',
            'Long Flowing Waves',
            'Vibrant Hair Colors',
            'Braids & Updos',
            'Messy Bun Casual'
        ],
        gallery: []
    },
    y2k: {
        id: 'y2k',
        title: 'Y2K Aesthetic',
        image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop',
        description: 'Step back into the digital primitive era. Glossy textures, cyber vibes, pink filters, and butterfly clips. The early 2000s are calling.',
        features: [
            'Cyber Core Portrait',
            'Glossy Pop Star',
            'Retro Tech Vibes',
            'Butterfly & Glitter',
            'Early 2000s Streetwear'
        ],
        gallery: []
    },
    // LinkedIn / Professional Packs
    business: {
        id: 'business',
        title: 'Business Professional',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop', // Business man in suit
        description: 'The ultimate power move for your career. Sharp suits, confident poses, and high-end office backdrops that command respect.',
        features: ['Executive Headshot', 'Boardroom Candid', 'Keynote Speaker', 'Modern Office', 'Confidence Boost'],
        gallery: []
    },
    'street-casual': {
        id: 'street-casual',
        title: 'Street Casual',
        image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=800&auto=format&fit=crop', // Smart casual city
        description: 'Professional yet approachable. Perfect for startups, creatives, and modern networking. City vibes with a polished look.',
        features: ['City Bokeh', 'Smart Casual Outfit', 'Golden Hour Light', 'Coffee Shop Vibe', 'Tech Founder Look'],
        gallery: []
    },
    'black-background': {
        id: 'black-background',
        title: 'Studio Black',
        image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop', // Dark background portrait
        description: 'Dramatic, cinematic, and timeless. Focus entirely on you with deep shadows and elegant lighting that pops off the screen.',
        features: ['Rembrandt Lighting', 'Cinematic Contrast', 'Focus on Eyes', 'Minimalist Dark', 'Artist Profile'],
        gallery: []
    },
    'white-background': {
        id: 'white-background',
        title: 'Studio White',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', // White background portrait
        description: 'Clean, crisp, and versatile. The standard for medical, academic, and corporate profiles where clarity is king.',
        features: ['High-Key Lighting', 'Clean Cut', 'Passport Style', 'Friendly & Open', 'Neutral Tone'],
        gallery: []
    },
    'casual-selfie': {
        id: 'casual-selfie',
        title: 'Casual & Friendly',
        image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=800&auto=format&fit=crop', // Friendly selfie
        description: 'Show your authentic side. High-quality but down-to-earth photos that make you look like a person people want to work with.',
        features: ['Natural Smile', 'Soft Sunlight', 'Park/Nature Bg', 'Approachability', 'Social Media Ready'],
        gallery: []
    }
};

export default function PackDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const pack = PACKS[id] || PACKS['suit']; // Fallback to suit for demo

    const handleGetPack = () => {
        // For now, just simulate a purchase flow or go to generate
        // In the future: Check Credits -> Deduct -> Redirect
        router.push(`/upload?pack=${pack.id}`);
    };

    return (
        <div className={styles.container}>
            {/* Background Image */}
            <motion.img
                src={pack.image}
                alt={pack.title}
                className={styles.backgroundImage}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
            />

            {/* Close Button */}
            <Link href="/" className={styles.closeButton}>
                <X size={24} color="#000" />
            </Link>

            {/* Title Overlay in Middle */}
            <div style={{ position: 'absolute', top: '35%', left: 0, width: '100%', textAlign: 'center', zIndex: 2 }}>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ fontSize: 40, fontWeight: 800, color: 'white', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
                >
                    {pack.title}
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 4, fontWeight: 500 }}
                >
                    6 Photos
                </motion.p>
            </div>

            {/* Bottom Sheet */}
            <motion.div
                className={styles.contentSheet}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
                <div className={styles.headerRow}>
                    <span className={styles.title}>What&apos;s Inside</span>
                    <span className={styles.badge}>SNEAK PEEK</span>
                </div>

                <p className={styles.description}>
                    {pack.description}
                </p>

                <div className={styles.sectionTitle}>Styles & Avatars</div>
                <ul className={styles.featureList}>
                    {pack.features.map((feature: string, index: number) => (
                        <li key={index} className={styles.featureItem}>
                            <div className={styles.bullet}></div>
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* Example Gallery (Optional, from screenshot) */}
                <div className={styles.gallery}>
                    {/* Placeholders for gallery */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.galleryItem} style={{ opacity: 0.3 }} />
                    ))}
                </div>
            </motion.div>

            {/* Fixed Footer Button */}
            <div className={styles.footer}>
                <motion.button
                    className={styles.ctaButton}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetPack}
                >
                    Get This Pack
                </motion.button>
            </div>
        </div>
    );
}
