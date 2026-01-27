import { getAllPosts, replaceUrls } from '@/lib/api';
import Link from 'next/link';
import Pagination from './components/Pagination';
import styles from './page.module.css';

// Revalidate every 60 seconds
export const revalidate = 60;

// Helper function to calculate reading time
function calculateReadingTime(content) {
    if (!content) return '5 min read';
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}

// Helper function to get author initials
function getAuthorInitials(name) {
    if (!name) return 'R';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default async function Home({ searchParams }) {
    const { after } = await searchParams;
    const data = await getAllPosts(after);

    const posts = data?.nodes || [];
    const pageInfo = data?.pageInfo || {};

    if (!data || posts.length === 0) {
        return (
            <div className={styles.noPosts}>
                <svg className={styles.noPostsIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                </svg>
                <h2>No Articles Found</h2>
                <p>We couldn&apos;t find any articles. Please check back later.</p>
            </div>
        );
    }

    // Separate the first post as "Featured" (only on first page)
    const isFirstPage = !after;
    const featuredPost = isFirstPage ? posts[0] : null;
    const gridPosts = isFirstPage ? posts.slice(1) : posts;

    return (
        <div>
            {/* Featured Article Section */}
            {featuredPost && (
                <section className={styles.heroSection}>
                    <div className={styles.heroContainer}>
                        <article className={`${styles.featuredArticle} animate-fade-in`}>
                            <div className={styles.featuredImageWrapper}>
                                {featuredPost.featuredImage?.node?.sourceUrl ? (
                                    <Link href={`/${featuredPost.slug}`}>
                                        <img
                                            src={featuredPost.featuredImage.node.sourceUrl}
                                            alt={featuredPost.title}
                                            className={styles.featuredImage}
                                        />
                                    </Link>
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)' }} />
                                )}
                            </div>
                            <div className={styles.featuredContent}>
                                <span className={styles.featuredBadge}>
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                                    </svg>
                                    Featured Story
                                </span>
                                <h1 className={styles.featuredTitle}>
                                    <Link href={`/${featuredPost.slug}`}>
                                        {featuredPost.title}
                                    </Link>
                                </h1>
                                <div
                                    className={styles.featuredExcerpt}
                                    dangerouslySetInnerHTML={{ __html: replaceUrls(featuredPost.excerpt) }}
                                />
                                <div className={styles.featuredMeta}>
                                    <div className={styles.authorInfo}>
                                        {featuredPost.author?.node?.avatar?.url ? (
                                            <img 
                                                src={featuredPost.author.node.avatar.url} 
                                                alt={featuredPost.author.node.name}
                                                className={styles.authorAvatar}
                                            />
                                        ) : (
                                            <div className={styles.authorAvatarPlaceholder}>
                                                {getAuthorInitials(featuredPost.author?.node?.name)}
                                            </div>
                                        )}
                                        <span className={styles.authorName}>
                                            {featuredPost.author?.node?.name || 'Ratex Editorial'}
                                        </span>
                                    </div>
                                    <span className={styles.metaDivider} />
                                    <time className={styles.metaDate} dateTime={featuredPost.date}>
                                        {new Date(featuredPost.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </time>
                                </div>
                                <Link href={`/${featuredPost.slug}`} className={styles.readMoreButton}>
                                    Read Full Article
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    </div>
                </section>
            )}

            {/* Latest Articles Grid */}
            <section className={styles.latestSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        {isFirstPage ? 'Latest Articles' : 'More Articles'}
                    </h2>
                    <Link href="/category/all" className={styles.viewAllLink}>
                        View All
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>

                <div className={styles.postGrid}>
                    {gridPosts.map((post, index) => (
                        <article
                            key={post.slug}
                            className={`${styles.postCard} animate-fade-in`}
                            style={{ animationDelay: `${0.1 + (index % 3) * 0.1}s` }}
                        >
                            <Link href={`/${post.slug}`}>
                                <div className={styles.cardImageWrapper}>
                                    {post.featuredImage?.node?.sourceUrl ? (
                                        <img
                                            src={post.featuredImage.node.sourceUrl}
                                            alt={post.title}
                                            className={styles.cardImage}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            background: `linear-gradient(135deg, hsl(${(index * 40) % 360}, 70%, 50%) 0%, hsl(${(index * 40 + 30) % 360}, 70%, 40%) 100%)` 
                                        }} />
                                    )}
                                    <span className={styles.cardCategory}>Finance</span>
                                </div>
                            </Link>
                            <div className={styles.cardContent}>
                                <div className={styles.cardMeta}>
                                    <span className={styles.cardDate}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className={styles.cardReadTime}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"/>
                                            <polyline points="12 6 12 12 16 14"/>
                                        </svg>
                                        {calculateReadingTime(post.excerpt)}
                                    </span>
                                </div>
                                <h3 className={styles.cardTitle}>
                                    <Link href={`/${post.slug}`}>{post.title}</Link>
                                </h3>
                                <div
                                    className={styles.cardExcerpt}
                                    dangerouslySetInnerHTML={{ __html: replaceUrls(post.excerpt) }}
                                />
                                <div className={styles.cardFooter}>
                                    <div className={styles.cardAuthor}>
                                        {post.author?.node?.avatar?.url ? (
                                            <img 
                                                src={post.author.node.avatar.url} 
                                                alt={post.author.node.name}
                                                className={styles.cardAuthorAvatar}
                                            />
                                        ) : (
                                            <div className={styles.cardAuthorAvatarPlaceholder}>
                                                {getAuthorInitials(post.author?.node?.name)}
                                            </div>
                                        )}
                                        <span className={styles.cardAuthorName}>
                                            {post.author?.node?.name || 'Ratex'}
                                        </span>
                                    </div>
                                    <Link href={`/${post.slug}`} className={styles.cardReadMore}>
                                        Read
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className={styles.paginationSection}>
                    <Pagination pageInfo={pageInfo} />
                </div>
            </section>
        </div>
    );
}
