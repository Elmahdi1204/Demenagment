import React, { useState } from 'react';
import {
  Search,
  Truck,
  MapPin,
  Clock,
  Phone,
  Calendar,
  CheckCircle2,
  Building,
  User,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { useMoving } from '../context/MovingContext';
import { STATUS_LABELS, FORMULA_PACKAGES } from '../data/formulas';
import { MovingStatus } from '../types/moving';

const TRACKING_STEPS: { status: MovingStatus; label: string; desc: string }[] = [
  { status: 'demande_recue', label: 'Demande reçue', desc: 'Votre devis a été pris en compte par nos équipes.' },
  { status: 'demande_acceptee', label: 'Demande acceptée', desc: 'Dossier validé par le responsable logistique.' },
  { status: 'rdv_confirme', label: 'Rendez-vous confirmé', desc: 'Date et créneau horaire fixés.' },
  { status: 'chauffeur_assigne', label: 'Chauffeur assigné', desc: 'Véhicule et chauffeur réservés pour votre mission.' },
  { status: 'chauffeur_en_route', label: 'Chauffeur en route', desc: 'Le camion a quitté la base en direction de votre départ.' },
  { status: 'chauffeur_arrive', label: 'Chauffeur arrivé', desc: 'Stationnement effectué devant votre adresse de départ.' },
  { status: 'chargement_en_cours', label: 'Chargement en cours', desc: 'Emballage, portage et arrimage sécurisé dans le camion.' },
  { status: 'chargement_termine', label: 'Chargement terminé', desc: 'Contrôle effectué, départ vers la destination.' },
  { status: 'en_route_destination', label: 'En route vers destination', desc: 'Acheminement routier vers votre nouvelle adresse.' },
  { status: 'arrive_destination', label: 'Arrivé à destination', desc: 'Arrivée à la nouvelle maison / appartement.' },
  { status: 'dechargement_en_cours', label: 'Déchargement en cours', desc: 'Montée des cartons et installation du mobilier.' },
  { status: 'demenagement_termine', label: 'Déménagement terminé', desc: 'Prestation achevée avec succès et émargée.' },
];

export const ClientTrackingView: React.FC = () => {
  const { requests, drivers, trackingRef, setTrackingRef, setActiveView } = useMoving();
  const [searchInput, setSearchInput] = useState(trackingRef);
  const [errorMsg, setErrorMsg] = useState('');

  // Find requested move
  const currentRequest = requests.find(
    (r) => r.id.toUpperCase() === trackingRef.toUpperCase()
  );

  const assignedDriver = currentRequest?.assignedDriverId
    ? drivers.find((d) => d.id === currentRequest.assignedDriverId)
    : null;

  const currentFormula = FORMULA_PACKAGES.find(
    (p) => p.id === currentRequest?.formulaId
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const clean = searchInput.trim().toUpperCase();
    if (!clean) {
      setErrorMsg('Veuillez entrer une référence de déménagement.');
      return;
    }
    const found = requests.find((r) => r.id.toUpperCase() === clean);
    if (!found) {
      setErrorMsg(`Aucun dossier trouvé pour la référence "${clean}". Vérifiez votre saisie.`);
      return;
    }
    setTrackingRef(clean);
  };

  // Determine current step index
  const currentStatusIndex = currentRequest
    ? TRACKING_STEPS.findIndex((s) => s.status === currentRequest.status)
    : -1;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Back & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setActiveView('landing')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Suivi de votre déménagement en temps réel
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Consultez chaque étape de votre dossier sans mot de passe ni identifiant complexe.
            </p>
          </div>

          {/* Quick search bar */}
          <form onSubmit={handleSearch} className="w-full sm:w-auto flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ex: DEM-2026-00125"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors whitespace-nowrap"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Demo Quick switcher chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-500">
          <span className="font-semibold whitespace-nowrap">Dossiers d'exemples :</span>
          {requests.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setTrackingRef(r.id);
                setSearchInput(r.id);
                setErrorMsg('');
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-colors whitespace-nowrap ${
                trackingRef === r.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {r.id} ({STATUS_LABELS[r.status]?.label || r.status})
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Request Details View */}
        {currentRequest ? (
          <div className="space-y-6">
            {/* Top Summary Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-amber-600">Dossier client</span>
                    <span className="font-mono text-xs text-slate-400">· Créé le {new Date(currentRequest.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-mono mt-0.5">
                    {currentRequest.id}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Client : <strong className="text-slate-800">{currentRequest.client.firstName} {currentRequest.client.lastName}</strong> ({currentRequest.client.phone})
                  </p>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="text-xs text-slate-500 font-medium">Statut de la mission :</span>
                  <span
                    className={`mt-1 text-sm font-bold px-3 py-1.5 rounded-full ${
                      STATUS_LABELS[currentRequest.status]?.colorClass || 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {STATUS_LABELS[currentRequest.status]?.label || currentRequest.status}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Formule {currentFormula?.name || 'Classique'} · ~{currentRequest.estimatedVolumeM3} m³
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-6">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>Progression globale</span>
                  <span>
                    {currentStatusIndex >= 0
                      ? `${Math.round(((currentStatusIndex + 1) / TRACKING_STEPS.length) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 rounded-full"
                    style={{
                      width: `${
                        currentStatusIndex >= 0
                          ? ((currentStatusIndex + 1) / TRACKING_STEPS.length) * 100
                          : 5
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Grid: Route Details & Assigned Driver */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Departure */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">A</span>
                  <span>Point de départ</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                  {currentRequest.departure.city} ({currentRequest.departure.postalCode})
                </h4>
                <p className="text-xs text-slate-600">{currentRequest.departure.address}</p>
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p>Type : {currentRequest.departure.housingType} (Étage {currentRequest.departure.floor})</p>
                  <p>Ascenseur : {currentRequest.departure.hasElevator ? 'Oui' : 'Non (escalier)'}</p>
                  {currentRequest.departure.details && (
                    <p className="italic text-[11px] text-slate-400">Note : {currentRequest.departure.details}</p>
                  )}
                </div>
              </div>

              {/* Arrival */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase">
                  <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">B</span>
                  <span>Point d'arrivée</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                  {currentRequest.arrival.city} ({currentRequest.arrival.postalCode})
                </h4>
                <p className="text-xs text-slate-600">{currentRequest.arrival.address}</p>
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p>Type : {currentRequest.arrival.housingType} (Étage {currentRequest.arrival.floor})</p>
                  <p>Ascenseur : {currentRequest.arrival.hasElevator ? 'Oui' : 'Non (escalier)'}</p>
                  {currentRequest.arrival.details && (
                    <p className="italic text-[11px] text-slate-400">Note : {currentRequest.arrival.details}</p>
                  )}
                </div>
              </div>

              {/* Driver & Appointment Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Équipe & Chauffeur</span>
                </div>

                {assignedDriver ? (
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-900">
                      {assignedDriver.firstName} {assignedDriver.lastName}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {assignedDriver.vehicleModel} ({assignedDriver.vehiclePlate})
                    </p>
                    <a
                      href={`tel:${assignedDriver.phone}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors mt-2"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Appeler le chauffeur</span>
                    </a>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 py-3">
                    <p>Chauffeur en cours d'attribution par le responsable d'exploitation.</p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">Rendez-vous planifié :</p>
                  {currentRequest.appointment ? (
                    <p className="text-amber-800 font-bold mt-0.5">
                      {currentRequest.appointment.date} à {currentRequest.appointment.time}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic mt-0.5">
                      Date souhaitée : {currentRequest.preferredDate} (en attente d'horaire fixe)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step-by-Step Interactive Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  Timeline de déroulement de la mission
                </h3>
                <span className="text-xs text-slate-400">Horodatage automatique</span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {TRACKING_STEPS.map((step, idx) => {
                  const isDone = currentStatusIndex >= idx;
                  const isCurrent = currentStatusIndex === idx;

                  // Find log in request statusHistory
                  const historyLog = currentRequest.statusHistory.find(
                    (h) => h.status === step.status
                  );

                  return (
                    <div key={step.status} className="relative flex items-start gap-4">
                      {/* Status indicator dot */}
                      <div
                        className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                          isDone
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4
                            className={`text-sm font-bold ${
                              isCurrent
                                ? 'text-amber-700'
                                : isDone
                                ? 'text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                Étape actuelle
                              </span>
                            )}
                          </h4>

                          {historyLog && (
                            <span className="text-[11px] font-mono text-slate-400">
                              {new Date(historyLog.timestamp).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500">{step.desc}</p>

                        {historyLog?.note && (
                          <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200/80 p-2 rounded-lg mt-1 italic">
                            « {historyLog.note} »
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                <p className="font-semibold text-white">Besoin d'aide ou de modifier un horaire ?</p>
                <p>Notre service client est joignable gratuitement du lundi au samedi au 01 89 20 44 00.</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView('emails')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-white transition-colors"
                >
                  Voir les notifications reçues
                </button>
                <button
                  onClick={() => setActiveView('driver')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                >
                  Tester l'espace chauffeur →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Dossier introuvable</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Veuillez vérifier votre numéro de référence ou sélectionner l'un des dossiers de démonstration ci-dessus.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
