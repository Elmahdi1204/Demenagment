import React, { useState } from 'react';
import { Mail, Clock, User, Check, ArrowRight, ArrowLeft, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { useMoving } from '../context/MovingContext';
import { EmailNotification } from '../types/moving';

export const EmailSimulatorModal: React.FC = () => {
  const { notifications, markNotificationRead, setActiveView, setTrackingRef } = useMoving();
  const [selectedMail, setSelectedMail] = useState<EmailNotification | null>(
    notifications[0] || null
  );
  const [filterRecipient, setFilterRecipient] = useState<string>('all');

  const filteredMails = notifications.filter((m) => {
    if (filterRecipient === 'all') return true;
    return m.recipientType === filterRecipient;
  });

  const handleSelectMail = (mail: EmailNotification) => {
    setSelectedMail(mail);
    markNotificationRead(mail.id);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setActiveView('landing')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au site principal</span>
            </button>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Centre des Emails & Notifications Automatiques
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Visualisez tous les emails transactionnels générés par la plateforme (Client, Propriétaire, Chauffeur).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Total envoyés :</span>
            <span className="font-mono text-sm font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg">
              {notifications.length} emails
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilterRecipient('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filterRecipient === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Tous les destinataires ({notifications.length})
          </button>
          <button
            onClick={() => setFilterRecipient('client')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filterRecipient === 'client'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Emails Clients ({notifications.filter((n) => n.recipientType === 'client').length})
          </button>
          <button
            onClick={() => setFilterRecipient('proprietaire')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filterRecipient === 'proprietaire'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Alertes Propriétaire ({notifications.filter((n) => n.recipientType === 'proprietaire').length})
          </button>
          <button
            onClick={() => setFilterRecipient('chauffeur')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filterRecipient === 'chauffeur'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Missions Chauffeur ({notifications.filter((n) => n.recipientType === 'chauffeur').length})
          </button>
        </div>

        {/* Email Client Layout: Split List & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Email List Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-[700px] overflow-y-auto">
            {filteredMails.map((mail) => {
              const isSelected = selectedMail?.id === mail.id;
              const typeColor =
                mail.recipientType === 'client'
                  ? 'bg-amber-100 text-amber-800'
                  : mail.recipientType === 'proprietaire'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800';

              return (
                <button
                  key={mail.id}
                  onClick={() => handleSelectMail(mail)}
                  className={`w-full text-left p-4 transition-colors flex flex-col gap-1.5 ${
                    isSelected ? 'bg-amber-50/70 border-l-4 border-amber-500' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${typeColor}`}>
                      {mail.recipientType}
                    </span>
                    <span className="font-mono text-slate-400">
                      {new Date(mail.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {mail.subject}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {mail.previewText}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span className="font-mono">À : {mail.to}</span>
                    <span className="font-mono text-amber-700 font-semibold">{mail.relatedRequestId}</span>
                  </div>
                </button>
              );
            })}

            {filteredMails.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                Aucun email enregistré dans cette catégorie.
              </div>
            )}
          </div>

          {/* Email Preview Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            {selectedMail ? (
              <div className="space-y-4">
                {/* Header info */}
                <div className="pb-4 border-b border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded">
                      Dossier : {selectedMail.relatedRequestId}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(selectedMail.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {selectedMail.subject}
                  </h3>

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1">
                    <p>
                      <strong>De :</strong> TransMoov Notifications &lt;no-reply@transmoov.fr&gt;
                    </p>
                    <p>
                      <strong>À :</strong> {selectedMail.to}
                    </p>
                  </div>
                </div>

                {/* HTML content rendered safely */}
                <div
                  className="email-body-content border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 p-4 text-xs sm:text-sm"
                  dangerouslySetInnerHTML={{ __html: selectedMail.contentHtml }}
                />

                {/* Action button related to this email */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setTrackingRef(selectedMail.relatedRequestId);
                      setActiveView('tracking');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Ouvrir le suivi de cette mission</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                Sélectionnez un email dans la liste pour afficher son aperçu.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
