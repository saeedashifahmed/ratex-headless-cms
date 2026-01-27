import Link from 'next/link';
import styles from './header.module.css';
import { getMenus } from '@/lib/api';
import Search from './Search';

export default async function Header() {
    const menus = await getMenus();

    // Premium navigation links
    const staticLinks = [
        { label: 'Markets', url: '/category/business' },
        { label: 'Finance', url: '/category/finance' },
        { label: 'Investing', url: '/category/stories' },
        { label: 'Credit Cards', url: '/category/credit-cards' },
        { label: 'Economy', url: '/category/how-to' },
    ];

    const menuItems = menus.header.length > 0 ? menus.header : staticLinks;

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className={styles.header}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.topBarContent}>
                    <div className={styles.marketTicker}>
                        <div className={styles.tickerItem}>
                            <span className={styles.tickerSymbol}>S&P 500</span>
                            <span className={styles.tickerValue}>5,234.18</span>
                            <span className={`${styles.tickerChange} ${styles.tickerChangePositive}`}>+0.82%</span>
                        </div>
                        <div className={styles.tickerItem}>
                            <span className={styles.tickerSymbol}>NASDAQ</span>
                            <span className={styles.tickerValue}>16,428.82</span>
                            <span className={`${styles.tickerChange} ${styles.tickerChangePositive}`}>+1.14%</span>
                        </div>
                        <div className={styles.tickerItem}>
                            <span className={styles.tickerSymbol}>DOW</span>
                            <span className={styles.tickerValue}>39,512.84</span>
                            <span className={`${styles.tickerChange} ${styles.tickerChangeNegative}`}>-0.23%</span>
                        </div>
                        <div className={styles.tickerItem}>
                            <span className={styles.tickerSymbol}>BTC</span>
                            <span className={styles.tickerValue}>$67,842</span>
                            <span className={`${styles.tickerChange} ${styles.tickerChangePositive}`}>+2.41%</span>
                        </div>
                    </div>
                    <div className={styles.topBarRight}>
                        <span className={styles.dateDisplay}>{dateString}</span>
                        <Link href="/subscribe" className={styles.premiumLink}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                            </svg>
                            Premium
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className={styles.mainHeader}>
                <div className={styles.headerContent}>
                    <Link href="/" className={styles.logo}>
                        RATE<span className={styles.logoAccent}>X</span><span className={styles.logoDot}>.</span>
                    </Link>

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
                            );
                        })}
                    </nav>

                    <div className={styles.headerActions}>
                        <div className={styles.searchWrapper}>
                            <Search />
                        </div>
                        <Link href="/subscribe" className={styles.subscribeButton}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            Subscribe
                        </Link>
                        <button className={styles.mobileMenuButton} aria-label="Menu">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <line x1="3" y1="12" x2="21" y2="12"/>
                                <line x1="3" y1="18" x2="21" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
