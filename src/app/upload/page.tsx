/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, Camera, Image as ImageIcon, Trash2, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { fal } from '@fal-ai/client';
import styles from './page.module.css';

// Configure Fal to use the proxy
fal.config({
    proxyUrl: '/api/fal/proxy',
});

function UploadGuidelinesContent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const packId = searchParams.get('pack');

    const handleUploadClick = () => {
        setIsModalOpen(true);
    };

    const handleCameraSelect = () => {
        setIsModalOpen(false);
        if (cameraInputRef.current) {
            cameraInputRef.current.click();
        }
    };

    const handleGallerySelect = () => {
        setIsModalOpen(false);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleActualFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            setFilesToUpload(prev => [...prev, ...newFiles]);

            const newUrls = newFiles.map(file => URL.createObjectURL(file));
            setSelectedFiles(prev => [...prev, ...newUrls]);
        }
        e.target.value = '';
    };

    const handleRemovePhoto = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setFilesToUpload(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleStartTraining = async () => {
        if (selectedFiles.length < 5) {
            setUploadError("Please select at least 5 photos for better accuracy.");
            return;
        }
        setIsUploading(true);
        setUploadError('');

        try {
            // Upload all files concurrently
            const uploadPromises = filesToUpload.map(file => fal.storage.upload(file));
            const uploadedUrls = await Promise.all(uploadPromises);

            // Pass the comma-separated URLs to the processing page
            // Use the first URL as the main 'image_url' for backward compatibility/preview
            const mainUrl = uploadedUrls[0];
            const allUrlsParam = encodeURIComponent(uploadedUrls.join(','));

            router.push(`/processing?pack=${packId || 'custom'}&image_url=${encodeURIComponent(mainUrl)}&image_urls=${allUrlsParam}`);

        } catch (error: any) {
            console.error("Upload failed:", error);
            setUploadError(`Upload failed: ${error.message || error.toString()}. Please try again.`);
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Hidden Inputs for File/Camera */}
            <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                className={styles.hiddenInput}
                onChange={handleActualFileChange}
            />
            {/* Capture attribute triggers camera on mobile */}
            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraInputRef}
                className={styles.hiddenInput}
                onChange={handleActualFileChange}
            />

            <Link href="/how-it-works" className={styles.closeButton}>
                <X size={28} color="#fff" />
            </Link>

            {selectedFiles.length > 0 && (
                <div className={styles.countBadge}>
                    {selectedFiles.length} Photos
                </div>
            )}

            <h1 className={styles.title}>
                {selectedFiles.length > 0 ? 'Review your photos' : 'Pick 5-10 photos of\nyourself'}
            </h1>

            {selectedFiles.length > 0 ? (
                <div className={styles.previewGrid}>
                    {selectedFiles.map((src, index) => (
                        <motion.div
                            key={index}
                            className={styles.previewCard}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt={`Upload ${index}`} className={styles.image} />
                            <div className={styles.removeButton} onClick={() => handleRemovePhoto(index)}>
                                <Trash2 size={14} color="#fff" />
                            </div>
                        </motion.div>
                    ))}
                    <motion.div
                        className={styles.addCard}
                        onClick={handleUploadClick}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus size={32} color="rgba(255,255,255,0.5)" />
                    </motion.div>
                </div>
            ) : (
                <>
                    {/* GOOD PHOTOS SECTION */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <CheckCircle2 size={20} className={styles.goodText} fill="currentColor" color="#000" />
                            <span className={styles.goodText}>Good photos</span>
                        </div>
                        <p className={styles.description}>
                            We need close-up selfies of the same person, taken from a variety of angles and with different facial expressions and backgrounds
                        </p>
                        <div className={styles.grid}>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={`good-${i}`} className={styles.card}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`https://v3b.fal.media/files/monkey/good_selfie_${i}.jpg`}
                                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/150/333/fff?text=Good'}
                                        alt="Good example"
                                        className={styles.image}
                                    />
                                    <div className={styles.iconBadge}>
                                        <CheckCircle2 size={16} fill="#2ecc71" color="#fff" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BAD PHOTOS SECTION */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <XCircle size={20} className={styles.badText} fill="currentColor" color="#000" />
                            <span className={styles.badText}>Bad photos</span>
                        </div>
                        <p className={styles.description}>
                            Group pics, sunglasses, animals, face small or not visible, nudes, monotonous pics, kids
                        </p>
                        <div className={styles.grid}>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={`bad-${i}`} className={styles.card}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`https://v3b.fal.media/files/monkey/bad_selfie_${i}.jpg`}
                                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/150/333/fff?text=Bad'}
                                        alt="Bad example"
                                        className={styles.image}
                                    />
                                    <div className={styles.iconBadge}>
                                        <XCircle size={16} fill="#e74c3c" color="#fff" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Footer */}
            <div className={styles.footer}>
                <motion.button
                    className={styles.ctaButton}
                    whileTap={{ scale: 0.95 }}
                    onClick={selectedFiles.length > 0 ? handleStartTraining : handleUploadClick}
                    disabled={isUploading}
                    style={{
                        background: selectedFiles.length > 0 ? 'var(--brand-gradient)' : '#fff',
                        color: selectedFiles.length > 0 ? '#fff' : '#000',
                        opacity: isUploading ? 0.7 : 1
                    }}
                >
                    {isUploading ? (
                        <>
                            <Loader2 size={20} className={styles.spin} style={{ marginRight: 8 }} />
                            Uploading...
                        </>
                    ) : (
                        selectedFiles.length > 0 ? `Start Training` : 'Upload Photos'
                    )}
                </motion.button>
                {uploadError && <p style={{ color: '#ff4d4f', marginTop: 12, textAlign: 'center' }}>{uploadError}</p>}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={styles.modalContent}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className={styles.modalHeader}>
                                <X size={24} className={styles.modalClose} onClick={() => setIsModalOpen(false)} />
                                <span className={styles.modalTitle}>Take photo from</span>
                                <div style={{ width: 24 }}></div> {/* Spacer to center title */}
                            </div>

                            <button className={styles.optionButton} onClick={handleCameraSelect}>
                                <Camera size={24} color="#999" />
                                <span>Camera</span>
                            </button>

                            <button className={styles.optionButton} onClick={handleGallerySelect}>
                                <ImageIcon size={24} color="#999" />
                                <span>Gallery</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function UploadGuidelinesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UploadGuidelinesContent />
        </Suspense>
    );
}
