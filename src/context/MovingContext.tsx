import React, { createContext, useContext, useEffect, useState } from 'react';
import { STATUS_LABELS } from '../data/formulas';
import { INITIAL_DRIVERS, INITIAL_NOTIFICATIONS, INITIAL_REQUESTS } from '../data/initialData';
import { Driver, EmailNotification, MovingRequest, MovingStatus } from '../types/moving';

export type AppView = 'landing' | 'booking' | 'tracking' | 'admin' | 'driver' | 'emails';

interface MovingContextType {
  requests: MovingRequest[];
  drivers: Driver[];
  notifications: EmailNotification[];
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  trackingRef: string;
  setTrackingRef: (ref: string) => void;
  currentDriverId: string;
  setCurrentDriverId: (id: string) => void;
  selectedFormulaForBooking?: string;
  setSelectedFormulaForBooking: (formulaId: string | undefined) => void;
  createRequest: (
    data: Omit<MovingRequest, 'id' | 'createdAt' | 'status' | 'statusHistory'>
  ) => string;
  updateRequestStatus: (
    requestId: string,
    newStatus: MovingStatus,
    updatedBy: 'client' | 'admin' | 'chauffeur' | 'system',
    note?: string
  ) => void;
  assignDriver: (requestId: string, driverId: string) => void;
  setAppointment: (requestId: string, date: string, time: string, notes?: string) => void;
  acceptRequest: (requestId: string) => void;
  refuseRequest: (requestId: string, reason?: string) => void;
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (driverId: string, data: Partial<Driver>) => void;
  markNotificationRead: (id: string) => void;
  resetToDemoData: () => void;
}

const MovingContext = createContext<MovingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  REQUESTS: 'transmoov_requests_v1',
  DRIVERS: 'transmoov_drivers_v1',
  NOTIFICATIONS: 'transmoov_notifications_v1',
};

export const MovingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<MovingRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRIVERS);
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
    } catch {
      return INITIAL_DRIVERS;
    }
  });

  const [notifications, setNotifications] = useState<EmailNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activeView, setActiveView] = useState<AppView>('landing');
  const [trackingRef, setTrackingRef] = useState<string>('DEM-2026-00125');
  const [currentDriverId, setCurrentDriverId] = useState<string>('drv-2');
  const [selectedFormulaForBooking, setSelectedFormulaForBooking] = useState<string | undefined>(undefined);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Helper to create internal emails
  const sendEmail = (
    to: string,
    recipientType: 'client' | 'proprietaire' | 'chauffeur',
    subject: string,
    previewText: string,
    contentHtml: string,
    relatedRequestId: string
  ) => {
    const newMail: EmailNotification = {
      id: `mail-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      to,
      recipientType,
      subject,
      previewText,
      contentHtml,
      relatedRequestId,
      isRead: false,
    };
    setNotifications((prev) => [newMail, ...prev]);
  };

  // 1. Create a request
  const createRequest = (
    data: Omit<MovingRequest, 'id' | 'createdAt' | 'status' | 'statusHistory'>
  ): string => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `DEM-2026-${randomNum}`;
    const now = new Date().toISOString();

    const newRequest: MovingRequest = {
      ...data,
      id: newId,
      createdAt: now,
      status: 'demande_recue',
      statusHistory: [
        {
          status: 'demande_recue',
          timestamp: now,
          updatedBy: 'client',
          note: 'Demande créée en ligne par le client.',
        },
      ],
    };

    setRequests((prev) => [newRequest, ...prev]);

    // Send email to client
    sendEmail(
      data.client.email,
      'client',
      `TransMoov - Confirmation de votre demande ${newId}`,
      `Nous avons bien reçu votre demande de déménagement de ${data.departure.city} vers ${data.arrival.city}.`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <div style="background-color: #f97316; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 20px;">TransMoov Déménagements</h2>
            <p style="margin: 4px 0 0 0; font-size: 14px;">Confirmation de réception</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0;">
            <p>Bonjour <strong>${data.client.firstName} ${data.client.lastName}</strong>,</p>
            <p>Nous vous remercions pour votre confiance. Votre demande de déménagement a été enregistrée avec succès.</p>
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Numéro de dossier :</strong> ${newId}</p>
              <p style="margin: 0 0 8px 0;"><strong>Départ :</strong> ${data.departure.address}, ${data.departure.postalCode} ${data.departure.city}</p>
              <p style="margin: 0 0 8px 0;"><strong>Arrivée :</strong> ${data.arrival.address}, ${data.arrival.postalCode} ${data.arrival.city}</p>
              <p style="margin: 0;"><strong>Formule :</strong> ${data.formulaId.toUpperCase()}</p>
            </div>
            <p><strong>Prochaine étape :</strong> Notre équipe logistique examine votre dossier. Nous vous recontacterons au ${data.client.phone} très rapidement pour valider la planification.</p>
            <p>Vous pouvez suivre l'avancement à tout moment via votre lien sécurisé :</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="display: inline-block; background-color: #f97316; color: white; padding: 10px 20px; border-radius: 6px; font-weight: bold;">
                Suivi : /track/${newId}
              </span>
            </div>
          </div>
        </div>
      `,
      newId
    );

    // Send email to owner
    sendEmail(
      'direction@transmoov.fr',
      'proprietaire',
      `[Nouveau Devis] Demande reçue : ${data.client.firstName} ${data.client.lastName} (${newId})`,
      `Nouvelle demande reçue de ${data.departure.city} vers ${data.arrival.city}. Montant estimé : ${data.estimatedPrice} €.`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <div style="background-color: #0f172a; padding: 16px; color: white;">
            <h3 style="margin: 0;">Nouvelle demande dans le Dashboard TransMoov</h3>
          </div>
          <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e2e8f0;">
            <p>Un nouveau devis a été soumis :</p>
            <ul>
              <li><strong>Réf :</strong> ${newId}</li>
              <li><strong>Client :</strong> ${data.client.firstName} ${data.client.lastName} (${data.client.phone})</li>
              <li><strong>Email :</strong> ${data.client.email}</li>
              <li><strong>Départ :</strong> ${data.departure.address}, ${data.departure.city} (Étage ${data.departure.floor}, ${data.departure.hasElevator ? 'Avec ascenseur' : 'Sans ascenseur'})</li>
              <li><strong>Arrivée :</strong> ${data.arrival.address}, ${data.arrival.city} (Étage ${data.arrival.floor}, ${data.arrival.hasElevator ? 'Avec ascenseur' : 'Sans ascenseur'})</li>
              <li><strong>Date souhaitée :</strong> ${data.preferredDate}</li>
              <li><strong>Volume :</strong> ~${data.estimatedVolumeM3} m³</li>
              <li><strong>Estimation :</strong> ${data.estimatedPrice} €</li>
            </ul>
          </div>
        </div>
      `,
      newId
    );

    return newId;
  };

  // 2. Update status & dispatch notifications
  const updateRequestStatus = (
    requestId: string,
    newStatus: MovingStatus,
    updatedBy: 'client' | 'admin' | 'chauffeur' | 'system',
    note?: string
  ) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const now = new Date().toISOString();
        const updatedReq: MovingRequest = {
          ...req,
          status: newStatus,
          statusHistory: [
            ...req.statusHistory,
            {
              status: newStatus,
              timestamp: now,
              updatedBy,
              note: note || `Statut mis à jour vers "${STATUS_LABELS[newStatus]?.label || newStatus}"`,
            },
          ],
        };

        // Notify client and owner on important status changes
        const statusLabel = STATUS_LABELS[newStatus]?.label || newStatus;
        const driver = drivers.find((d) => d.id === req.assignedDriverId);

        // Notify Client
        sendEmail(
          req.client.email,
          'client',
          `TransMoov - ${statusLabel} (${req.id})`,
          `Votre déménagement a franchi une nouvelle étape : ${statusLabel}.`,
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
              <div style="background-color: #f97316; padding: 18px; text-align: center; color: white;">
                <h3 style="margin: 0;">TransMoov Déménagements</h3>
                <p style="margin: 4px 0 0 0; font-size: 13px;">Notification de statut en direct</p>
              </div>
              <div style="padding: 24px; background: #fff; border: 1px solid #e2e8f0;">
                <p>Bonjour <strong>${req.client.firstName}</strong>,</p>
                <p>Nous vous informons de l'avancement de votre mission :</p>
                <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 12px 16px; margin: 16px 0;">
                  <strong style="color: #9a3412; font-size: 16px;">${statusLabel}</strong>
                  ${note ? `<p style="margin: 6px 0 0 0; font-size: 14px; color: #431407;">${note}</p>` : ''}
                </div>
                ${
                  driver
                    ? `<p><strong>Votre chauffeur :</strong> ${driver.firstName} ${driver.lastName} (${driver.phone})</p>`
                    : ''
                }
                <p>Consultez la timeline complète de votre déménagement en temps réel sur votre espace de tracking :</p>
                <p style="font-family: monospace; background: #f1f5f9; padding: 8px; border-radius: 4px;">/track/${req.id}</p>
              </div>
            </div>
          `,
          req.id
        );

        // Notify Owner
        sendEmail(
          'direction@transmoov.fr',
          'proprietaire',
          `[Dashboard] Étape franchie : ${statusLabel} (${req.id})`,
          `La mission de ${req.client.firstName} ${req.client.lastName} est passée à l'état : ${statusLabel}.`,
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
              <div style="background-color: #0f172a; padding: 16px; color: white;">
                <h3 style="margin: 0;">Mise à jour d'activité TransMoov</h3>
              </div>
              <div style="padding: 20px; background: #fff; border: 1px solid #e2e8f0;">
                <p>Mission <strong>${req.id}</strong> mise à jour par <em>${updatedBy}</em> :</p>
                <p><strong>Nouveau statut :</strong> ${statusLabel}</p>
                ${note ? `<p><strong>Remarque :</strong> ${note}</p>` : ''}
              </div>
            </div>
          `,
          req.id
        );

        return updatedReq;
      })
    );
  };

  // 3. Assign Driver
  const assignDriver = (requestId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const now = new Date().toISOString();
        return {
          ...req,
          assignedDriverId: driverId,
          status: req.status === 'demande_recue' || req.status === 'demande_acceptee' ? 'chauffeur_assigne' : req.status,
          statusHistory: [
            ...req.statusHistory,
            {
              status: 'chauffeur_assigne',
              timestamp: now,
              updatedBy: 'admin',
              note: `Attribution de la mission au chauffeur ${driver.firstName} ${driver.lastName} (${driver.vehicleModel}).`,
            },
          ],
        };
      })
    );

    // Update driver active mission
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId ? { ...d, availability: 'en_mission', activeMissionRef: requestId } : d
      )
    );

    const targetReq = requests.find((r) => r.id === requestId);
    if (targetReq) {
      // Send mission assignment email to Driver
      sendEmail(
        driver.email,
        'chauffeur',
        `TransMoov Chauffeur - Nouvelle mission assignée (${requestId})`,
        `Vous êtes assigné au déménagement de ${targetReq.client.firstName} ${targetReq.client.lastName}.`,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 20px;">Nouvelle Mission Chauffeur</h2>
              <p style="margin: 4px 0 0 0; font-size: 14px;">Référence : ${requestId}</p>
            </div>
            <div style="padding: 24px; background: #fff; border: 1px solid #e2e8f0;">
              <p>Bonjour <strong>${driver.firstName}</strong>,</p>
              <p>Une nouvelle mission de déménagement vous a été attribuée par la direction :</p>
              <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0;"><strong>Client :</strong> ${targetReq.client.firstName} ${targetReq.client.lastName}</p>
                <p style="margin: 0 0 8px 0;"><strong>Téléphone :</strong> ${targetReq.client.phone}</p>
                <p style="margin: 0 0 8px 0;"><strong>Adresse départ :</strong> ${targetReq.departure.address}, ${targetReq.departure.city} (Étage ${targetReq.departure.floor}, ${targetReq.departure.hasElevator ? 'Ascenseur OUI' : 'Ascenseur NON'})</p>
                <p style="margin: 0 0 8px 0;"><strong>Adresse arrivée :</strong> ${targetReq.arrival.address}, ${targetReq.arrival.city} (Étage ${targetReq.arrival.floor}, ${targetReq.arrival.hasElevator ? 'Ascenseur OUI' : 'Ascenseur NON'})</p>
                <p style="margin: 0;"><strong>Date du rendez-vous :</strong> ${targetReq.appointment ? `${targetReq.appointment.date} à ${targetReq.appointment.time}` : targetReq.preferredDate}</p>
              </div>
              <p>Ouvrez votre interface mobile de mission pour mettre à jour les statuts en un clic :</p>
              <div style="text-align: center; margin: 24px 0;">
                <span style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Ouvrir l'Espace Chauffeur
                </span>
              </div>
            </div>
          </div>
        `,
        requestId
      );
    }
  };

  // 4. Set Appointment
  const setAppointment = (requestId: string, date: string, time: string, notes?: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const now = new Date().toISOString();
        return {
          ...req,
          appointment: { date, time, notes },
          status: req.status === 'demande_recue' || req.status === 'demande_acceptee' ? 'rdv_confirme' : req.status,
          statusHistory: [
            ...req.statusHistory,
            {
              status: 'rdv_confirme',
              timestamp: now,
              updatedBy: 'admin',
              note: `Rendez-vous planifié le ${date} à ${time}.${notes ? ` (${notes})` : ''}`,
            },
          ],
        };
      })
    );

    const targetReq = requests.find((r) => r.id === requestId);
    if (targetReq) {
      sendEmail(
        targetReq.client.email,
        'client',
        `TransMoov - Rendez-vous confirmé pour votre déménagement (${requestId})`,
        `Votre rendez-vous a été planifié le ${date} à ${time}.`,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <div style="background-color: #10b981; padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 20px;">Rendez-vous de Déménagement Confirmé</h2>
            </div>
            <div style="padding: 24px; background: #fff; border: 1px solid #e2e8f0;">
              <p>Bonjour <strong>${targetReq.client.firstName}</strong>,</p>
              <p>Votre rendez-vous est désormais confirmé dans notre calendrier logistique :</p>
              <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 14px; margin: 16px 0;">
                <p style="margin: 0 0 6px 0; font-size: 16px; font-weight: bold; color: #065f46;">Date : ${date} à ${time}</p>
                ${notes ? `<p style="margin: 0; font-size: 14px; color: #047857;">Instructions : ${notes}</p>` : ''}
              </div>
              <p>Notre équipe arrivera avec le matériel prévu dans votre formule.</p>
            </div>
          </div>
        `,
        requestId
      );
    }
  };

  // 5. Accept Request
  const acceptRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'demande_acceptee', 'admin', 'Demande validée par le responsable d’exploitation.');
  };

  // 6. Refuse Request
  const refuseRequest = (requestId: string, reason?: string) => {
    updateRequestStatus(requestId, 'demande_refusee', 'admin', reason || 'Dossier non réalisable aux dates souhaitées.');
  };

  // 7. Add Driver
  const addDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: `drv-${Date.now()}`,
    };
    setDrivers((prev) => [...prev, newDriver]);
  };

  // 8. Update Driver
  const updateDriver = (driverId: string, data: Partial<Driver>) => {
    setDrivers((prev) => prev.map((d) => (d.id === driverId ? { ...d, ...data } : d)));
  };

  // 9. Read notification
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  // 10. Reset demo data
  const resetToDemoData = () => {
    setRequests(INITIAL_REQUESTS);
    setDrivers(INITIAL_DRIVERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.DRIVERS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  };

  return (
    <MovingContext.Provider
      value={{
        requests,
        drivers,
        notifications,
        activeView,
        setActiveView,
        trackingRef,
        setTrackingRef,
        currentDriverId,
        setCurrentDriverId,
        selectedFormulaForBooking,
        setSelectedFormulaForBooking,
        createRequest,
        updateRequestStatus,
        assignDriver,
        setAppointment,
        acceptRequest,
        refuseRequest,
        addDriver,
        updateDriver,
        markNotificationRead,
        resetToDemoData,
      }}
    >
      {children}
    </MovingContext.Provider>
  );
};

export const useMoving = () => {
  const context = useContext(MovingContext);
  if (!context) {
    throw new Error('useMoving must be used within a MovingProvider');
  }
  return context;
};
