'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Search.module.css';

export default function Search() {
    const [term, setTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (term.trim()) {
            router.push(`/search?q=${encodeURIComponent(term)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className={styles.searchWrapper}>
            <svg
                className={styles.icon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
                type="text"
                placeholder="Search..."
                className={styles.input}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
        </form>
    );
}
