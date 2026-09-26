import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Faut-il créer un compte pour faire une demande et suivre mon déménagement ?',
      a: 'Non, aucune création de compte ni mot de passe n’est requise. Dès la validation de votre demande, le système génère un identifiant unique (ex : DEM-2026-00125). Vous pouvez suivre la progression en temps réel simplement en saisissant cette référence ou en cliquant sur le lien reçu par email.',
    },
    {
      q: 'Quelle est la différence entre les 4 formules proposées ?',
      a: 'La formule Économique est idéale si vous préférez emballer vos cartons vous-même ; nous nous chargeons du mobilier lourd et du transport. La formule Classique inclut en plus l’emballage du fragile. La formule Major prend en charge l’ensemble des cartons et de la vaisselle. Enfin, la formule Privilège est une prise en charge intégrale de A à Z avec déballage et remise en place dans votre nouveau logement.',
    },
    {
      q: 'Comment suis-je informé de l’avancement le jour J ?',
      a: 'À chaque étape clé (chauffeur en route, arrivée sur place, fin du chargement, transport, livraison terminée), notre chauffeur met à jour son espace mobile. Vous recevez instantanément un email et une mise à jour sur votre lien de suivi interactif.',
    },
    {
      q: 'Vos déménagements sont-ils couverts par une assurance ?',
      a: 'Absolument. Toutes nos prestations incluent une garantie responsabilité civile professionnelle et une assurance contractuelle des marchandises transportées couvrant vos biens jusqu’à 80 000 €, extensible sur demande pour des objets de valeur spécifique.',
    },
    {
      q: 'Puis-je modifier la date de mon déménagement après l’envoi de la demande ?',
      a: 'Oui, tout à fait. Dès la réception de votre demande, notre responsable logistique vous appelle pour finaliser les détails. Vous pourrez alors ajuster les horaires ou la date selon vos contraintes d’état des lieux.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Questions fréquentes</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tout ce que vous devez savoir
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Vous avez des questions sur le déroulement de votre déménagement ? Retrouvez nos réponses.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
