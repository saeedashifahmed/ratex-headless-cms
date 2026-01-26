import Link from 'next/link';
import styles from './Pagination.module.css';

export default function Pagination({ pageInfo, basePath = '/' }) {
    if (!pageInfo) return null;
    const { hasNextPage, endCursor } = pageInfo;

    // Simple "Load More" style or Next/Prev link logic.
    // Since WP GraphQL cursor pagination is tricky with simple URLs (requires state or ugly cursors in URL),
    // we'll implement a "Next Page" link that passes the cursor.
    // BUT: Next.js standard pagination usually uses ?page=2. 
    // WP GraphQL uses cursors. 
    // For a headless blog, a "Load More" button (Client Component) is best, OR standard links.

    // Let's stick to a simple Next link for now if possible, but honestly for a blog listing,
    // cursor based pagination via URL ?after=CURSOR works.

    if (!hasNextPage) return null;

    return (
        <div className={styles.wrapper}>
            <Link href={`${basePath}?after=${endCursor}`} className={styles.link}>
                Next Page &rarr;
            </Link>
        </div>
    );
}
