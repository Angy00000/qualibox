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

/** Catégories de l'accueil, dans l'ordre d'une démarche qualité. */
export const CATEGORIES = [
  { k: 'probleme', nom: 'Résoudre un problème', outils: [qqoqcp, pareto, ishikawa, cinqPourquoi, huitD, ficheNc] },
  { k: 'risques', nom: 'Risques, hygiène, sécurité et environnement', outils: [matriceRisques, amdec, haccp, planNettoyage, registreAccidents, aspectsEnv] },
  { k: 'audits', nom: 'Audits et normes', outils: [auditIso9001, auditHaccp, auditIso45001, auditIso14001] },
  { k: 'piloter', nom: 'Piloter et mesurer', outils: [planAction, pdca, indicateurs, carteControle, evalFournisseurs, matriceCompetences, revueDirection, swot] },
];

export const OUTILS = CATEGORIES.flatMap((c) => c.outils);

export const BIENTOT = [
  { id: 'audit-5s', nom: 'Audit 5S', ico: '🧹', court: 'Noter le rangement et la propreté d’un poste, avec photos avant / après.' },
  { id: 'satisfaction-client', nom: 'Enquête de satisfaction', ico: '😊', court: 'Construire le questionnaire et analyser les réponses de vos clients.' },
  { id: 'fiche-poste', nom: 'Fiche de poste', ico: '🪪', court: 'Décrire missions, responsabilités et compétences d’un poste.' },
  { id: 'etalonnage', nom: 'Suivi de l’étalonnage', ico: '⚖️', court: 'Lister vos instruments de mesure et leurs dates d’étalonnage.' },
];

export const outil = (id) => OUTILS.find((o) => o.id === id);
