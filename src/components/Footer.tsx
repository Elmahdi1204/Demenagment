import React from 'react';
import { Truck, Phone, Mail, MapPin, Shield } from 'lucide-react';
import { useMoving } from '../context/MovingContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useMoving();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-14 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand & Desc */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Truck className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">TransMoov</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Plateforme nationale de gestion et de réalisation de déménagements de particuliers et d'entreprises.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Membre de la Fédération Française du Déménagement</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <p className="font-semibold text-white uppercase tracking-wider text-xs">Navigation</p>
            <ul className="space-y-1.5">
              <li>
                <a href="#formules" className="hover:text-white transition-colors">
                  Nos 4 formules tarifaires
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Services & Manutention
                </a>
              </li>
              <li>
                <a href="#fonctionnement" className="hover:text-white transition-colors">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Questions fréquentes
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Espaces applicatifs */}
          <div className="space-y-2">
            <p className="font-semibold text-white uppercase tracking-wider text-xs">Plateforme</p>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveView('tracking')}
                  className="hover:text-white transition-colors text-left"
                >
                  Suivi de mission client
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('driver')}
                  className="hover:text-white transition-colors text-left"
                >
                  Espace mobile chauffeur
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="hover:text-white transition-colors text-left"
                >
                  Dashboard d'exploitation
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('emails')}
                  className="hover:text-white transition-colors text-left"
                >
                  Simulateur d'emails automatiques
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Permanence */}
          <div className="space-y-2">
            <p className="font-semibold text-white uppercase tracking-wider text-xs">Permanence & Support</p>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>01 89 20 44 00 (Lun - Sam, 8h - 19h)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>contact@transmoov.fr</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Paris · Lyon · Nantes · Bordeaux · Marseille</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} TransMoov SAS. Tous droits réservés.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Conditions Générales de Vente</span>
            <span className="hover:text-slate-400 cursor-pointer">Police de Confidentialité</span>
            <span className="hover:text-slate-400 cursor-pointer">Mentions Légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
