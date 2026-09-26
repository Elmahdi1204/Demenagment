/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MovingProvider, useMoving } from './context/MovingContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FormulasSection } from './components/FormulasSection';
import { ServicesSection } from './components/ServicesSection';
import { HowItWorks } from './components/HowItWorks';
import { BookingForm } from './components/BookingForm';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { ClientTrackingView } from './components/ClientTrackingView';
import { DriverSpaceView } from './components/DriverSpaceView';
import { AdminDashboard } from './components/AdminDashboard';
import { EmailSimulatorModal } from './components/EmailSimulatorModal';

const AppContent: React.FC = () => {
  const { activeView } = useMoving();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1">
        {activeView === 'landing' || activeView === 'booking' ? (
          <>
            <Hero />
            <FormulasSection />
            <ServicesSection />
            <HowItWorks />
            <BookingForm />
            <FAQSection />
          </>
        ) : activeView === 'tracking' ? (
          <ClientTrackingView />
        ) : activeView === 'driver' ? (
          <DriverSpaceView />
        ) : activeView === 'admin' ? (
          <AdminDashboard />
        ) : activeView === 'emails' ? (
          <EmailSimulatorModal />
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <MovingProvider>
      <AppContent />
    </MovingProvider>
  );
}
