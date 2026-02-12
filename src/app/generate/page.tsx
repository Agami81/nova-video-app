'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import Link from 'next/link';
import { ArrowLeft, Wand2, Image as ImageIcon, Video } from 'lucide-react';
import styles from './page.module.css';

export default function GeneratePage() {
    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState<'image' | 'video'>('image');
    const [isGenerating, setIsGenerating] = useState(false);

    const [resultUrl, setResultUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setResultUrl(null);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, type: mode }),
            });

            const data = await response.json();

            if (data.url) {
                setResultUrl(data.url);
            } else {
                alert('Failed to generate. Please try again.');
            }
        } catch (error) {
            console.error('Generation failed', error);
            alert('Something went wrong.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <PageTransition>
            <div className="container">
                <header className={styles.header}>
                    <Link href="/" className={styles.backButton}>
                        <ArrowLeft size={24} />
                    </Link>
                    <h1>Create Magic</h1>
                    <div style={{ width: 24 }}></div> {/* Spacer for centering */}
                </header>

                <main className={styles.main}>
                    {resultUrl ? (
                        <div className={styles.resultContainer}>
                            {mode === 'image' ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={resultUrl} alt="Generated" className={styles.resultMedia} />
                            ) : (
                                <video src={resultUrl} controls className={styles.resultMedia} loop autoPlay muted />
                            )}
                            <button
                                className={styles.generateButton}
                                onClick={() => setResultUrl(null)}
                                style={{ marginTop: 24 }}
                            >
                                Generate Another
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.modeSwitch}>
                                <button
                                    className={`${styles.modeButton} ${mode === 'image' ? styles.active : ''}`}
                                    onClick={() => setMode('image')}
                                >
                                    <ImageIcon size={18} />
                                    Image
                                </button>
                                <button
                                    className={`${styles.modeButton} ${mode === 'video' ? styles.active : ''}`}
                                    onClick={() => setMode('video')}
                                >
                                    <Video size={18} />
                                    Video
                                </button>
                            </div>

                            <div className={styles.inputSection}>
                                <label className={styles.label}>Enter your prompt</label>
                                <textarea
                                    className={styles.textarea}
                                    placeholder={`Describe the ${mode} you want to create...`}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className={styles.styleSection}>
                                <label className={styles.label}>Choose a style</label>
                                <div className={styles.styleGrid}>
                                    {['Anime', 'Realistic', '3D Render', 'Cyberpunk', 'Oil Painting', 'Sketch'].map((style) => (
                                        <motion.button
                                            key={style}
                                            className={styles.styleButton}
                                            whileTap={{ scale: 0.95 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {style}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <motion.button
                                className={styles.generateButton}
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isGenerating ? (
                                    <>
                                        <Wand2 className={styles.spin} size={20} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={20} />
                                        Generate {mode === 'image' ? 'Image' : 'Video'}
                                    </>
                                )}
                            </motion.button>
                        </>
                    )}
                </main>
            </div>
        </PageTransition>
    );
}
