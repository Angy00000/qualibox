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

/** Catégories de l'accueil, dans l'ordre d'une démarche qualité. */
export const CATEGORIES = [
  { k: 'probleme', nom: 'Résoudre un problème', outils: [qqoqcp, pareto, ishikawa, cinqPourquoi, huitD, ficheNc] },
  { k: 'risques', nom: 'Risques, hygiène, sécurité et environnement', outils: [matriceRisques, amdec, haccp, planNettoyage, registreAccidents, aspectsEnv] },
  { k: 'audits', nom: 'Audits et normes', outils: [auditIso9001, auditHaccp, auditIso45001, auditIso14001, audit5s] },
  { k: 'piloter', nom: 'Piloter et mesurer', outils: [planAction, pdca, indicateurs, carteControle, satisfactionClient, revueDirection, swot] },
  { k: 'ressources', nom: 'Personnel, fournisseurs et équipements', outils: [fichePoste, matriceCompetences, evalFournisseurs, etalonnage] },
];

export const OUTILS = CATEGORIES.flatMap((c) => c.outils);

export const BIENTOT = [
  { id: 'reclamations', nom: 'Traitement des réclamations', ico: '📣', court: 'Enregistrer et suivre les réclamations clients jusqu’à la réponse.' },
  { id: 'cartographie', nom: 'Cartographie des processus', ico: '🗺️', court: 'Dessiner vos processus de pilotage, de réalisation et de support.' },
  { id: 'document-unique', nom: 'Évaluation des risques professionnels', ico: '🦺', court: 'Le document unique : dangers, risques et mesures par unité de travail.' },
  { id: 'programme-audits', nom: 'Programme d’audits', ico: '📅', court: 'Planifier les audits internes de l’année, processus par processus.' },
];

export const outil = (id) => OUTILS.find((o) => o.id === id);
