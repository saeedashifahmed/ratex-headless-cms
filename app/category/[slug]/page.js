import { getPostsByCategory, replaceUrls } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from '../../page.module.css'; // Reuse home page styles

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    return {
        title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} - Ratex Blog`,
    };
}

export async function generateStaticParams() {
    // To fully support SSG for all categories, we would need to fetch all categories from WP.
    // For now, we can let them be generated on demand (ISR) or fetch them if we want strict SSG.
    // Let's implement dynamic ISR for simplicity and speed of build, 
    // but if we want to pre-render known ones we can add them.
    return [];
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const categoryData = await getPostsByCategory(slug);

    if (!categoryData) {
        notFound();
    }

    const posts = categoryData.posts?.nodes || [];

    return (
        <div>
            <section className={styles.hero}>
                <div className="container">
                    <h1 className="animate-fade-in">
                        Category: <span className={styles.heroAccent}>{categoryData.name}</span>
                    </h1>
                    <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Latest articles in {categoryData.name}.
                    </p>
                </div>
            </section>

            <section className="container">
                <div className={styles.postGrid}>
                    {posts && posts.length > 0 ? (
                        posts.map((post, index) => (
                            <article
                                key={post.slug}
                                className={`${styles.card} animate-fade-in`}
                                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                            >
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
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#888'
                                            }}>
                                                Ratex
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardMeta}>
                                            <span>{new Date(post.date).toLocaleDateString()}</span>
                                            {post.author?.node?.name && <span>{post.author.node.name}</span>}
                                        </div>
                                        <h2 className={styles.cardTitle}>{post.title}</h2>
                                        <div
                                            className={styles.cardExcerpt}
                                            dangerouslySetInnerHTML={{ __html: replaceUrls(post.excerpt) }}
                                        />
                                        <span className={styles.cardLink}>Read Article &rarr;</span>
                                    </div>
                                </Link>
                            </article>
                        ))
                    ) : (
                        <div className="container">
                            <p>No posts found in this category.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
