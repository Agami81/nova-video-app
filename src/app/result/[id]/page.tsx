/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './page.module.css';
import PageTransition from '../../../components/PageTransition';

// Reusing pack data logic for simplicity (or imported from shared config)
const RESULTS: Record<string, string[]> = {
    suit: [
        'https://v3b.fal.media/files/monkey/A_professional_headshot_of_a_person_wearing_a_navy_blue_business_suit.png',
        'https://v3b.fal.media/files/kangaroo/business_man_office.png',
        'https://v3b.fal.media/files/lion/suit_portrait_studio.png',
        'https://v3b.fal.media/files/tiger/corporate_lifestyle.png'
    ],
    decades: [
        'https://images.unsplash.com/photo-1548142353-6231d6dF4F5d?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop', // 50s
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', // 80s
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop'
    ],
    classy: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop'
    ],
    hair: [
        'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560298803-1d998f6b5249?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582610116397-edb318620f90?q=80&w=800&auto=format&fit=crop'
    ],
    y2k: [
        'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515378866763-cd6d09121c60?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=800&auto=format&fit=crop'
    ]
};

function ResultContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = params.id as string;
    const generatedUrl = searchParams.get('url');

    // Use generated URL if available, otherwise fallback to mock
    // In a real app, we likely saved this to DB and would fetch by ID, 
    // but passing URL is fine for this stateless MVP.
    const images = generatedUrl ? [generatedUrl, ...RESULTS[id] || []] : (RESULTS[id] || RESULTS['suit']);

    return (
        <PageTransition>
            <div className={styles.container}>
                <header className={styles.header}>
                    <Link href="/" className={styles.backButton}>
                        <ArrowLeft size={24} />
                    </Link>
                    <span className={styles.title}>Your {id.charAt(0).toUpperCase() + id.slice(1)} Results</span>
                    <div style={{ width: 40 }}></div>
                </header>

                <main className={styles.gallery}>
                    {images.map((src, index) => (
                        <motion.div
                            key={index}
                            className={styles.imageCard}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <img src={src} alt="Result" className={styles.image} />
                            {index === 0 && generatedUrl && (
                                <div style={{
                                    position: 'absolute', top: 10, right: 10,
                                    background: 'var(--brand-gradient)', padding: '4px 8px',
                                    borderRadius: 4, fontSize: 10, fontWeight: 'bold'
                                }}>
                                    NEW
                                </div>
                            )}
                        </motion.div>
                    ))}
                </main>

                <div className={styles.actionBar}>
                    <button className={styles.secondaryButton} onClick={() => alert('Shared!')}>
                        <Share2 size={20} />
                    </button>
                    <button className={styles.actionButton} onClick={() => alert('Saved to Gallery!')}>
                        <Download size={20} />
                        Save All
                    </button>
                </div>
            </div>
        </PageTransition>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={<div>Loading Results...</div>}>
            <ResultContent />
        </Suspense>
    );
}
