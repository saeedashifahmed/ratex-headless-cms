'use client';

import { usePathname } from 'next/navigation';
import styles from './SocialShare.module.css';

export default function SocialShare({ title }) {
    const pathname = usePathname();
    // Safe url construction (client-side only usually, but handled gracefully)
    const url = typeof window !== 'undefined' ? window.location.origin + pathname : '';

    const handleShare = (network) => {
        if (!url) return;

        let shareUrl = '';

        switch (network) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    const copyLink = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className={styles.wrapper}>
            <button onClick={() => handleShare('twitter')} className={styles.shareBtn}>
                Twitter
            </button>
            <button onClick={() => handleShare('linkedin')} className={styles.shareBtn}>
                LinkedIn
            </button>
            <button onClick={copyLink} className={styles.shareBtn}>
                Copy Link
            </button>
        </div>
    );
}
