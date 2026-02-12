

import Link from 'next/link';
import { Settings, Share2, Grid, Heart, Bookmark } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import SubscribeButton from '../../components/SubscribeButton';
import styles from './page.module.css';

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../lib/db";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: userId }
    });

    // Fallback if user doesn't exist yet (webhook delay)
    const credits = user?.credits ?? 0;

    return (
        <PageTransition>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerTitle}>My Profile</div>
                    <div className={styles.headerIcons}>
                        <UserButton />
                        <button className={styles.iconButton}><Share2 size={20} /></button>
                        <button className={styles.iconButton}><Settings size={20} /></button>
                    </div>
                </header>

                <section className={styles.profileInfo}>
                    <div className={styles.avatar}>
                        <span>JD</span>
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>124</span>
                            <span className={styles.statLabel}>Following</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>5.2k</span>
                            <span className={styles.statLabel}>Followers</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>12.5k</span>
                            <span className={styles.statLabel}>Likes</span>
                        </div>
                    </div>
                </section>

                <div className={styles.bio}>
                    <h2>John Doe</h2>
                    <p>AI Artist & Creator. Making dreams visual.</p>
                </div>

                <div className={styles.creditBadge}>
                    <span>💎 {credits} Credits Available</span>
                </div>

                {!user?.isSubscribed && (
                    <div style={{ padding: '0 20px 20px' }}>
                        <SubscribeButton />
                    </div>
                )}

                <nav className={styles.tabs}>
                    <button className={`${styles.tab} ${styles.active}`}>
                        <Grid size={18} />
                        <span>Creations</span>
                    </button>
                    <button className={styles.tab}>
                        <Heart size={18} />
                        <span>Likes</span>
                    </button>
                    <button className={styles.tab}>
                        <Bookmark size={18} />
                        <span>Saved</span>
                    </button>
                </nav>

                <div className={styles.grid}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={styles.gridItem}>
                            <div className={styles.placeholderImage} style={{ filter: `hue-rotate(${i * 45}deg)` }} />
                        </div>
                    ))}
                </div>

                <Link href="/" className={styles.homeButton}>
                    Back to Home
                </Link>
            </div>
        </PageTransition>
    );
}
