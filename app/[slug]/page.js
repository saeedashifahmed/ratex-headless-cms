import { getPostBySlug, getAllPosts, replaceUrls } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import SocialShare from '@/app/components/SocialShare';
import AuthorBio from '@/app/components/AuthorBio';
import ReadingProgress from '@/app/components/ReadingProgress';

// Helper function to calculate reading time
function calculateReadingTime(content) {
    if (!content) return '5 min';
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
}

// Helper function to get author initials
function getAuthorInitials(name) {
    if (!name) return 'R';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Article Not Found | Ratex',
        };
    }

    const description = post.excerpt?.replace(/<[^>]*>?/gm, "").slice(0, 160) || 'Read this article on Ratex - Your trusted source for financial news and insights.';

    return {
        title: `${post.title} | Ratex`,
        description,
        openGraph: {
            title: post.title,
            description,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author?.node?.name || 'Ratex Editorial'],
            images: post.featuredImage?.node?.sourceUrl ? [
                {
                    url: post.featuredImage.node.sourceUrl,
                    width: 1200,
                    height: 630,
                }
            ] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : [],
        },
    };
}

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.nodes?.map((post) => ({
        slug: post.slug,
    })) || [];
}

export default async function Post({ params }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const content = replaceUrls(post.content);
    const readingTime = calculateReadingTime(post.content);

    return (
        <>
            <ReadingProgress />
            <article className={styles.articlePage}>
                {/* Article Header */}
                <header className={styles.articleHeader}>
                <div className={styles.headerContent}>
                    {/* Breadcrumb */}
                    <nav className={styles.breadcrumb}>
                        <Link href="/">Home</Link>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <Link href="/category/finance">Finance</Link>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbCurrent}>Article</span>
                    </nav>

                    {/* Category Badge */}
                    <span className={styles.categoryBadge}>Finance & Markets</span>

                    {/* Title */}
                    <h1 className={styles.articleTitle}>{post.title}</h1>

                    {/* Meta Information */}
                    <div className={styles.articleMeta}>
                        <div className={styles.authorInfo}>
                            {post.author?.node?.avatar?.url ? (
                                <img 
                                    src={post.author.node.avatar.url} 
                                    alt={post.author.node.name}
                                    className={styles.authorAvatar}
                                />
                            ) : (
                                <div className={styles.authorAvatarPlaceholder}>
                                    {getAuthorInitials(post.author?.node?.name)}
                                </div>
                            )}
                            <div className={styles.authorDetails}>
                                <span className={styles.authorName}>
                                    {post.author?.node?.name || 'Ratex Editorial'}
                                </span>
                                <span className={styles.authorRole}>Financial Analyst</span>
                            </div>
                        </div>

                        <div className={styles.metaItems}>
                            <div className={styles.metaItem}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                <time dateTime={post.date}>
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </time>
                            </div>
                            <div className={styles.metaItem}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                                <span>{readingTime} read</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage?.node?.sourceUrl && (
                <div className={styles.featuredImageContainer}>
                    <div className={styles.featuredImageWrapper}>
                        <img
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.title}
                            className={styles.featuredImage}
                        />
                    </div>
                </div>
            )}

            {/* Article Layout */}
            <div className={styles.articleLayout}>
                {/* Left Sidebar - Share */}
                <aside className={styles.sidebarLeft}>
                    <div className={styles.shareSection}>
                        <span className={styles.shareLabel}>Share</span>
                        <div className={styles.shareButtons}>
                            <button className={styles.shareButton} aria-label="Share on Twitter">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </button>
                            <button className={styles.shareButton} aria-label="Share on LinkedIn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </button>
                            <button className={styles.shareButton} aria-label="Share on Facebook">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </button>
                            <button className={styles.shareButton} aria-label="Copy Link">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                                </svg>
                            </button>
                            <button className={styles.shareButton} aria-label="Bookmark">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className={styles.articleContent}>
                    <div
                        className={styles.prose}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                    {/* Author Bio */}
                    <div className={styles.authorBioSection}>
                        <div className={styles.authorBioHeader}>
                            {post.author?.node?.avatar?.url ? (
                                <img 
                                    src={post.author.node.avatar.url} 
                                    alt={post.author.node.name}
                                    className={styles.authorBioAvatar}
                                />
                            ) : (
                                <div className={styles.authorBioAvatarPlaceholder}>
                                    {getAuthorInitials(post.author?.node?.name)}
                                </div>
                            )}
                            <div className={styles.authorBioInfo}>
                                <h3>{post.author?.node?.name || 'Ratex Editorial'}</h3>
                                <span className={styles.authorBioRole}>Financial Analyst & Writer</span>
                            </div>
                        </div>
                        <p className={styles.authorBioDescription}>
                            {post.author?.node?.description || 
                                'Our editorial team consists of experienced financial journalists and analysts who are dedicated to providing accurate, insightful, and actionable financial content to help you make informed decisions.'}
                        </p>
                    </div>
                </div>

                {/* Right Sidebar - Table of Contents */}
                <aside className={styles.sidebarRight}>
                    <div className={styles.tocSection}>
                        <h4 className={styles.tocTitle}>In This Article</h4>
                        <nav className={styles.tocList}>
                            <span className={styles.tocItem}>Introduction</span>
                            <span className={styles.tocItem}>Key Insights</span>
                            <span className={styles.tocItem}>Market Analysis</span>
                            <span className={styles.tocItem}>Conclusion</span>
                        </nav>
                    </div>
                </aside>
            </div>
        </article>
        </>
    );
}
