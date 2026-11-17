import { cinqPourquoi } from './cinqPourquoi.jsx';
import { ishikawa } from './ishikawa.jsx';
import { qqoqcp } from './qqoqcp.jsx';
import { matriceRisques } from './matriceRisques.jsx';
import { pareto } from './pareto.jsx';
import { pdca } from './pdca.jsx';
import { huitD } from './huitD.jsx';
import { amdec } from './amdec.jsx';
import { planAction } from './planAction.jsx';
import { auditIso9001 } from './auditIso9001.jsx';
import { haccp } from './haccp.jsx';
import { swot } from './swot.jsx';
import { auditHaccp } from './auditHaccp.jsx';
import { auditIso45001 } from './auditIso45001.jsx';
import { carteControle } from './carteControle.jsx';
import { indicateurs } from './indicateurs.jsx';
import { auditIso14001 } from './auditIso14001.jsx';
import { aspectsEnv } from './aspectsEnv.jsx';
import { ficheNc } from './ficheNc.jsx';
import { revueDirection } from './revueDirection.jsx';
import { evalFournisseurs } from './evalFournisseurs.jsx';
import { planNettoyage } from './planNettoyage.jsx';
import { matriceCompetences } from './matriceCompetences.jsx';
import { registreAccidents } from './registreAccidents.jsx';
import { audit5s } from './audit5s.jsx';
import { satisfactionClient } from './satisfactionClient.jsx';
import { fichePoste } from './fichePoste.jsx';
import { etalonnage } from './etalonnage.jsx';
import { reclamations } from './reclamations.jsx';
import { cartographie } from './cartographie.jsx';
import { documentUnique } from './documentUnique.jsx';
import { programmeAudits } from './programmeAudits.jsx';
import { ficheProcessus } from './ficheProcessus.jsx';
import { politiqueQualite } from './politiqueQualite.jsx';
import { modeOperatoire } from './modeOperatoire.jsx';
import { veilleReglementaire } from './veilleReglementaire.jsx';
import { planFormation } from './planFormation.jsx';
import { controleReception } from './controleReception.jsx';
import { planUrgence } from './planUrgence.jsx';
import { tracabilite } from './tracabilite.jsx';

/** Catégories de l'accueil, dans l'ordre d'une démarche qualité. */
export const CATEGORIES = [
  { k: 'probleme', nom: 'Résoudre un problème', outils: [qqoqcp, pareto, ishikawa, cinqPourquoi, huitD, ficheNc, reclamations] },
  { k: 'risques', nom: 'Risques, santé-sécurité et environnement', outils: [matriceRisques, amdec, documentUnique, registreAccidents, planUrgence, aspectsEnv] },
  { k: 'aliments', nom: 'Hygiène et sécurité des aliments', outils: [haccp, planNettoyage, controleReception, tracabilite] },
  { k: 'audits', nom: 'Audits et normes', outils: [auditIso9001, auditHaccp, auditIso45001, auditIso14001, audit5s, programmeAudits] },
  { k: 'piloter', nom: 'Piloter et mesurer', outils: [planAction, pdca, indicateurs, carteControle, satisfactionClient, revueDirection, swot] },
  { k: 'systeme', nom: 'Système qualité et documents', outils: [politiqueQualite, cartographie, ficheProcessus, modeOperatoire, veilleReglementaire] },
  { k: 'ressources', nom: 'Personnel, fournisseurs et équipements', outils: [fichePoste, matriceCompetences, planFormation, evalFournisseurs, etalonnage] },
];

export const OUTILS = CATEGORIES.flatMap((c) => c.outils);

export const BIENTOT = [
  { id: 'releve-temperatures', nom: 'Relevé de températures', ico: '🌡️', court: 'Suivre les températures des frigos et chambres froides, avec alertes.' },
  { id: 'nuisibles', nom: 'Lutte contre les nuisibles', ico: '🐀', court: 'Plan des pièges, passages du prestataire et constats.' },
  { id: 'capabilite', nom: 'Capabilité (Cp, Cpk)', ico: '📐', court: 'Savoir si un procédé tient les tolérances, à partir de mesures.' },
  { id: 'dechets', nom: 'Registre des déchets', ico: '♻️', court: 'Suivre les déchets produits, triés et enlevés, par filière.' },
];

export const outil = (id) => OUTILS.find((o) => o.id === id);
