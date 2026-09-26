import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Building,
  User,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';
import { FORMULA_PACKAGES } from '../data/formulas';
import { FormulaId, HousingType } from '../types/moving';
import { useMoving } from '../context/MovingContext';

export const BookingForm: React.FC = () => {
  const {
    selectedFormulaForBooking,
    setSelectedFormulaForBooking,
    createRequest,
    setActiveView,
    setTrackingRef,
  } = useMoving();

  // Form State
  const [formulaId, setFormulaId] = useState<FormulaId>('classique');

  // Client info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Departure (Maison A)
  const [depAddress, setDepAddress] = useState('');
  const [depCity, setDepCity] = useState('');
  const [depPostalCode, setDepPostalCode] = useState('');
  const [depHousingType, setDepHousingType] = useState<HousingType>('Appartement');
  const [depFloor, setDepFloor] = useState<number>(2);
  const [depElevator, setDepElevator] = useState<boolean>(true);
  const [depDetails, setDepDetails] = useState('');

  // Arrival (Maison B)
  const [arrAddress, setArrAddress] = useState('');
  const [arrCity, setArrCity] = useState('');
  const [arrPostalCode, setArrPostalCode] = useState('');
  const [arrHousingType, setArrHousingType] = useState<HousingType>('Maison');
  const [arrFloor, setArrFloor] = useState<number>(0);
  const [arrElevator, setArrElevator] = useState<boolean>(false);
  const [arrDetails, setArrDetails] = useState('');

  // Move details
  const [preferredDate, setPreferredDate] = useState('2026-10-15');
  const [estimatedVolume, setEstimatedVolume] = useState<number>(20);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRef, setCreatedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Listen to preselected formula from the pricing table
  useEffect(() => {
    if (selectedFormulaForBooking) {
      setFormulaId(selectedFormulaForBooking as FormulaId);
    }
  }, [selectedFormulaForBooking]);

  // Current package
  const currentPackage =
    FORMULA_PACKAGES.find((p) => p.id === formulaId) || FORMULA_PACKAGES[1];

  // Price estimate calculation
  const calculatedPrice = Math.round(
    currentPackage.basePrice +
      Math.max(0, estimatedVolume - 10) * 35 +
      (depElevator ? 0 : depFloor * 25) +
      (arrElevator ? 0 : arrFloor * 25)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('Veuillez renseigner votre nom et prénom.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Veuillez renseigner un numéro de téléphone valide.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Veuillez renseigner une adresse email valide.');
      return;
    }
    if (!depAddress.trim() || !depCity.trim() || !arrAddress.trim() || !arrCity.trim()) {
      setErrorMsg('Veuillez compléter les adresses de départ et d’arrivée.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newId = createRequest({
        client: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim(),
        },
        departure: {
          address: depAddress.trim(),
          city: depCity.trim(),
          postalCode: depPostalCode.trim() || '75000',
          housingType: depHousingType,
          floor: Number(depFloor),
          hasElevator: depElevator,
          details: depDetails.trim(),
        },
        arrival: {
          address: arrAddress.trim(),
          city: arrCity.trim(),
          postalCode: arrPostalCode.trim() || '69000',
          housingType: arrHousingType,
          floor: Number(arrFloor),
          hasElevator: arrElevator,
          details: arrDetails.trim(),
        },
        formulaId,
        estimatedVolumeM3: Number(estimatedVolume),
        preferredDate,
        estimatedPrice: calculatedPrice,
      });

      setCreatedRef(newId);
      setTrackingRef(newId);
    } catch {
      setErrorMsg("Une erreur est survenue lors de l'enregistrement de votre demande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully created, show confirmation card
  if (createdRef) {
    return (
      <section id="booking-section" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Demande transmise avec succès
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900">
                Félicitations {firstName}, votre dossier est ouvert !
              </h3>
              <p className="text-slate-600 text-sm max-w-xl mx-auto">
                Un email de confirmation contenant votre récapitulatif a été envoyé à{' '}
                <strong className="text-slate-900">{email}</strong>.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Référence unique :</span>
                <span className="font-mono text-base font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  {createdRef}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <strong>Formule :</strong> {currentPackage.name} (~{calculatedPrice} €)
                </p>
                <p>
                  <strong>Départ :</strong> {depCity} (Étage {depFloor})
                </p>
                <p>
                  <strong>Arrivée :</strong> {arrCity} (Étage {arrFloor})
                </p>
                <p>
                  <strong>Date souhaitée :</strong> {preferredDate}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  setTrackingRef(createdRef);
                  setActiveView('tracking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Suivre mon déménagement en direct</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveView('emails');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Voir l'email de confirmation</span>
              </button>
            </div>

            <button
              onClick={() => {
                setCreatedRef(null);
                setFirstName('');
                setLastName('');
              }}
              className="text-xs text-slate-400 hover:text-slate-600 underline block mx-auto"
            >
              Créer une autre demande
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking-section" className="py-20 bg-slate-100/60 border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Devis instantané sans engagement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Demande de déménagement en ligne
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Remplissez les détails de vos logements. Aucune création de compte requise. Vous
            recevrez votre référence de dossier et votre estimation en direct.
          </p>
        </div>

        {/* Error box */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Package Selector */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-lg">Choisissez votre formule</h3>
              </div>
              <span className="text-xs text-slate-500">
                Formule sélectionnée :{' '}
                <strong className="text-slate-900 uppercase">{currentPackage.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
              {FORMULA_PACKAGES.map((pkg) => {
                const isSelected = formulaId === pkg.id;
                return (
                  <button
                    type="button"
                    key={pkg.id}
                    onClick={() => {
                      setFormulaId(pkg.id);
                      setSelectedFormulaForBooking(pkg.id);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-500 block uppercase">
                      {pkg.name}
                    </span>
                    <span className="text-lg font-extrabold text-slate-900 block mt-1">
                      dès {pkg.basePrice} €
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {pkg.companyShare}% nous / {pkg.clientShare}% vous
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Client Personal Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-lg">Vos coordonnées</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Prénom *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Nom *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Numéro de téléphone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Adresse email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean.dupont@email.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Addresses Comparison (Maison A -> Maison B) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Maison A (Départ) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                    A
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Adresse de départ (Maison A)</h3>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Point d'enlèvement
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Adresse postale *
                </label>
                <input
                  type="text"
                  required
                  value={depAddress}
                  onChange={(e) => setDepAddress(e.target.value)}
                  placeholder="Ex: 14 Rue de la Paix"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={depCity}
                    onChange={(e) => setDepCity(e.target.value)}
                    placeholder="Paris"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    required
                    value={depPostalCode}
                    onChange={(e) => setDepPostalCode(e.target.value)}
                    placeholder="75001"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Type de logement
                  </label>
                  <select
                    value={depHousingType}
                    onChange={(e) => setDepHousingType(e.target.value as HousingType)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Appartement">Appartement</option>
                    <option value="Maison">Maison individuelle</option>
                    <option value="Bureau / Local">Bureau / Local</option>
                    <option value="Garde-meuble">Garde-meuble</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Étage
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={depFloor}
                    onChange={(e) => setDepFloor(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Ascenseur disponible ?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="depElevator"
                      checked={depElevator === true}
                      onChange={() => setDepElevator(true)}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span>Oui (avec ascenseur)</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="depElevator"
                      checked={depElevator === false}
                      onChange={() => setDepElevator(false)}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span>Non (escalier uniquement)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Informations complémentaires
                </label>
                <textarea
                  rows={2}
                  value={depDetails}
                  onChange={(e) => setDepDetails(e.target.value)}
                  placeholder="Code porte, cour intérieure, autorisation stationnement requise..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Maison B (Arrivée) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    B
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Adresse d'arrivée (Maison B)</h3>
                </div>
                <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  Point de livraison
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Adresse postale *
                </label>
                <input
                  type="text"
                  required
                  value={arrAddress}
                  onChange={(e) => setArrAddress(e.target.value)}
                  placeholder="Ex: 28 Avenue Foch"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={arrCity}
                    onChange={(e) => setArrCity(e.target.value)}
                    placeholder="Lyon"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    required
                    value={arrPostalCode}
                    onChange={(e) => setArrPostalCode(e.target.value)}
                    placeholder="69002"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Type de logement
                  </label>
                  <select
                    value={arrHousingType}
                    onChange={(e) => setArrHousingType(e.target.value as HousingType)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Maison">Maison individuelle</option>
                    <option value="Appartement">Appartement</option>
                    <option value="Bureau / Local">Bureau / Local</option>
                    <option value="Garde-meuble">Garde-meuble</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Étage
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={arrFloor}
                    onChange={(e) => setArrFloor(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Ascenseur disponible ?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="arrElevator"
                      checked={arrElevator === true}
                      onChange={() => setArrElevator(true)}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span>Oui (avec ascenseur)</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="arrElevator"
                      checked={arrElevator === false}
                      onChange={() => setArrElevator(false)}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span>Non (plain-pied / escalier)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Informations complémentaires
                </label>
                <textarea
                  rows={2}
                  value={arrDetails}
                  onChange={(e) => setArrDetails(e.target.value)}
                  placeholder="Accès camion facile, portail électrique, remise des clés..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Planning & Estimation */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-slate-900 text-lg">Planning & Volume estimé</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Date souhaitée du déménagement *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 uppercase">
                    Volume estimé :
                  </label>
                  <span className="font-mono text-sm font-bold text-amber-600">
                    {estimatedVolume} m³
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={1}
                  value={estimatedVolume}
                  onChange={(e) => setEstimatedVolume(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Studio (&lt;10m³)</span>
                  <span>T2/T3 (20-30m³)</span>
                  <span>Maison (&gt;40m³)</span>
                </div>
              </div>
            </div>

            {/* Price Preview Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-amber-400 uppercase tracking-wider block">
                  Estimation automatique transparente
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {calculatedPrice} €
                  </span>
                  <span className="text-xs text-slate-400">TTC (hors assurance spécifique)</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Formule {currentPackage.name} · {estimatedVolume} m³ · Départ {depCity || 'A'} ➔{' '}
                  {arrCity || 'B'}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <span>Enregistrement en cours...</span>
                ) : (
                  <>
                    <span>Valider ma demande de déménagement</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
