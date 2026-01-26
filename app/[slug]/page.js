import { getPostBySlug, getAllPosts, replaceUrls } from '@/lib/api';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import SocialShare from '@/app/components/SocialShare';
import AuthorBio from '@/app/components/AuthorBio';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | Ratex`,
        description: post.excerpt?.replace(/<[^>]*>?/gm, "") || 'Read this article on Ratex.',
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

    return (
        <article className={`${styles.articleContainer} animate-fade-in`}>
            <header className={styles.header}>
                <div className={styles.meta}>
                    <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </div>
                <h1 className={styles.title}>{post.title}</h1>
                {post.author?.node?.name && (
                    <div className={styles.authorLine}>
                        By {post.author.node.name}
                    </div>
                )}
            </header>

            {post.featuredImage?.node?.sourceUrl && (
                <div className={styles.featuredImageWrapper}>
                    <img
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title}
                        className={styles.featuredImage}
                    />
                </div>
            )}

            <div className={styles.socialTop}>
                <SocialShare title={post.title} />
            </div>

            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: content }}
            />

            <hr style={{ margin: '4rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

            <AuthorBio author={post.author?.node} />
        </article>
    );
}
