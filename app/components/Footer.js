import Link from 'next/link';
import styles from './footer.module.css';
import { getMenus } from '@/lib/api';

export default async function Footer() {
    const menus = await getMenus();

    // Use dynamic footer menu if available, else standard fallback
    const footerLinks = menus.footer.length > 0 ? menus.footer : [
        { label: 'Privacy Policy', url: '/privacy-policy' },
        { label: 'Terms of Service', url: '/terms' },
        { label: 'Contact Us', url: '/contact' },
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.layoutContainer}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            RATEX<span>.</span>
                        </Link>
                        <p className={styles.description}>
                            Ratex provides cutting-edge insights on technology, business, and modern lifestyle. We empower readers with clarity in a complex world.
                        </p>
                        <div className={styles.newsletter}>
                            <input type="email" placeholder="Enter your email" className={styles.newsletterInput} />
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h4>Categories</h4>
                        <ul>
                            <li><Link href="/category/business">Business</Link></li>
                            <li><Link href="/category/finance">Finance</Link></li>
                            <li><Link href="/category/stories">Stories</Link></li>
                            <li><Link href="/category/how-to">How To</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4>Company</h4>
                        <ul>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/careers">Careers</Link></li>
                            <li><Link href="/contact">Support</Link></li>
                            <li><Link href="/press">Media Kit</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4>Legal</h4>
                        <ul>
                            {footerLinks.map((item) => {
                                const url = item.uri || item.url;
                                return (
                                    <li key={item.label}>
                                        <Link href={url}>{item.label}</Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Ratex Inc. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link href="#">Twitter</Link>
                        <Link href="#">LinkedIn</Link>
                        <Link href="#">Instagram</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
