import Link from 'next/link';
import styles from './header.module.css';
import { getMenus } from '@/lib/api';
import Search from './Search';

export default async function Header() {
    const menus = await getMenus();

    // Ratex.co styled navigation (Filtered to existing categories)
    const staticLinks = [
        { label: 'Business', url: '/category/business' },
        { label: 'Finance', url: '/category/finance' },
        { label: 'Stories', url: '/category/stories' },
        { label: 'Credit Cards', url: '/category/credit-cards' },
    ];

    const menuItems = menus.header.length > 0 ? menus.header : staticLinks;

    return (
        <header className={styles.header}>
            <div className={styles.layoutContainer}>
                <Link href="/" className={styles.logo}>
                    RATEX<span>.</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <nav className={styles.nav}>
                        {menuItems.map((item) => {
                            const url = item.uri || item.url;
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

                    <div className={styles.desktopSearch}>
                        <Search />
                    </div>
                </div>
            </div>
        </header>
    );
}
