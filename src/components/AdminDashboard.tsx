import React, { useState } from 'react';
import {
  Users,
  Truck,
  Calendar,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Clock,
  Filter,
  Search,
  Plus,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Building,
  RotateCcw,
} from 'lucide-react';
import { useMoving } from '../context/MovingContext';
import { Driver, MovingRequest, MovingStatus } from '../types/moving';
import { STATUS_LABELS, FORMULA_PACKAGES } from '../data/formulas';

export const AdminDashboard: React.FC = () => {
  const {
    requests,
    drivers,
    acceptRequest,
    refuseRequest,
    setAppointment,
    assignDriver,
    addDriver,
    updateDriver,
    resetToDemoData,
    setTrackingRef,
    setActiveView,
    setCurrentDriverId,
  } = useMoving();

  const [activeTab, setActiveTab] = useState<'requests' | 'drivers' | 'stats'>('requests');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<MovingRequest | null>(null);

  // Appointment Modal State
  const [showRdvModal, setShowRdvModal] = useState(false);
  const [rdvDate, setRdvDate] = useState('');
  const [rdvTime, setRdvTime] = useState('08:30');
  const [rdvNotes, setRdvNotes] = useState('');

  // Assign Driver Modal State
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [targetDriverId, setTargetDriverId] = useState('');

  // Add Driver Modal State
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [newDriverFirstName, setNewDriverFirstName] = useState('');
  const [newDriverLastName, setNewDriverLastName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newDriverEmail, setNewDriverEmail] = useState('');
  const [newDriverModel, setNewDriverModel] = useState('Renault Master 20m³');
  const [newDriverPlate, setNewDriverPlate] = useState('AB-123-CD');
  const [newDriverType, setNewDriverType] = useState('Fourgon Grand Volume');
  const [newDriverCapacity, setNewDriverCapacity] = useState<number>(20);

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? r.status === 'demande_recue'
        : statusFilter === 'active'
        ? !['demenagement_termine', 'demande_refusee'].includes(r.status)
        : statusFilter === 'done'
        ? r.status === 'demenagement_termine'
        : r.status === statusFilter;

    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.departure.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.arrival.city.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Key metrics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === 'demande_recue').length;
  const inProgressMoves = requests.filter(
    (r) => !['demande_recue', 'demenagement_termine', 'demande_refusee'].includes(r.status)
  ).length;
  const completedMoves = requests.filter((r) => r.status === 'demenagement_termine').length;
  const availableDrivers = drivers.filter((d) => d.availability === 'disponible').length;

  const handleOpenRdv = (req: MovingRequest) => {
    setSelectedRequest(req);
    setRdvDate(req.appointment?.date || req.preferredDate);
    setRdvTime(req.appointment?.time || '08:30');
    setRdvNotes(req.appointment?.notes || '');
    setShowRdvModal(true);
  };

  const handleSaveRdv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setAppointment(selectedRequest.id, rdvDate, rdvTime, rdvNotes);
    setShowRdvModal(false);
    // Refresh selected request in modal if open
    const updated = requests.find((r) => r.id === selectedRequest.id);
    if (updated) setSelectedRequest(updated);
  };

  const handleOpenAssignDriver = (req: MovingRequest) => {
    setSelectedRequest(req);
    setTargetDriverId(req.assignedDriverId || drivers[0]?.id || '');
    setShowDriverModal(true);
  };

  const handleSaveAssignDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !targetDriverId) return;
    assignDriver(selectedRequest.id, targetDriverId);
    setShowDriverModal(false);
  };

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    addDriver({
      firstName: newDriverFirstName,
      lastName: newDriverLastName,
      phone: newDriverPhone,
      email: newDriverEmail,
      vehicleModel: newDriverModel,
      vehiclePlate: newDriverPlate,
      vehicleType: newDriverType,
      vehicleCapacityM3: Number(newDriverCapacity),
      availability: 'disponible',
    });
    setShowAddDriverModal(false);
    setNewDriverFirstName('');
    setNewDriverLastName('');
    setNewDriverPhone('');
    setNewDriverEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Centre d'exploitation
                </span>
                <span className="text-xs text-slate-400">· Direction & Logistique</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Dashboard Propriétaire & Gestionnaire
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pilotez vos demandes entrantes, assignez les chauffeurs et suivez les missions en cours.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetToDemoData}
                title="Réinitialiser les données de démo"
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Démo</span>
              </button>

              <button
                onClick={() => {
                  setShowAddDriverModal(true);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau chauffeur</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 block">Total demandes</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {totalRequests}
              </span>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
              <span className="text-xs font-semibold text-amber-800 block">Nouvelles / À valider</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono tabular-nums">
                {pendingRequests}
              </span>
            </div>

            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80">
              <span className="text-xs font-semibold text-blue-800 block">Missions en cours</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-mono tabular-nums">
                {inProgressMoves}
              </span>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
              <span className="text-xs font-semibold text-emerald-800 block">Chauffeurs disponibles</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
                {availableDrivers} / {drivers.length}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-4 text-sm font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>Dossiers de déménagement</span>
            <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-mono">
              {requests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('drivers')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'drivers'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Gestion des chauffeurs & Véhicules</span>
            <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-mono">
              {drivers.length}
            </span>
          </button>
        </div>

        {/* TAB 1: Requests Management */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Filter toolbar */}
            <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Toutes ({requests.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    statusFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  À valider ({pendingRequests})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    statusFilter === 'active'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  En cours ({inProgressMoves})
                </button>
                <button
                  onClick={() => setStatusFilter('done')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    statusFilter === 'done'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Terminées ({completedMoves})
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Réf, client, ville..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Référence</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Départ ➔ Arrivée</th>
                    <th className="py-3 px-4">Date / RDV</th>
                    <th className="py-3 px-4">Formule</th>
                    <th className="py-3 px-4">Chauffeur</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRequests.map((req) => {
                    const assignedDriver = drivers.find((d) => d.id === req.assignedDriverId);
                    const formula = FORMULA_PACKAGES.find((p) => p.id === req.formulaId);

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                          {req.id}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">
                            {req.client.firstName} {req.client.lastName}
                          </span>
                          <a
                            href={`tel:${req.client.phone}`}
                            className="text-slate-500 hover:text-amber-600 flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{req.client.phone}</span>
                          </a>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">
                            {req.departure.city} ➔ {req.arrival.city}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate max-w-[200px]">
                            {req.departure.address}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {req.appointment ? (
                            <div>
                              <span className="font-bold text-slate-900 block">
                                {req.appointment.date}
                              </span>
                              <span className="text-amber-700 font-semibold text-[11px] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {req.appointment.time}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">
                              Souhaitée : {req.preferredDate}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold uppercase text-slate-800 block">
                            {formula?.name || req.formulaId}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {req.estimatedPrice} € · {req.estimatedVolumeM3}m³
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {assignedDriver ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">
                                {assignedDriver.firstName} {assignedDriver.lastName}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenAssignDriver(req)}
                              className="text-[11px] font-semibold text-amber-700 hover:underline"
                            >
                              + Assigner
                            </button>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block whitespace-nowrap ${
                              STATUS_LABELS[req.status]?.colorClass || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {STATUS_LABELS[req.status]?.label || req.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {req.status === 'demande_recue' && (
                              <button
                                onClick={() => acceptRequest(req.id)}
                                title="Accepter la demande"
                                className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenRdv(req)}
                              title="Fixer / Modifier le RDV"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenAssignDriver(req)}
                              title="Assigner un chauffeur"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            >
                              <Truck className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setSelectedRequest(req)}
                              title="Détails complets"
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                            >
                              Détails
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredRequests.length === 0 && (
                <div className="p-10 text-center text-slate-400 text-xs">
                  Aucun dossier ne correspond à vos filtres.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Drivers & Fleet Management */}
        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Flotte de transporteurs & Disponibilités
                </h3>
                <p className="text-xs text-slate-500">
                  Chaque chauffeur reçoit automatiquement un email avec un lien sécurisé vers son espace lors de chaque attribution.
                </p>
              </div>

              <button
                onClick={() => setShowAddDriverModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un chauffeur</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {drivers.map((d) => {
                const isDispo = d.availability === 'disponible';
                const isMission = d.availability === 'en_mission';

                return (
                  <div
                    key={d.id}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isDispo
                              ? 'bg-emerald-100 text-emerald-800'
                              : isMission
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isDispo ? 'Disponible' : isMission ? 'En mission' : 'En congé'}
                        </span>

                        <span className="font-mono text-xs font-bold text-slate-400">
                          {d.vehiclePlate}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-extrabold text-slate-900">
                          {d.firstName} {d.lastName}
                        </h4>
                        <p className="text-xs text-slate-600 font-semibold mt-0.5">
                          {d.vehicleModel}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {d.vehicleType} · Capacité {d.vehicleCapacityM3} m³
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{d.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{d.email}</span>
                        </div>
                        {d.activeMissionRef && (
                          <div className="flex items-center gap-2 pt-1 font-mono text-amber-700 text-xs">
                            <Truck className="w-3.5 h-3.5" />
                            <span>Mission : {d.activeMissionRef}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setCurrentDriverId(d.id);
                          setActiveView('driver');
                        }}
                        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors text-center"
                      >
                        Ouvrir son espace
                      </button>

                      <button
                        onClick={() => {
                          updateDriver(d.id, {
                            availability: isDispo ? 'conge' : 'disponible',
                          });
                        }}
                        className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
                      >
                        {isDispo ? 'Mettre en congé' : 'Rendre dispo'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL: Request Details Drawer */}
        {selectedRequest && !showRdvModal && !showDriverModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    {selectedRequest.id}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Dossier {selectedRequest.client.firstName} {selectedRequest.client.lastName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Créé le {new Date(selectedRequest.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Statut actuel :</span>
                  <span
                    className={`mt-0.5 text-xs font-bold px-2.5 py-1 rounded-full inline-block ${
                      STATUS_LABELS[selectedRequest.status]?.colorClass || 'bg-slate-200'
                    }`}
                  >
                    {STATUS_LABELS[selectedRequest.status]?.label || selectedRequest.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedRequest.client.phone}`}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Appeler</span>
                  </a>

                  {selectedRequest.status === 'demande_recue' && (
                    <>
                      <button
                        onClick={() => {
                          acceptRequest(selectedRequest.id);
                          setSelectedRequest(null);
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => {
                          refuseRequest(selectedRequest.id);
                          setSelectedRequest(null);
                        }}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl"
                      >
                        Refuser
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Addresses comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <span className="font-bold uppercase text-emerald-800 block text-[10px]">
                    Départ (Maison A)
                  </span>
                  <p className="font-bold text-slate-900">{selectedRequest.departure.address}</p>
                  <p className="text-slate-600">
                    {selectedRequest.departure.postalCode} {selectedRequest.departure.city}
                  </p>
                  <p className="text-slate-500 pt-1">
                    Étage {selectedRequest.departure.floor} · Ascenseur :{' '}
                    {selectedRequest.departure.hasElevator ? 'Oui' : 'Non'}
                  </p>
                  {selectedRequest.departure.details && (
                    <p className="italic text-slate-400 text-[11px]">
                      « {selectedRequest.departure.details} »
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
                  <span className="font-bold uppercase text-blue-800 block text-[10px]">
                    Arrivée (Maison B)
                  </span>
                  <p className="font-bold text-slate-900">{selectedRequest.arrival.address}</p>
                  <p className="text-slate-600">
                    {selectedRequest.arrival.postalCode} {selectedRequest.arrival.city}
                  </p>
                  <p className="text-slate-500 pt-1">
                    Étage {selectedRequest.arrival.floor} · Ascenseur :{' '}
                    {selectedRequest.arrival.hasElevator ? 'Oui' : 'Non'}
                  </p>
                  {selectedRequest.arrival.details && (
                    <p className="italic text-slate-400 text-[11px]">
                      « {selectedRequest.arrival.details} »
                    </p>
                  )}
                </div>
              </div>

              {/* History timeline log */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-xs font-bold text-slate-900 uppercase">
                  Historique des étapes :
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedRequest.statusHistory.map((h, i) => (
                    <div key={i} className="text-xs flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50">
                      <div>
                        <span className="font-bold text-slate-800">
                          {STATUS_LABELS[h.status]?.label || h.status}
                        </span>
                        {h.note && <p className="text-slate-500 text-[11px]">{h.note}</p>}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {new Date(h.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setTrackingRef(selectedRequest.id);
                    setActiveView('tracking');
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl"
                >
                  Voir vue client
                </button>
                <button
                  onClick={() => handleOpenAssignDriver(selectedRequest)}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
                >
                  Assigner un chauffeur
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Fixer / Modifier le Rendez-vous */}
        {showRdvModal && selectedRequest && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Fixer le rendez-vous client
                </h3>
                <button
                  onClick={() => setShowRdvModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Mission {selectedRequest.id} · {selectedRequest.client.firstName}{' '}
                {selectedRequest.client.lastName}
              </p>

              <form onSubmit={handleSaveRdv} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Date du déménagement *
                  </label>
                  <input
                    type="date"
                    required
                    value={rdvDate}
                    onChange={(e) => setRdvDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Heure précise de début *
                  </label>
                  <input
                    type="time"
                    required
                    value={rdvTime}
                    onChange={(e) => setRdvTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Instructions & Remarques pour l'équipe
                  </label>
                  <textarea
                    rows={2}
                    value={rdvNotes}
                    onChange={(e) => setRdvNotes(e.target.value)}
                    placeholder="Équipe de 2 déménageurs requise, accès par l'arrière cour..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRdvModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                  >
                    Confirmer le RDV
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Assigner un Chauffeur */}
        {showDriverModal && selectedRequest && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Assigner un chauffeur
                </h3>
                <button
                  onClick={() => setShowDriverModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Le chauffeur sélectionné recevra immédiatement un email avec les adresses et le lien mobile de sa mission.
              </p>

              <form onSubmit={handleSaveAssignDriver} className="space-y-4">
                <div className="space-y-2">
                  {drivers.map((drv) => (
                    <label
                      key={drv.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                        targetDriverId === drv.id
                          ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="assignedDriver"
                          value={drv.id}
                          checked={targetDriverId === drv.id}
                          onChange={() => setTargetDriverId(drv.id)}
                          className="text-amber-500"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {drv.firstName} {drv.lastName}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {drv.vehicleModel} ({drv.vehiclePlate}) · {drv.vehicleCapacityM3}m³
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          drv.availability === 'disponible'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {drv.availability === 'disponible' ? 'Disponible' : 'En mission'}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDriverModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                  >
                    Attribuer la mission
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Ajouter un chauffeur */}
        {showAddDriverModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Enregistrer un nouveau chauffeur
                </h3>
                <button
                  onClick={() => setShowAddDriverModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDriver} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={newDriverFirstName}
                      onChange={(e) => setNewDriverFirstName(e.target.value)}
                      placeholder="Mohamed"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={newDriverLastName}
                      onChange={(e) => setNewDriverLastName(e.target.value)}
                      placeholder="Amine"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={newDriverPhone}
                      onChange={(e) => setNewDriverPhone(e.target.value)}
                      placeholder="06 55 XX XX XX"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={newDriverEmail}
                      onChange={(e) => setNewDriverEmail(e.target.value)}
                      placeholder="chauffeur@transmoov.fr"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Véhicule *</label>
                    <input
                      type="text"
                      required
                      value={newDriverModel}
                      onChange={(e) => setNewDriverModel(e.target.value)}
                      placeholder="Renault Master 20m³"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Matricule *</label>
                    <input
                      type="text"
                      required
                      value={newDriverPlate}
                      onChange={(e) => setNewDriverPlate(e.target.value)}
                      placeholder="AB-123-CD"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Type de véhicule</label>
                    <input
                      type="text"
                      value={newDriverType}
                      onChange={(e) => setNewDriverType(e.target.value)}
                      placeholder="Fourgon Grand Volume"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Capacité (m³)</label>
                    <input
                      type="number"
                      min={5}
                      max={80}
                      value={newDriverCapacity}
                      onChange={(e) => setNewDriverCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddDriverModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors"
                  >
                    Enregistrer le chauffeur
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
