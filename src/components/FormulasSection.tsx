import React, { useState } from 'react';
import { Star, Check, Plus, Info, X } from 'lucide-react';
import { FORMULA_FEATURES, FORMULA_PACKAGES } from '../data/formulas';
import { FormulaPackage } from '../types/moving';
import { useMoving } from '../context/MovingContext';

export const FormulasSection: React.FC = () => {
  const { setSelectedFormulaForBooking, setActiveView } = useMoving();
  const [modalPackage, setModalPackage] = useState<FormulaPackage | null>(null);

  const handleSelectFormula = (pkgId: string) => {
    setSelectedFormulaForBooking(pkgId);
    setActiveView('landing');
    setTimeout(() => {
      const el = document.getElementById('booking-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <section id="formules" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-sm font-semibold tracking-wider text-amber-600 uppercase mb-2">
            Transparence tarifaire & flexibilité
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Découvrez nos gammes de déménagement
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Quatre formules adaptées à votre budget et à votre degré d'implication.
            Du déménagement économique clé en main à la prise en charge totale Privilège.
          </p>
        </div>

        {/* Comparison Matrix Table matching the provided screenshot */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-slate-200 overflow-x-auto">
          <div className="min-w-[840px]">
            {/* Table Header: Service column + 4 Package columns */}
            <div className="grid grid-cols-12 gap-4 pb-6 border-b border-slate-200 items-end">
              {/* Col 1: Service column label */}
              <div className="col-span-4 pr-4">
                <span className="text-xl sm:text-2xl font-bold italic text-slate-800 block">
                  Choisissez
                </span>
                <span className="text-xl sm:text-2xl font-bold italic text-slate-800 block">
                  vos services :
                </span>
                <span className="text-xs text-slate-400 mt-2 block">
                  Comparez les prestations incluses ou en option selon la formule choisie.
                </span>
              </div>

              {/* Col 2-5: The 4 Packages */}
              {FORMULA_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="col-span-2 text-center p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between"
                >
                  {/* Stars rating */}
                  <div className="flex justify-center gap-1 text-amber-500 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < pkg.stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mb-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Déménagement
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight italic">
                      {pkg.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                      à partir de <span className="text-base sm:text-lg text-slate-900 font-extrabold">{pkg.basePrice} €</span>{' '}
                      <span className="text-[10px] text-slate-400 font-normal">(2)</span>
                    </p>
                  </div>

                  {/* Effort breakdown circle: vous X% / Y% nous */}
                  <div className="my-2 pt-2 border-t border-slate-200 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span>vous {pkg.clientShare}%</span>
                    <div className="relative w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center">
                      <div
                        className="w-full h-full rounded-full border-2 border-amber-500 border-t-transparent"
                        style={{
                          transform: `rotate(${(pkg.companyShare / 100) * 360}deg)`,
                        }}
                      />
                    </div>
                    <span className="font-semibold text-amber-700">{pkg.companyShare}% nous</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Matrix Body: 12 feature rows */}
            <div className="divide-y divide-slate-100">
              {FORMULA_FEATURES.map((feature) => (
                <div
                  key={feature.id}
                  className="grid grid-cols-12 gap-4 py-3.5 hover:bg-slate-50/80 transition-colors items-center"
                >
                  {/* Service Label */}
                  <div className="col-span-4 pr-4 flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                    <span>{feature.label}</span>
                  </div>

                  {/* 4 Package status checkmarks */}
                  {FORMULA_PACKAGES.map((pkg) => {
                    const status = pkg.features[feature.id];
                    const isInclus = status === 'inclus';

                    return (
                      <div key={pkg.id} className="col-span-2 flex items-center justify-center">
                        {isInclus ? (
                          <div
                            className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs"
                            title="Inclus dans la formule"
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div
                            className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 border border-amber-300 flex items-center justify-center"
                            title="Disponible en option"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Matrix Footer: CTA buttons under each package */}
            <div className="grid grid-cols-12 gap-4 pt-6 border-t border-slate-200 items-start">
              <div className="col-span-4 pr-4 pt-2">
                <p className="text-xs text-slate-500 font-medium">
                  Validez votre formule pour pré-remplir instantanément votre formulaire de devis.
                </p>
              </div>

              {FORMULA_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="col-span-2 text-center space-y-2">
                  <button
                    onClick={() => handleSelectFormula(pkg.id)}
                    className="w-full py-2.5 px-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/15"
                  >
                    Obtenir un devis
                  </button>
                  <button
                    onClick={() => setModalPackage(pkg)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 font-medium"
                  >
                    <Info className="w-3 h-3 text-slate-400" />
                    <span>En savoir +</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
            <span>: Inclus dans la formule</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 border border-amber-300 flex items-center justify-center">
              <Plus className="w-3 h-3 stroke-[2.5]" />
            </span>
            <span>: En option</span>
          </div>
        </div>

        {/* Footnotes matching the screenshot */}
        <div className="mt-8 text-center text-[11px] text-slate-500 space-y-1 max-w-4xl mx-auto">
          <p>
            <strong>(1)</strong> : exemple pour un camion 12m³ pendant 3h avec un chauffeur -
            déménageur - 20km maximum - hors Île-de-France - tarifs non contractuels.
          </p>
          <p>
            <strong>(2)</strong> : exemple de déménagement &lt; 10m³ avec 1 chauffeur et 1 aide
            déménageur - 20km maximum - hors Île-de-France - tarifs non contractuels.
          </p>
        </div>
      </div>

      {/* Modal for "En savoir +" */}
      {modalPackage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-amber-600">
                  Détail de la formule
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Formule {modalPackage.name}
                </h3>
                <p className="text-sm font-semibold text-slate-700">
                  À partir de {modalPackage.basePrice} €
                </p>
              </div>
              <button
                onClick={() => setModalPackage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {modalPackage.description}
            </p>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Services inclus dans ce pack :
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 max-h-48 overflow-y-auto pr-2">
                {FORMULA_FEATURES.map((f) => {
                  const isInclus = modalPackage.features[f.id] === 'inclus';
                  return (
                    <li key={f.id} className="flex items-center gap-2">
                      {isInclus ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}
                      <span className={isInclus ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                        {f.label} {isInclus ? '(Inclus)' : '(En option)'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setModalPackage(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  const id = modalPackage.id;
                  setModalPackage(null);
                  handleSelectFormula(id);
                }}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Sélectionner cette formule
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
