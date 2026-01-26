import { Inter } from 'next/font/google';
import './globals.css';
import styles from './layout.module.css';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Ratex - Future of Blogging',
  description: 'A stunning headless WordPress blog built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div className={styles.wrapper}>
          <Header />

          <main className={styles.main}>
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
