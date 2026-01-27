import Link from 'next/link';
import styles from './Pagination.module.css';

export default function Pagination({ pageInfo, basePath = '/' }) {
    if (!pageInfo) return null;
    const { hasNextPage, endCursor } = pageInfo;

    if (!hasNextPage) return null;

    return (
        <div className={styles.wrapper}>
            <Link href={`${basePath}?after=${endCursor}`} className={styles.link}>
                Load More Articles
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </Link>
        </div>
    );
}
