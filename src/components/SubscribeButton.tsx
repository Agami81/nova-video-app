'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubscribeButton() {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error("Subscription error", error);
            alert(`Setup Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.button
            onClick={handleSubscribe}
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            style={{
                background: 'linear-gradient(to right, #8a2387, #e94057, #f27121)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                color: 'white',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'center',
                marginTop: '16px'
            }}
        >
            <Zap fill="white" size={18} />
            {loading ? 'Processing...' : 'Upgrade to Pro ($10/mo)'}
        </motion.button>
    );
}
