'use client';

import { motion } from 'framer-motion';
import { X, Star, ScanFace } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function HowItWorksPage() {
    return (
        <div className={styles.container}>
            {/* Background Grid - Placeholder Image simulating the grid */}
            <img
                src="https://v3b.fal.media/files/kangaroo/business_man_office.png" // Placeholder
                alt="Background"
                className={styles.backgroundImage}
                style={{ filter: 'grayscale(0.5)' }}
            />
            <div className={styles.gridOverlay}></div>

            <Link href="/" className={styles.closeButton}>
                <X size={28} />
            </Link>

            {/* Bottom Card */}
            <motion.div
                className={styles.contentCard}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className={styles.title}>How it Works?</h1>

                <div className={styles.step}>
                    <div className={styles.iconContainer}>
                        <Star size={20} color="#fff" fill="white" />
                    </div>
                    <p className={styles.stepText}>
                        AI analyzes your appearance to create personalized photo and video content.
                    </p>
                </div>

                <div className={styles.step}>
                    <div className={styles.iconContainer}>
                        <ScanFace size={20} color="#fff" />
                    </div>
                    <p className={styles.stepText}>
                        Upload your photos to build your AI profile and start generating unique creations.
                    </p>
                </div>

                <div className={styles.footer}>
                    <Link href="/upload" style={{ textDecoration: 'none' }}>
                        <motion.button
                            className={styles.ctaButton}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
