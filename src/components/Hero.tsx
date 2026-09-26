import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Clock, CheckCircle2, Search, Sparkles } from 'lucide-react';
import { useMoving } from '../context/MovingContext';
import heroImage from '../assets/images/hero_moving_service_1790421077360.jpg';

export const Hero: React.FC = () => {
  const { setActiveView, setTrackingRef, requests } = useMoving();
  const [quickRef, setQuickRef] = useState('');
  const [refError, setRefError] = useState('');

  const handleQuickTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRef.trim()) {
      setRefError('Veuillez saisir votre numéro de dossier (ex: DEM-2026-00125)');
      return;
    }
    const cleanRef = quickRef.trim().toUpperCase();
    const found = requests.find((r) => r.id.toUpperCase() === cleanRef);
    if (!found) {
      // If not found in memory, set it anyway to show the track view or helpful notice
      setTrackingRef(cleanRef);
    } else {
      setTrackingRef(found.id);
    }
    setActiveView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBooking = () => {
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFormulas = () => {
    const el = document.getElementById('formules');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Decorative backdrop glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-amber-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Déménagement national sans mauvaise surprise</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.12]">
              Votre déménagement en toute sérénité, de la formule au transport.
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Obtenez votre devis transparent en 2 minutes sans créer de compte.
              Bénéficiez d’un suivi digital en temps réel par SMS et email, du départ
              jusqu’au déballage complet.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={scrollToBooking}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-base rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <span>Demander un déménagement</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToFormulas}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base rounded-xl border border-slate-700 transition-colors flex items-center justify-center"
              >
                <span>Découvrir les 4 formules</span>
              </button>
            </div>

            {/* Quick Tracking input bar directly in Hero */}
            <div className="pt-4 border-t border-slate-800 max-w-xl">
              <p className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-2">
                Déjà client ? Suivez l'avancement de votre camion :
              </p>
              <form onSubmit={handleQuickTrackingSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={quickRef}
                    onChange={(e) => {
                      setQuickRef(e.target.value);
                      setRefError('');
                    }}
                    placeholder="Ex: DEM-2026-00125"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm rounded-lg transition-colors whitespace-nowrap"
                >
                  Suivre
                </button>
              </form>
              {refError && <p className="text-xs text-rose-400 mt-1">{refError}</p>}
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-3 gap-4 pt-4 text-slate-300 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Assurance tous risques</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Ponctualité garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Sans création de compte</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image & Live Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-800">
              <img
                src={heroImage}
                alt="Équipe professionnelle de déménagement TransMoov"
                className="w-full h-80 sm:h-96 object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              {/* Floating live indicator card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/70 text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Mission active en direct
                  </span>
                  <span className="font-mono text-slate-400">DEM-2026-00125</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-semibold block">Rennes ➔ Nantes</span>
                    <span className="text-xs text-slate-400">Chauffeur : Karim B. (Mercedes 14m³)</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Chargement en cours
                  </span>
                </div>
                <button
                  onClick={() => {
                    setTrackingRef('DEM-2026-00125');
                    setActiveView('tracking');
                  }}
                  className="w-full mt-2 py-1.5 text-xs text-center font-medium text-amber-400 hover:text-amber-300 transition-colors border-t border-slate-800 block"
                >
                  Voir l'interface de tracking client →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
