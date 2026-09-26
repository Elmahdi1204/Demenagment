import React from 'react';
import { Truck, ShieldCheck, Mail, Smartphone, LayoutDashboard, Search } from 'lucide-react';
import { useMoving, AppView } from '../context/MovingContext';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, requests, notifications, setTrackingRef } = useMoving();

  const pendingRequestsCount = requests.filter((r) => r.status === 'demande_recue').length;
  const unreadMailsCount = notifications.filter((n) => !n.isRead).length;

  const handleNavClick = (view: AppView, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Quick view switcher for all stakeholders */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap text-slate-400">
            <span className="font-semibold text-white">TransMoov 360°</span>
            <span className="hidden sm:inline">| Accès aux espaces de la solution :</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => handleNavClick('landing')}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'landing' || activeView === 'booking'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Site & Formules</span>
            </button>

            <button
              onClick={() => handleNavClick('tracking')}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'tracking'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Suivi Client</span>
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard Admin</span>
              {pendingRequestsCount > 0 && (
                <span className="bg-rose-500 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('driver')}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'driver'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Espace Chauffeur</span>
            </button>

            <button
              onClick={() => handleNavClick('emails')}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'emails'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Emails ({notifications.length})</span>
              {unreadMailsCount > 0 && (
                <span className="bg-emerald-500 text-slate-950 font-mono text-[10px] px-1 py-0.2 rounded font-bold">
                  {unreadMailsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar (Strict 3-zone contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single element brand wordmark */}
        <button
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-sm">
            <Truck className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
              TransMoov
            </span>
            <span className="text-xs text-slate-500 block leading-tight font-normal">
              Déménagements & Logistique
            </span>
          </div>
        </button>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#formules"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('landing');
              setTimeout(() => {
                document.getElementById('formules')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="hover:text-slate-900 transition-colors"
          >
            Formules & Tarifs
          </a>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('landing');
              setTimeout(() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="hover:text-slate-900 transition-colors"
          >
            Nos Services
          </a>
          <a
            href="#fonctionnement"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('landing');
              setTimeout(() => {
                document.getElementById('fonctionnement')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="hover:text-slate-900 transition-colors"
          >
            Comment ça marche
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('landing');
              setTimeout(() => {
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="hover:text-slate-900 transition-colors"
          >
            FAQ
          </a>
          <button
            onClick={() => handleNavClick('tracking')}
            className="hover:text-slate-900 transition-colors font-medium text-amber-700"
          >
            Suivre mon déménagement
          </button>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveView('landing');
              setTimeout(() => {
                document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="px-4 py-2 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            Demander un devis
          </button>
        </div>
      </div>
    </header>
  );
};
