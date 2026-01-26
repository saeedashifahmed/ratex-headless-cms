import { getPostBySlug, getAllPosts, replaceUrls } from '@/lib/api';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

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
    return posts.map((post) => ({
        slug: post.slug,
    }));
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
                    {post.author?.node?.name && (
                        <span> • {post.author.node.name}</span>
                    )}
                </div>
                <h1 className={styles.title}>{post.title}</h1>
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

            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </article>
    );
}
