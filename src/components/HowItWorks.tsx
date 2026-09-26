import React from 'react';
import { ClipboardList, PhoneCall, Truck, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: ClipboardList,
      title: 'Devis en ligne sans compte',
      desc: 'Sélectionnez votre formule (Économique, Classique, Major ou Privilège) et renseignez vos adresses en 2 minutes.',
    },
    {
      num: '02',
      icon: PhoneCall,
      title: 'Validation & Planification',
      desc: 'Notre responsable logistique valide votre dossier, vous contacte et cale la date et l’heure précises de rendez-vous.',
    },
    {
      num: '03',
      icon: Truck,
      title: 'Chauffeur dédié & Suivi GPS',
      desc: 'Le chauffeur assigné reçoit la mission sur son smartphone. Vous êtes alerté par SMS et email dès son départ et son arrivée.',
    },
    {
      num: '04',
      icon: CheckCircle2,
      title: 'Emballage, transport & Déballage',
      desc: 'Vos biens sont protégés, chargés et livrés dans votre nouveau domicile avec signature électronique à l’arrivée.',
    },
  ];

  return (
    <section id="fonctionnement" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">
            Simplicité & Efficacité
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comment se déroule votre déménagement ?
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Une méthodologie éprouvée et un suivi digital à chaque étape pour un déménagement
            zéro stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-3xl font-extrabold text-amber-500/80">
                    {s.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-800">
                    <Icon className="w-5 h-5 text-amber-600" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
