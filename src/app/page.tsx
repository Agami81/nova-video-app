'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Globe, Zap, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import styles from './page.module.css';

interface CategoryItem {
  title: string;
  count: string;
  gradient: string;
  textColor?: string;
}

interface CategorySection {
  title: string;
  items: CategoryItem[];
  type: 'Photos' | 'Video';
}

const categories: CategorySection[] = [
  {
    title: 'Linkedin',
    type: 'Photos',
    items: [
      { title: 'Business', count: '6 Photos', gradient: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }, // Dark Blue/Slate
      { title: 'Street Casual', count: '6 Photos', gradient: 'linear-gradient(to right, #434343 0%, #000000 100%)' }, // Modern Dark
      { title: 'Black Background', count: '6 Photos', gradient: 'linear-gradient(to top, #000000 0%, #434343 100%)' },
      { title: 'White Background', count: '6 Photos', gradient: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)', textColor: '#000' }, // Light
      { title: 'Casual Selfie', count: '6 Photos', gradient: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)' }, // Warm
    ]
  },
  {
    title: 'Trends', // Renamed from "Linkedin" (original dummy data) to "Trends"
    type: 'Photos',
    items: [
      { title: 'Suit', count: '6 Photos', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { title: 'Office', count: '6 Photos', gradient: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)' },
    ]
  },
  {
    title: 'Aging',
    type: 'Photos',
    items: [
      { title: '20 Years', count: '6 Photos', gradient: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)' },
      { title: 'Old Self', count: '6 Photos', gradient: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)' },
      { title: 'Future', count: '6 Photos', gradient: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)' },
    ]
  },
  {
    title: 'Minime',
    type: 'Video',
    items: [
      { title: 'Photoshoot', count: '1 Video', gradient: 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)' },
      { title: 'Chef', count: '1 Video', gradient: 'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)' },
      { title: 'Luxury', count: '1 Video', gradient: 'linear-gradient(to top, #5ee7df 0%, #b490ca 100%)' },
    ]
  },
];

// Content for the dynamic slider
const HERO_SLIDES = [
  {
    id: 'decades',
    title: 'Create 60 Decades\nTransformation\nversions of you',
    buttonText: 'Try Decades Transformation >',
    image: 'https://images.unsplash.com/photo-1548142353-6231d6dF4F5d?q=80&w=800&auto=format&fit=crop', // Vintage/B&W style
    link: '/pack/decades'
  },
  {
    id: 'classy',
    title: 'Create 60 Classy\nversions of you',
    buttonText: 'Try Classy >',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', // Elegant portrait
    link: '/pack/classy'
  },
  {
    id: 'hair',
    title: 'Create 60 Hair Styles\nversions of you',
    buttonText: 'Try Hair Styles >',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop', // Dynamic hair
    link: '/pack/hair'
  },
  {
    id: 'y2k',
    title: 'Create 60 Y2K versions\nof you',
    buttonText: 'Try Y2K >',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop', // Retro/Pink filter
    link: '/pack/y2k'
  }
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[currentImageIndex];

  return (
    <PageTransition>
      <div className={styles.homeContainer}>
        {/* Full Screen Hero with Header Overlay */}
        <div className={styles.heroWrapper}>

          {/* Slider Background Image */}
          <AnimatePresence>
            <motion.img
              key={currentSlide.image}
              src={currentSlide.image}
              alt="Hero Background"
              className={styles.heroImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            />
          </AnimatePresence>

          {/* Gradient Overlay to ensure text readability - Static */}
          <div className={styles.heroOverlay}></div>

          <header className={styles.header}>
            <div className={styles.logo}>MOMO</div>
            <div className={styles.pointsBadge}>
              <Sparkles size={14} className={styles.sparkleIcon} />
              <span>1000</span>
            </div>
          </header>

          {/* Dynamic Text Content */}
          <div className={styles.heroContent}>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <h1 style={{ whiteSpace: 'pre-line' }}>{currentSlide.title}</h1>
                <Link href={currentSlide.link} className={styles.heroButton}>
                  {currentSlide.buttonText}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Navigation */}
          <div className={styles.heroDots}>
            {HERO_SLIDES.map((_, index) => (
              <div
                key={index}
                className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              ></div>
            ))}
          </div>
        </div>

        <main className={styles.mainContent}>
          {categories.map((section, sectionIndex) => (
            <section key={section.title} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>{section.title}</h2>
                {/* <Link href="#" className={styles.seeAll}>See All</Link> */}
              </div>

              <div className={styles.horizontalScroll}>
                {section.items.map((item, index) => (
                  <Link
                    href={`/pack/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    key={item.title}
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.div
                      className={styles.card}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sectionIndex * 0.1 + index * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={styles.cardImagePlaceholder} style={{ background: item.gradient }}>
                        {/* Overlay for text */}
                        <div className={styles.cardOverlay} style={{ color: (item as any).textColor || '#fff' }}>
                          <h3>{item.title}</h3>
                          <p style={{ color: (item as any).textColor ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }}>{item.count}</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {/* Extra spacing for bottom nav */}
          <div style={{ height: 40 }}></div>
        </main>

        {/* Bottom Navigation */}
        <footer className={styles.bottomNav}>
          <Link href="/" className={`${styles.bottomNavItem} ${styles.active} `}>
            <Globe size={24} />
            <span>Explore</span>
          </Link>
          <Link href="/how-it-works" className={styles.bottomNavItem}>
            <motion.div className={styles.oneShotIcon} whileTap={{ scale: 0.8 }}>
              <Zap size={20} fill="currentColor" />
            </motion.div>
            <span>One Shot</span>
          </Link>
          <Link href="/profile" className={styles.bottomNavItem}>
            <User size={24} />
            <span>My Profile</span>
          </Link>
        </footer>
      </div>
    </PageTransition>
  );
}
