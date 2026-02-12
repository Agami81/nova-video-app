'use client';

import Link from 'next/link';
import { Sparkles, Globe, Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import styles from './page.module.css';

interface CategoryItem {
  title: string;
  count: string;
  gradient: string;
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
      { title: 'Suit', count: '6 Photos', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { title: 'Office', count: '6 Photos', gradient: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)' },
      { title: 'Business', count: '6 Photos', gradient: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' },
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

export default function Home() {
  return (
    <PageTransition>
      <div className="container">
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>NOVA</div>
          <div className={styles.pointsBadge}>
            <Sparkles size={14} className={styles.sparkleIcon} />
            <span>1000</span>
          </div>
        </header>
        <div className={styles.headerSeeAll}>See All</div>

        <nav className={styles.topNav}>
          {/* Hero Section */}
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <h1>Create 60 Linkedin<br />versions of you</h1>
              <Link href="/generate" className={styles.heroButton}>
                Try Linkedin &gt;
              </Link>
            </div>
            <div className={styles.heroDots}>
              <div className={`${styles.dot} ${styles.activeDot}`}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>
        </nav>

        <main className={styles.mainContent}>
          {categories.map((section, sectionIndex) => (
            <section key={section.title} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>{section.title}</h2>
                <Link href="#" className={styles.seeAll}>See All</Link>
              </div>

              <div className={styles.horizontalScroll}>
                {section.items.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className={styles.card}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.1 + index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={styles.cardImagePlaceholder} style={{ background: item.gradient }}>
                      {/* Overlay for text */}
                      <div className={styles.cardOverlay}>
                        <h3>{item.title}</h3>
                        <p>{item.count}</p>
                      </div>
                    </div>
                  </motion.div>
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
          <Link href="/generate" className={styles.bottomNavItem}>
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
