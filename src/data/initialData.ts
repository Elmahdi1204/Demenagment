import { Driver, EmailNotification, MovingRequest } from '../types/moving';

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv-1',
    firstName: 'Mohamed',
    lastName: 'Amine',
    phone: '06 12 34 56 78',
    email: 'mohamed.amine@transmoov.fr',
    vehicleModel: 'Renault Master Grand Volume',
    vehiclePlate: 'AB-492-CD',
    vehicleType: 'Fourgon 20m³ avec hayon élévateur',
    vehicleCapacityM3: 20,
    availability: 'disponible',
    activeMissionRef: 'DEM-2026-00124',
  },
  {
    id: 'drv-2',
    firstName: 'Karim',
    lastName: 'Benali',
    phone: '06 98 76 54 32',
    email: 'karim.benali@transmoov.fr',
    vehicleModel: 'Mercedes-Benz Sprinter 314',
    vehiclePlate: 'EF-781-GH',
    vehicleType: 'Fourgon Moyen 14m³ capitonné',
    vehicleCapacityM3: 14,
    availability: 'en_mission',
    activeMissionRef: 'DEM-2026-00125',
  },
  {
    id: 'drv-3',
    firstName: 'Lucas',
    lastName: 'Mercier',
    phone: '07 45 89 12 03',
    email: 'lucas.mercier@transmoov.fr',
    vehicleModel: 'Iveco Daily Caisson 22m³',
    vehiclePlate: 'JK-334-LM',
    vehicleType: 'Poids-lourd léger 22m³',
    vehicleCapacityM3: 22,
    availability: 'disponible',
  },
];

export const INITIAL_REQUESTS: MovingRequest[] = [
  {
    id: 'DEM-2026-00125',
    createdAt: '2026-09-25T14:30:00Z',
    client: {
      firstName: 'Sophie',
      lastName: 'Dubois',
      phone: '06 44 22 11 88',
      email: 'sophie.dubois@email.fr',
    },
    departure: {
      address: '14 Rue de la Liberté',
      city: 'Rennes',
      postalCode: '35000',
      housingType: 'Appartement',
      floor: 3,
      hasElevator: false,
      details: 'Escalier étroit, stationnement réservé auprès de la mairie.',
    },
    arrival: {
      address: '8 Allée des Chênes',
      city: 'Nantes',
      postalCode: '44000',
      housingType: 'Maison',
      floor: 0,
      hasElevator: true,
      details: 'Allée goudronnée, accès facile camion devant le garage.',
    },
    formulaId: 'classique',
    estimatedVolumeM3: 18,
    preferredDate: '2026-09-26',
    appointment: {
      date: '2026-09-26',
      time: '08:30',
      notes: 'Début chargement à 8h30 précises avec 2 déménageurs.',
    },
    status: 'chargement_en_cours',
    assignedDriverId: 'drv-2',
    estimatedPrice: 980,
    statusHistory: [
      {
        status: 'demande_recue',
        timestamp: '2026-09-25T14:30:00Z',
        updatedBy: 'client',
        note: 'Demande créée en ligne via la formule Classique.',
      },
      {
        status: 'demande_acceptee',
        timestamp: '2026-09-25T15:10:00Z',
        updatedBy: 'admin',
        note: 'Validation du dossier par le responsable logistique.',
      },
      {
        status: 'rdv_confirme',
        timestamp: '2026-09-25T15:45:00Z',
        updatedBy: 'admin',
        note: 'Rendez-vous fixé pour le 26/09/2026 à 08h30.',
      },
      {
        status: 'chauffeur_assigne',
        timestamp: '2026-09-25T16:00:00Z',
        updatedBy: 'admin',
        note: 'Mission attribuée à Karim Benali (Mercedes Sprinter 14m³).',
      },
      {
        status: 'chauffeur_en_route',
        timestamp: '2026-09-26T07:45:00Z',
        updatedBy: 'chauffeur',
        note: 'Chauffeur parti du dépôt vers Rennes.',
      },
      {
        status: 'chauffeur_arrive',
        timestamp: '2026-09-26T08:25:00Z',
        updatedBy: 'chauffeur',
        note: 'Arrivé au 14 Rue de la Liberté. Camion stationné.',
      },
      {
        status: 'chargement_en_cours',
        timestamp: '2026-09-26T08:40:00Z',
        updatedBy: 'chauffeur',
        note: 'Protection du mobilier sous couvertures et chargement des cartons.',
      },
    ],
  },
  {
    id: 'DEM-2026-00126',
    createdAt: '2026-09-26T08:15:00Z',
    client: {
      firstName: 'Alexandre',
      lastName: 'Martin',
      phone: '06 55 99 88 77',
      email: 'alexandre.martin@example.com',
    },
    departure: {
      address: '45 Avenue Jean Jaurès',
      city: 'Lyon',
      postalCode: '69007',
      housingType: 'Appartement',
      floor: 4,
      hasElevator: true,
      details: 'Ascenseur large 6 personnes, monte-charge accessible.',
    },
    arrival: {
      address: '12 Impasse du Verger',
      city: 'Annecy',
      postalCode: '74000',
      housingType: 'Maison',
      floor: 1,
      hasElevator: false,
      details: 'Maison individuelle avec cour fermée.',
    },
    formulaId: 'major',
    estimatedVolumeM3: 25,
    preferredDate: '2026-10-05',
    status: 'demande_recue',
    estimatedPrice: 1350,
    statusHistory: [
      {
        status: 'demande_recue',
        timestamp: '2026-09-26T08:15:00Z',
        updatedBy: 'client',
        note: 'Nouvelle demande en attente d’étude.',
      },
    ],
  },
  {
    id: 'DEM-2026-00124',
    createdAt: '2026-09-24T10:00:00Z',
    client: {
      firstName: 'Camille',
      lastName: 'Lefevre',
      phone: '06 11 77 44 22',
      email: 'camille.lefevre@outlook.fr',
    },
    departure: {
      address: '22 Boulevard Victor Hugo',
      city: 'Bordeaux',
      postalCode: '33000',
      housingType: 'Appartement',
      floor: 2,
      hasElevator: true,
      details: 'Zone piétonne avec autorisation matinale de livraison.',
    },
    arrival: {
      address: '5 Rue des Lilas',
      city: 'Arcachon',
      postalCode: '33120',
      housingType: 'Maison',
      floor: 0,
      hasElevator: false,
      details: 'Plain-pied.',
    },
    formulaId: 'privilege',
    estimatedVolumeM3: 32,
    preferredDate: '2026-09-27',
    appointment: {
      date: '2026-09-27',
      time: '09:00',
      notes: 'Prestation complète avec emballage total de la vaisselle.',
    },
    status: 'chauffeur_assigne',
    assignedDriverId: 'drv-1',
    estimatedPrice: 3200,
    statusHistory: [
      {
        status: 'demande_recue',
        timestamp: '2026-09-24T10:00:00Z',
        updatedBy: 'client',
      },
      {
        status: 'demande_acceptee',
        timestamp: '2026-09-24T11:30:00Z',
        updatedBy: 'admin',
      },
      {
        status: 'rdv_confirme',
        timestamp: '2026-09-24T14:00:00Z',
        updatedBy: 'admin',
      },
      {
        status: 'chauffeur_assigne',
        timestamp: '2026-09-24T16:30:00Z',
        updatedBy: 'admin',
      },
    ],
  },
  {
    id: 'DEM-2026-00123',
    createdAt: '2026-09-20T09:00:00Z',
    client: {
      firstName: 'Thomas',
      lastName: 'Moreau',
      phone: '06 88 12 43 90',
      email: 'thomas.moreau@wanadoo.fr',
    },
    departure: {
      address: '3 Place Bellecour',
      city: 'Lyon',
      postalCode: '69002',
      housingType: 'Appartement',
      floor: 1,
      hasElevator: true,
    },
    arrival: {
      address: '77 Rue Garibaldi',
      city: 'Lyon',
      postalCode: '69006',
      housingType: 'Appartement',
      floor: 4,
      hasElevator: true,
    },
    formulaId: 'economique',
    estimatedVolumeM3: 12,
    preferredDate: '2026-09-23',
    appointment: {
      date: '2026-09-23',
      time: '14:00',
    },
    status: 'demenagement_termine',
    assignedDriverId: 'drv-3',
    estimatedPrice: 700,
    statusHistory: [
      { status: 'demande_recue', timestamp: '2026-09-20T09:00:00Z', updatedBy: 'client' },
      { status: 'demande_acceptee', timestamp: '2026-09-20T10:30:00Z', updatedBy: 'admin' },
      { status: 'rdv_confirme', timestamp: '2026-09-20T11:00:00Z', updatedBy: 'admin' },
      { status: 'chauffeur_assigne', timestamp: '2026-09-21T09:00:00Z', updatedBy: 'admin' },
      { status: 'chauffeur_en_route', timestamp: '2026-09-23T13:30:00Z', updatedBy: 'chauffeur' },
      { status: 'chauffeur_arrive', timestamp: '2026-09-23T13:55:00Z', updatedBy: 'chauffeur' },
      { status: 'chargement_en_cours', timestamp: '2026-09-23T14:10:00Z', updatedBy: 'chauffeur' },
      { status: 'chargement_termine', timestamp: '2026-09-23T15:45:00Z', updatedBy: 'chauffeur' },
      { status: 'en_route_destination', timestamp: '2026-09-23T15:55:00Z', updatedBy: 'chauffeur' },
      { status: 'arrive_destination', timestamp: '2026-09-23T16:20:00Z', updatedBy: 'chauffeur' },
      { status: 'dechargement_en_cours', timestamp: '2026-09-23T16:30:00Z', updatedBy: 'chauffeur' },
      { status: 'demenagement_termine', timestamp: '2026-09-23T17:40:00Z', updatedBy: 'chauffeur', note: 'Mission achevée sans encombre. Client satisfait.' },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: EmailNotification[] = [
  {
    id: 'mail-1',
    timestamp: '2026-09-26T08:40:00Z',
    to: 'sophie.dubois@email.fr',
    recipientType: 'client',
    subject: 'TransMoov - Chargement en cours pour votre déménagement (DEM-2026-00125)',
    previewText: 'Notre chauffeur Karim Benali a commencé le chargement de votre mobilier.',
    relatedRequestId: 'DEM-2026-00125',
    isRead: false,
    contentHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <div style="background-color: #f97316; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 22px;">TransMoov Déménagements</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Mise à jour de votre mission</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0;">
          <p>Bonjour <strong>Sophie Dubois</strong>,</p>
          <p>Nous vous informons que notre équipe a commencé le <strong>chargement de vos biens</strong> au 14 Rue de la Liberté, 35000 Rennes.</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Référence de dossier :</strong> DEM-2026-00125</p>
            <p style="margin: 0 0 8px 0;"><strong>Chauffeur assigné :</strong> Karim Benali (06 98 76 54 32)</p>
            <p style="margin: 0;"><strong>Statut actuel :</strong> Chargement en cours</p>
          </div>
          <p>Vous pouvez suivre chaque étape de votre déménagement en temps réel sur votre espace dédié :</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="#track-DEM-2026-00125" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Suivre mon déménagement en direct</a>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'mail-2',
    timestamp: '2026-09-26T08:25:00Z',
    to: 'direction@transmoov.fr',
    recipientType: 'proprietaire',
    subject: '[Dashboard] Statut mis à jour : Chauffeur arrivé au point de départ (DEM-2026-00125)',
    previewText: 'Le chauffeur Karim Benali est arrivé à Rennes pour la mission de Sophie Dubois.',
    relatedRequestId: 'DEM-2026-00125',
    isRead: false,
    contentHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <div style="background-color: #0f172a; padding: 20px; color: white;">
          <h3 style="margin: 0;">Alerte Dashboard TransMoov</h3>
        </div>
        <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e2e8f0;">
          <p>Le statut de la mission <strong>DEM-2026-00125</strong> a changé :</p>
          <p><strong>Nouveau statut :</strong> Chauffeur arrivé au point de départ</p>
          <p><strong>Chauffeur :</strong> Karim Benali</p>
          <p><strong>Client :</strong> Sophie Dubois (06 44 22 11 88)</p>
          <p><strong>Adresse départ :</strong> 14 Rue de la Liberté, Rennes</p>
        </div>
      </div>
    `,
  },
  {
    id: 'mail-3',
    timestamp: '2026-09-26T08:15:00Z',
    to: 'direction@transmoov.fr',
    recipientType: 'proprietaire',
    subject: '[Nouveau Devis] Demande reçue : Alexandre Martin (DEM-2026-00126)',
    previewText: 'Nouvelle demande de déménagement Lyon -> Annecy (Formule Major).',
    relatedRequestId: 'DEM-2026-00126',
    isRead: false,
    contentHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <div style="background-color: #2563eb; padding: 20px; color: white;">
          <h3 style="margin: 0;">Nouvelle demande de déménagement</h3>
        </div>
        <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e2e8f0;">
          <p>Une nouvelle demande vient d'être enregistrée sur la plateforme :</p>
          <ul>
            <li><strong>Référence :</strong> DEM-2026-00126</li>
            <li><strong>Client :</strong> Alexandre Martin (06 55 99 88 77)</li>
            <li><strong>Trajet :</strong> Lyon (69007) ➔ Annecy (74000)</li>
            <li><strong>Formule :</strong> Major (Estimée à 1 350 €)</li>
            <li><strong>Date souhaitée :</strong> 05/10/2026</li>
          </ul>
        </div>
      </div>
    `,
  },
];
