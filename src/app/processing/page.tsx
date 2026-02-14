'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import PageTransition from '../../components/PageTransition';

function ProcessingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const packId = searchParams.get('pack') || 'custom';
    const imageUrl = searchParams.get('image_url');
    const imageUrlsParam = searchParams.get('image_urls');
    const imageUrls = imageUrlsParam ? decodeURIComponent(imageUrlsParam).split(',') : (imageUrl ? [imageUrl] : undefined);

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing...');

    useEffect(() => {
        let isMounted = true;

        const startGeneration = async () => {
            try {
                // Simulate initial progress
                setStatus('Uploading & Analyzing...');
                const progInterval = setInterval(() => {
                    setProgress(prev => {
                        if (prev >= 90) return 90; // Hang at 90% until done
                        return prev + (prev < 30 ? 2 : 0.5);
                    });
                }, 100);

                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: `A photo of a person in ${packId} style, high quality, 8k, photorealistic`, // improved prompt
                        type: 'image',
                        style: packId,
                        image_url: imageUrl,
                        image_urls: imageUrls
                    })
                });

                const data = await response.json();
                clearInterval(progInterval);

                if (data.url) {
                    setProgress(100);
                    setStatus('Finalizing...');
                    setTimeout(() => {
                        if (isMounted) router.push(`/result/${packId}?url=${encodeURIComponent(data.url)}`);
                    }, 500);
                } else {
                    setStatus('Failed');
                    alert(`DEBUG ERROR: ${data.error}`);
                    router.push('/generate');
                }

            } catch (error) {
                console.error(error);
                setStatus('Error');
                alert('Something went wrong');
            }
        };

        if (imageUrl) {
            startGeneration();
        } else {
            // Fallback simulation if no image (dev mode/legacy)
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => router.push(`/result/${packId}`), 500);
                        return 100;
                    }
                    if (prev === 20) setStatus('Generating Embeddings...');
                    if (prev === 50) setStatus(`Applying ${packId} Style...`);
                    return prev + 1;
                });
            }, 50);
            return () => clearInterval(interval);
        }

        return () => { isMounted = false; };
    }, [packId, imageUrl, router]);

    return (
        <PageTransition>
            <div className={styles.container}>
                <motion.div
                    className={styles.loader}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className={styles.loaderRing}></div>
                    <div className={styles.loaderInner}>{progress}%</div>
                </motion.div>

                <motion.h1
                    className={styles.statusText}
                    key={status}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    {status}
                </motion.h1>

                <div style={{ color: 'blue', fontWeight: 'bold', marginTop: '10px', fontSize: '20px' }}>DEBUG MODE ACTIVE v4</div>

                <p className={styles.subText}>
                    Please wait while our AI works its magic on your photos. Do not close this page.
                </p>

                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </PageTransition>
    );
}

export default function ProcessingPage() {
    return (
        <Suspense fallback={<div>Starting AI...</div>}>
            <ProcessingContent />
        </Suspense>
    );
}
