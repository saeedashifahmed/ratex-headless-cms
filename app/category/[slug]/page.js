import { getPostsByCategory, replaceUrls } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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

// Category descriptions
const categoryDescriptions = {
    'business': 'Expert analysis on business strategy, corporate news, and market trends that shape the global economy.',
    'finance': 'Personal finance tips, investment strategies, and financial planning insights to grow your wealth.',
    'stories': 'In-depth features and investigative pieces on the people and events shaping the financial world.',
    'credit-cards': 'Compare credit cards, maximize rewards, and make smarter decisions about credit.',
    'how-to': 'Step-by-step guides and tutorials on managing money, investing, and building financial security.',
};

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const formattedName = slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return {
        title: `${formattedName} | Ratex - Financial News & Insights`,
        description: categoryDescriptions[slug] || `Browse all articles in ${formattedName} category on Ratex.`,
    };
}

export async function generateStaticParams() {
    return [];
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const categoryData = await getPostsByCategory(slug);

    if (!categoryData) {
        notFound();
    }

    const posts = categoryData.posts?.nodes || [];
    const formattedName = slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return (
        <div className={styles.categoryPage}>
            {/* Category Header */}
            <header className={styles.categoryHeader}>
                <div className={styles.headerContent}>
                    <nav className={styles.breadcrumb}>
                        <Link href="/">Home</Link>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbCurrent}>Category</span>
                    </nav>
                    
                    <div className={styles.headerText}>
                        <span className={styles.categoryLabel}>Category</span>
                        <h1 className={styles.categoryTitle}>{categoryData.name || formattedName}</h1>
                        <p className={styles.categoryDescription}>
                            {categoryDescriptions[slug] || `Explore our latest articles and insights in ${categoryData.name || formattedName}.`}
                        </p>
                    </div>
                    
                    <div className={styles.categoryStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{posts.length}</span>
                            <span className={styles.statLabel}>Articles</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>Weekly</span>
                            <span className={styles.statLabel}>Updates</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Articles Section */}
            <section className={styles.articlesSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        All {categoryData.name || formattedName} Articles
                    </h2>
                    <div className={styles.sortOptions}>
                        <span className={styles.sortLabel}>Sort by:</span>
                        <select className={styles.sortSelect}>
                            <option value="latest">Latest</option>
                            <option value="popular">Most Popular</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>

                {posts && posts.length > 0 ? (
                    <div className={styles.postGrid}>
                        {posts.map((post, index) => (
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
                                            <div className={styles.cardImagePlaceholder}>
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                                    <polyline points="21 15 16 10 5 21"/>
                                                </svg>
                                            </div>
                                        )}
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
                                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                ) : (
                    <div className={styles.noPosts}>
                        <svg className={styles.noPostsIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                        </svg>
                        <h2>No Articles Found</h2>
                        <p>There are no articles in this category yet. Check back soon!</p>
                        <Link href="/" className={styles.backHome}>
                            Browse All Articles
                        </Link>
                    </div>
                )}
            </section>

            {/* Newsletter CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <div className={styles.ctaText}>
                        <h2>Stay Updated on {categoryData.name || formattedName}</h2>
                        <p>Get the latest insights delivered to your inbox weekly.</p>
                    </div>
                    <form className={styles.ctaForm}>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className={styles.ctaInput}
                            required
                        />
                        <button type="submit" className={styles.ctaButton}>
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
