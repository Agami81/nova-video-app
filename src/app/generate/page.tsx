'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import Link from 'next/link';
import { ArrowLeft, Wand2, Image as ImageIcon, Video } from 'lucide-react';
import styles from './page.module.css';

function GenerateContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get initial state from URL
    const initialMode = searchParams.get('mode') as 'image' | 'video' || 'image';
    const initialStyle = searchParams.get('style') || '';

    const [prompt, setPrompt] = useState(initialStyle ? `A ${initialStyle} portrait of...` : '');
    const [mode, setMode] = useState<'image' | 'video'>(initialMode);
    const [selectedStyle, setSelectedStyle] = useState(initialStyle);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [resultUrl, setResultUrl] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        if (!prompt && !selectedImage) return;
        setIsGenerating(true);
        setResultUrl(null);

        try {
            // TODO: Upload image to blob storage first if selectedImage exists
            // For now, we'll just simulate/send prompt

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    type: mode,
                    style: selectedStyle,
                    // image_url: uploadedImageUrl 
                }),
            });

            const data = await response.json();

            if (data.url) {
                setResultUrl(data.url);
            } else {
                alert(`Failed to generate: ${data.error || 'Unknown error'}`);
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
                    <div style={{ width: 24 }}></div>
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

                            {/* Image Upload for Img2Img */}
                            {mode === 'image' && (
                                <div className={styles.inputSection}>
                                    <label className={styles.label}>
                                        Upload Source Image (Optional)
                                    </label>
                                    <div className={styles.uploadBox} onClick={() => document.getElementById('fileInput')?.click()}>
                                        {imagePreview ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                                        ) : (
                                            <div className={styles.uploadPlaceholder}>
                                                <ImageIcon size={24} color="#666" />
                                                <span>Click to upload photo</span>
                                            </div>
                                        )}
                                        <input
                                            id="fileInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={styles.inputSection}>
                                <label className={styles.label}>
                                    {selectedStyle ? `Refine your ${selectedStyle} prompt` : 'Enter your prompt'}
                                </label>
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
                                    {['Anime', 'Realistic', '3D Render', 'Cyberpunk', 'Oil Painting', 'Sketch', ...(selectedStyle && !['Anime', 'Realistic', '3D Render', 'Cyberpunk', 'Oil Painting', 'Sketch'].includes(selectedStyle) ? [selectedStyle] : [])].map((style) => (
                                        <motion.button
                                            key={style}
                                            className={`${styles.styleButton} ${selectedStyle === style ? styles.activeStyle : ''}`}
                                            onClick={() => setSelectedStyle(style)}
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
                                disabled={isGenerating || (!prompt && !selectedImage)}
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
                                        Generate {selectedStyle ? selectedStyle : (mode === 'image' ? 'Image' : 'Video')}
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

export default function GeneratePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GenerateContent />
        </Suspense>
    );
}
