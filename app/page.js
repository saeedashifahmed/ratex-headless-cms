import { getAllPosts, replaceUrls } from '@/lib/api';
import Link from 'next/link';
import styles from './page.module.css';

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <h1 className="animate-fade-in">
            Explore the <span className={styles.heroAccent}>Unseen</span>.
          </h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Curated thoughts, stories, and ideas from the Ratex universe.
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
                        background: 'linear-gradient(45deg, #111, #222)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#444'
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
              <p>No posts found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
