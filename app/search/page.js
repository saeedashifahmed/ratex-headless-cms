import { getSearchResults, replaceUrls } from '@/lib/api';
import Link from 'next/link';
import styles from '../page.module.css';

export default async function SearchPage({ searchParams }) {
    const { q } = await searchParams;
    const posts = q ? await getSearchResults(q) : [];

    return (
        <div className="container">
            <div style={{ padding: '4rem 0 2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Search Results for "{q}"
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Found {posts.length} results.
                </p>
            </div>

            <div className={styles.postGrid}>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <article key={post.slug} className={styles.card}>
                            <Link href={`/${post.slug}`} className={styles.cardCoverLink}>
                                <div className={styles.cardImage}>
                                    {post.featuredImage?.node?.sourceUrl ? (
                                        <img
                                            src={post.featuredImage.node.sourceUrl}
                                            alt={post.title}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            background: '#f0f0f0',
                                        }} />
                                    )}
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardMeta}>
                                        <span>{new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className={styles.cardTitle}>{post.title}</h2>
                                    <div
                                        className={styles.cardExcerpt}
                                        dangerouslySetInnerHTML={{ __html: replaceUrls(post.excerpt) }}
                                    />
                                </div>
                            </Link>
                        </article>
                    ))
                ) : (
                    <p>No posts found matching your search.</p>
                )}
            </div>
        </div>
    );
}
