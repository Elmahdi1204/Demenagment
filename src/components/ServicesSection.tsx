import React from 'react';
import { Truck, Home, Building2, Box, ShieldCheck, ArrowRight } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: Home,
      title: 'Déménagement de Particuliers',
      desc: 'Du studio à la maison familiale. Prise en charge adaptée à votre rythme avec matériel de protection certifié.',
      highlights: ['Cartons et penderies fournis', 'Protection canapés et literie', 'Assurance incluse jusqu’à 80 000 €'],
    },
    {
      icon: Building2,
      title: 'Transfert d’Entreprise & Bureaux',
      desc: 'Déménagement de locaux professionnels sans interruption de votre activité commerciale.',
      highlights: ['Intervention possible le week-end', 'Démontage/remontage informatique', 'Gestion des archives confidentielles'],
    },
    {
      icon: Box,
      title: 'Garde-Meubles Sécurisé',
      desc: 'Stockage temporaire ou longue durée dans nos entrepôts tempérés et sous télésurveillance 24/7.',
      highlights: ['Box individuels scellés', 'Accès réglementé et surveillé', 'Contrats flexibles sans durée imposée'],
    },
    {
      icon: Truck,
      title: 'Monte-Meubles & Accès Difficile',
      desc: 'Techniciens habilités et nacelles élévatrices jusqu’au 8ème étage pour passages étroits ou cours exiguës.',
      highlights: ['Capacité jusqu’à 300 kg par montée', 'Autorisations de voirie gérées', 'Zéro risque de rayure d’escalier'],
    },
  ];

  return (
    <section id="services" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">
            Notre savoir-faire
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Des services complets pour chaque projet
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Que vous changiez d'appartement ou délocalisiez une société, nos déménageurs
            qualifiés déploient l'outillage et les véhicules appropriés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-amber-600 flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 space-y-2">
                  {item.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-[11px] text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
