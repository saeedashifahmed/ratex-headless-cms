import styles from './AuthorBio.module.css';

export default function AuthorBio({ author }) {
    if (!author) return null;

    return (
        <div className={styles.wrapper}>
            {author.avatar?.url && (
                <img
                    src={author.avatar.url}
                    alt={author.name}
                    width={64}
                    height={64}
                    className={styles.avatar}
                />
            )}
            <div className={styles.info}>
                <h4>About {author.name}</h4>
                <p>{author.description || `Content creator at Ratex.`}</p>
            </div>
        </div>
    );
}
