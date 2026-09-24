import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '../components/layout/AppShell';
import { Footer } from '../components/layout/Footer';
import { CustomCursor } from '../components/layout/CustomCursor';
import { AnimatedEnergyBackground } from '../components/layout/AnimatedEnergyBackground';
import { HealthGamesModal } from '../components/games/HealthGamesModal';
import { LanguageProvider } from '../lib/i18n/LanguageContext';

export const metadata: Metadata = {
  title: 'MediScan AI | Enterprise Clinical Healthcare Report Analyzer',
  description:
    'Decipher medical reports, complete blood count, lipid, diabetic, renal, and hepatic panels in seconds with advanced OCR, clinical biomarker interpretation, and medical intelligence.',
  keywords: [
    'MediScan AI',
    'Medical Report Analyzer',
    'Healthcare AI',
    'CBC Analysis',
    'Lipid Panel',
    'HbA1c',
    'Biomarker Extraction'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 min-h-screen selection:bg-teal-500/25 selection:text-teal-200 antialiased">
        <LanguageProvider>
          <CustomCursor />
          <AnimatedEnergyBackground />
          <AppShell>
            {children}
            <Footer />
          </AppShell>
          <HealthGamesModal />
        </LanguageProvider>
      </body>
    </html>
  );
}
