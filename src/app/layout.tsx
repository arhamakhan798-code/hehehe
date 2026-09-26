import '../styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'LoanKNN - Sleek AI Credit Underwriting & Prediction',
  description:
    'Modern Glassmorphic K-Nearest Neighbors Loan Approval Prediction Platform with Instant Neighbor Explainability and Dual Aesthetic Themes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', overflowX: 'hidden' }}>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
