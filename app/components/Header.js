import Link from 'next/link';
import styles from './header.module.css';
import { getMenus } from '@/lib/api';

export default async function Header() {
    const menus = await getMenus();

    // Ratex.co styled navigation
    const staticLinks = [
        { label: 'Technology', url: '/category/technology' },
        { label: 'Business', url: '/category/business' },
        { label: 'Lifestyle', url: '/category/lifestyle' },
    ];

    // Merge with dynamic menus if available, or just use dynamic. 
    // For now, if dynamic menu "Primary" exists, use it. Else fallback.
    // Note: API query asks for "PRIMARY" location.

    const menuItems = menus.header.length > 0 ? menus.header : staticLinks;

    return (
        <header className={styles.header}>
            <div className={styles.layoutContainer}>
                <Link href="/" className={styles.logo}>
                    RATEX<span>.</span>
                </Link>
                <nav className={styles.nav}>
                    {menuItems.map((item) => {
                        // Handle WordPress absolute URLs if necessary, usually we want relative paths for internal links
                        const url = item.uri || item.url;
                        // Simple check if it's an external link
                        const isExternal = url.startsWith('http') && !url.includes('ratex.co');

                        return (
                            <Link
                                key={item.label}
                                href={url}
                                className={styles.navLink}
                                target={isExternal ? "_blank" : undefined}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </header>
    );
}
