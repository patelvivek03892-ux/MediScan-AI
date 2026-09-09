import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CustomCursor } from '../components/layout/CustomCursor';
import { MedicalParticles } from '../components/3d/MedicalParticles';
import { HealthGamesModal } from '../components/games/HealthGamesModal';

export const metadata: Metadata = {
  title: 'MediScan AI | Enterprise Open-Source AI Healthcare Report Analyzer',
  description:
    'Decipher medical reports, complete blood count, lipid, diabetic, renal, and hepatic panels in seconds with cutting-edge open-source OCR, emergency triage detection, and 3D medical intelligence.',
  keywords: [
    'MediScan AI',
    'Medical Report Analyzer',
    'Healthcare AI',
    'CBC Analysis',
    'Lipid Panel',
    'HbA1c',
    'Biomarker Extraction',
    'Open Source Health Tech'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
        <CustomCursor />
        <MedicalParticles />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <HealthGamesModal />
        <Footer />
      </body>
    </html>
  );
}
