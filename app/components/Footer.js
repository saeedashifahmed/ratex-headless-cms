import Link from 'next/link';
import styles from './footer.module.css';
import { getMenus } from '@/lib/api';

export default async function Footer() {
    const menus = await getMenus();

    // Use dynamic footer menu if available, else standard fallback
    const footerLinks = menus.footer.length > 0 ? menus.footer : [
        { label: 'Privacy Policy', url: '/privacy-policy' },
        { label: 'Terms of Service', url: '/terms' },
        { label: 'Contact', url: '/contact' },
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.layoutContainer}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <h3>RATEX.</h3>
                        <p>Empowering the next generation of content creators and readers with cutting-edge insights.</p>
                    </div>

                    <div className={styles.links}>
                        <h4>Explore</h4>
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
                    <p>&copy; {new Date().getFullYear()} Ratex. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
