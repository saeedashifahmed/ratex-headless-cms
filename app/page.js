import { getAllPosts, replaceUrls } from '@/lib/api';
import Link from 'next/link';
import Pagination from './components/Pagination';
import styles from './page.module.css';

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function Home({ searchParams }) {
  const { after } = await searchParams;
  const data = await getAllPosts(after);

  const posts = data?.nodes || [];
  const pageInfo = data?.pageInfo;

  if (posts.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <h1>No posts found.</h1>
      </div>
    )
  }

  // Separate the first post as "Featured" (only on first page)
  const isFirstPage = !after;
  const featuredPost = isFirstPage ? posts[0] : null;
  const gridPosts = isFirstPage ? posts.slice(1) : posts;

  return (
    <div>
      {/* Featured Section */}
      {featuredPost && (
        <section className="container">
          <div className={`${styles.heroSection} animate-fade-in`}>
            <article className={styles.featuredCard}>
              <div className={styles.featuredImage}>
                {featuredPost.featuredImage?.node?.sourceUrl ? (
                  <Link href={`/${featuredPost.slug}`}>
                    <img
                      src={featuredPost.featuredImage.node.sourceUrl}
                      alt={featuredPost.title}
                    />
                  </Link>
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#eee' }}></div>
                )}
              </div>
              <div className={styles.featuredContent}>
                <span className={styles.featuredLabel}>Featured Story</span>
                <h2 className={styles.featuredTitle}>
                  <Link href={`/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>
                <div
                  className={styles.featuredExcerpt}
                  dangerouslySetInnerHTML={{ __html: replaceUrls(featuredPost.excerpt) }}
                />
                <Link href={`/${featuredPost.slug}`} className={styles.button}>
                  Read Full Story
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Grid Section */}
      <section className="container">
        <div className={styles.gridSection}>
          {isFirstPage && <h3 className={styles.sectionTitle}>Latest Stories</h3>}

          <div className={styles.postGrid}>
            {gridPosts.map((post, index) => (
              <article
                key={post.slug}
                className={`${styles.card} animate-fade-in`}
                style={{ animationDelay: `${0.1 + (index % 3) * 0.1}s` }}
              >
                <Link href={`/${post.slug}`}>
                  <div className={styles.cardImage}>
                    {post.featuredImage?.node?.sourceUrl ? (
                      <img
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title}
                        loading="lazy"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#f5f5f5' }}></div>
                    )}
                  </div>
                  <div className={styles.cardMeta}>
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <div
                    className={styles.cardExcerpt}
                    dangerouslySetInnerHTML={{ __html: replaceUrls(post.excerpt) }}
                  />
                  <div className={styles.readMore}>
                    Read Article
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <Pagination pageInfo={pageInfo} />
        </div>
      </section>
    </div>
  );
}
