import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import styles from './layout.module.css';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Ratex Finance | Market Insights & Investment Analysis',
  description: 'Your trusted source for financial news, market analysis, investment strategies, and expert insights into the world of finance.',
  keywords: 'finance, investing, market analysis, stocks, cryptocurrency, personal finance',
  authors: [{ name: 'Ratex Finance Team' }],
  openGraph: {
    title: 'Ratex Finance | Market Insights & Investment Analysis',
    description: 'Your trusted source for financial news, market analysis, investment strategies, and expert insights.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ratex Finance',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ratex Finance | Market Insights & Investment Analysis',
    description: 'Your trusted source for financial news, market analysis, and expert insights.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
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
