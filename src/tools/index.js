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

/** Catégories de l'accueil, dans l'ordre d'une démarche qualité. */
export const CATEGORIES = [
  { k: 'probleme', nom: 'Résoudre un problème', outils: [qqoqcp, pareto, ishikawa, cinqPourquoi, huitD, ficheNc] },
  { k: 'risques', nom: 'Risques, aliments et environnement', outils: [matriceRisques, amdec, haccp, aspectsEnv] },
  { k: 'audits', nom: 'Audits et normes', outils: [auditIso9001, auditHaccp, auditIso45001, auditIso14001] },
  { k: 'piloter', nom: 'Piloter et mesurer', outils: [planAction, pdca, indicateurs, carteControle, revueDirection, swot] },
];

export const OUTILS = CATEGORIES.flatMap((c) => c.outils);

export const BIENTOT = [
  { id: 'eval-fournisseurs', nom: 'Évaluation des fournisseurs', ico: '🚚', court: 'Noter vos fournisseurs sur la qualité, les délais et le prix.' },
  { id: 'plan-nettoyage', nom: 'Plan de nettoyage', ico: '🧽', court: 'Organiser et tracer le nettoyage et la désinfection.' },
  { id: 'matrice-competences', nom: 'Matrice des compétences', ico: '🎓', court: 'Voir qui sait faire quoi et planifier les formations.' },
  { id: 'registre-accidents', nom: 'Registre des accidents', ico: '🩹', court: 'Enregistrer les accidents et presque-accidents du travail.' },
];

export const outil = (id) => OUTILS.find((o) => o.id === id);
