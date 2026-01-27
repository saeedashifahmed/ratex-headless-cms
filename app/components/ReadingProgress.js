'use client';

import { useEffect, useState } from 'react';
import styles from './ReadingProgress.module.css';

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = (scrollTop / docHeight) * 100;
            setProgress(Math.min(scrollProgress, 100));
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className={styles.progressContainer}>
            <div 
                className={styles.progressBar} 
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
