import React, { useState } from 'react';
import {
  Truck,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Navigation,
  FileText,
  AlertCircle,
  PenTool,
  Send,
  User,
  ArrowLeft,
} from 'lucide-react';
import { useMoving } from '../context/MovingContext';
import { MovingStatus } from '../types/moving';
import { STATUS_LABELS } from '../data/formulas';

const DRIVER_FLOW_STEPS: { status: MovingStatus; label: string; actionLabel: string }[] = [
  { status: 'chauffeur_en_route', label: 'Chauffeur en route', actionLabel: 'Je pars vers le client' },
  { status: 'chauffeur_arrive', label: 'Chauffeur arrivé au départ', actionLabel: 'Je suis arrivé sur place' },
  { status: 'chargement_en_cours', label: 'Chargement en cours', actionLabel: 'Commencer le chargement' },
  { status: 'chargement_termine', label: 'Chargement terminé', actionLabel: 'Terminer le chargement' },
  { status: 'en_route_destination', label: 'En route vers destination', actionLabel: 'Prendre la route de livraison' },
  { status: 'arrive_destination', label: 'Arrivé à destination', actionLabel: 'Arrivé à la nouvelle adresse' },
  { status: 'dechargement_en_cours', label: 'Déchargement en cours', actionLabel: 'Commencer le déchargement' },
  { status: 'demenagement_termine', label: 'Déménagement terminé', actionLabel: 'Clôturer la mission' },
];

export const DriverSpaceView: React.FC = () => {
  const {
    drivers,
    requests,
    currentDriverId,
    setCurrentDriverId,
    updateRequestStatus,
    setActiveView,
    setTrackingRef,
  } = useMoving();

  const [activeTab, setActiveTab] = useState<'mission' | 'details' | 'signature'>('mission');
  const [driverNote, setDriverNote] = useState('');
  const [isSignDone, setIsSignDone] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Selected driver
  const driver = drivers.find((d) => d.id === currentDriverId) || drivers[1];

  // Find missions assigned to this driver
  const assignedRequests = requests.filter((r) => r.assignedDriverId === driver.id);
  // Pick active one (or first one)
  const currentMission =
    assignedRequests.find((r) => r.status !== 'demenagement_termine') || assignedRequests[0] || requests[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleAdvanceStatus = (nextStatus: MovingStatus) => {
    if (!currentMission) return;
    updateRequestStatus(
      currentMission.id,
      nextStatus,
      'chauffeur',
      driverNote.trim() ? driverNote.trim() : undefined
    );
    setDriverNote('');
    showToast(`Statut mis à jour : "${STATUS_LABELS[nextStatus]?.label || nextStatus}" ! Email envoyé au client.`);
  };

  const handleCompleteWithSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMission) return;
    if (!signatureName.trim()) {
      showToast('Veuillez inscrire le nom du client signataire.');
      return;
    }
    updateRequestStatus(
      currentMission.id,
      'demenagement_termine',
      'chauffeur',
      `Émargé et validé par le client (${signatureName}). Tout le matériel est intact.`
    );
    setIsSignDone(true);
    showToast('Mission clôturée avec succès ! Client et direction notifiés.');
  };

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-3 sm:px-6 text-slate-100 flex justify-center">
      {/* Mobile-optimized viewport container */}
      <div className="w-full max-w-md bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[750px]">
        {/* Driver Top Header */}
        <div className="bg-slate-900 p-4 border-b border-slate-800">
          <div className="flex items-center justify-between pb-3">
            <button
              onClick={() => setActiveView('landing')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quitter l'Espace</span>
            </button>

            {/* Driver Profile Switcher for evaluation */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Chauffeur :</span>
              <select
                value={driver.id}
                onChange={(e) => setCurrentDriverId(e.target.value)}
                className="bg-slate-800 text-amber-400 text-xs font-semibold py-1 px-2 rounded-lg border border-slate-700 focus:outline-none"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.firstName} {d.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <h2 className="text-base font-extrabold text-white">
                {driver.firstName} {driver.lastName}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {driver.vehicleModel} · {driver.vehiclePlate}
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              En service
            </span>
          </div>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {currentMission ? (
          <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
            {/* Active Mission Header Card */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-400">
                  Mission active
                </span>
                <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {currentMission.id}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[11px]">Statut actuel :</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {STATUS_LABELS[currentMission.status]?.label || currentMission.status}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setTrackingRef(currentMission.id);
                    setActiveView('tracking');
                  }}
                  className="text-[10px] text-slate-400 hover:text-white underline"
                >
                  Vue client
                </button>
              </div>

              {/* Client Quick Call */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {currentMission.client.firstName} {currentMission.client.lastName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {currentMission.client.phone}
                  </span>
                </div>
                <a
                  href={`tel:${currentMission.client.phone}`}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>

            {/* Segmented Subtabs: Progression / Adresses / Clôture */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setActiveTab('mission')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'mission'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Statuts
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'details'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Adresses & GPS
              </button>
              <button
                onClick={() => setActiveTab('signature')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'signature'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Signature
              </button>
            </div>

            {/* TAB 1: Status progression updater */}
            {activeTab === 'mission' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 block">
                    Passer à l'étape suivante en un clic :
                  </span>

                  <div className="space-y-2">
                    {DRIVER_FLOW_STEPS.map((step) => {
                      const isCompleted =
                        (STATUS_LABELS[currentMission.status]?.stepNumber || 0) >=
                        (STATUS_LABELS[step.status]?.stepNumber || 0);
                      const isNext =
                        (STATUS_LABELS[currentMission.status]?.stepNumber || 0) + 1 ===
                        (STATUS_LABELS[step.status]?.stepNumber || 0);

                      return (
                        <button
                          key={step.status}
                          onClick={() => handleAdvanceStatus(step.status)}
                          className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between border ${
                            isCompleted
                              ? 'bg-slate-900/60 border-slate-800 text-slate-500'
                              : isNext
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-500/20'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Clock className={`w-4 h-4 shrink-0 ${isNext ? 'text-slate-950' : 'text-slate-500'}`} />
                            )}
                            <span>{step.label}</span>
                          </div>

                          <span className={`text-[11px] font-semibold ${isNext ? 'text-slate-950 underline' : 'text-slate-400'}`}>
                            {isCompleted ? 'Validé' : isNext ? step.actionLabel : 'À venir'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Driver observation note */}
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">
                    Ajouter une note ou remarque d'étape :
                  </label>
                  <input
                    type="text"
                    value={driverNote}
                    onChange={(e) => setDriverNote(e.target.value)}
                    placeholder="Ex: Stationné en double file avec gyrophares..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    Cette note sera jointe à l'historique et au prochain email d'alerte.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Route & Addresses with direct Maps navigation */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* Maison A */}
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">A</span>
                      Départ (Maison A)
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${currentMission.departure.address}, ${currentMission.departure.postalCode} ${currentMission.departure.city}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Ouvrir GPS</span>
                    </a>
                  </div>

                  <p className="text-sm font-bold text-white">
                    {currentMission.departure.address}
                  </p>
                  <p className="text-xs text-slate-400">
                    {currentMission.departure.postalCode} {currentMission.departure.city}
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-0.5">
                    <p>Logement : {currentMission.departure.housingType} · Étage {currentMission.departure.floor}</p>
                    <p>Ascenseur : {currentMission.departure.hasElevator ? 'Oui' : 'Non (escalier)'}</p>
                    {currentMission.departure.details && (
                      <p className="text-amber-300 italic text-[11px]">Note : {currentMission.departure.details}</p>
                    )}
                  </div>
                </div>

                {/* Maison B */}
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-blue-400 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">B</span>
                      Arrivée (Maison B)
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${currentMission.arrival.address}, ${currentMission.arrival.postalCode} ${currentMission.arrival.city}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Ouvrir GPS</span>
                    </a>
                  </div>

                  <p className="text-sm font-bold text-white">
                    {currentMission.arrival.address}
                  </p>
                  <p className="text-xs text-slate-400">
                    {currentMission.arrival.postalCode} {currentMission.arrival.city}
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-0.5">
                    <p>Logement : {currentMission.arrival.housingType} · Étage {currentMission.arrival.floor}</p>
                    <p>Ascenseur : {currentMission.arrival.hasElevator ? 'Oui' : 'Non (escalier)'}</p>
                    {currentMission.arrival.details && (
                      <p className="text-amber-300 italic text-[11px]">Note : {currentMission.arrival.details}</p>
                    )}
                  </div>
                </div>

                {/* Appointment time */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>RDV fixé :</span>
                  </div>
                  <span className="font-bold text-white">
                    {currentMission.appointment
                      ? `${currentMission.appointment.date} à ${currentMission.appointment.time}`
                      : currentMission.preferredDate}
                  </span>
                </div>
              </div>
            )}

            {/* TAB 3: Digital Signature */}
            {activeTab === 'signature' && (
              <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                    <PenTool className="w-4 h-4" />
                    <span>Émargement & Fin de mission</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Faites signer le client à l'arrivée après vérification du bon état des biens transportés.
                  </p>

                  <form onSubmit={handleCompleteWithSignature} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 uppercase block mb-1">
                        Nom complet du client signataire :
                      </label>
                      <input
                        type="text"
                        required
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        placeholder="Ex: Sophie Dubois"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Simulated digital pad */}
                    <div className="border border-dashed border-slate-700 rounded-xl p-4 text-center bg-slate-950/70">
                      <p className="text-[11px] text-slate-500">Cadre de signature tactile</p>
                      <div className="h-20 flex items-center justify-center text-amber-400 font-serif italic text-lg opacity-80">
                        {signatureName ? `Signé : ${signatureName}` : 'Signature sur écran'}
                      </div>
                      <span className="text-[10px] text-slate-500 block">Horodatage automatique certifié</span>
                    </div>

                    <button
                      type="submit"
                      disabled={currentMission.status === 'demenagement_termine'}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {currentMission.status === 'demenagement_termine'
                          ? 'Mission déjà clôturée'
                          : 'Valider l’émargement & Clôturer'}
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center text-slate-500 text-xs">
            Aucune mission en cours pour ce chauffeur.
          </div>
        )}

        {/* Footer info */}
        <div className="bg-slate-900/60 p-3 border-t border-slate-800 text-center text-[10px] text-slate-500">
          TransMoov Chauffeur Web v1.2 · Mode Responsive Économique
        </div>
      </div>
    </div>
  );
};
