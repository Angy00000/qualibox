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

/** Catégories de l'accueil, dans l'ordre d'une démarche qualité. */
export const CATEGORIES = [
  { k: 'probleme', nom: 'Résoudre un problème', outils: [qqoqcp, pareto, ishikawa, cinqPourquoi, huitD] },
  { k: 'risques', nom: 'Risques et sécurité des aliments', outils: [matriceRisques, amdec, haccp] },
  { k: 'audits', nom: 'Audits et normes', outils: [auditIso9001, auditHaccp, auditIso45001] },
  { k: 'piloter', nom: 'Piloter et mesurer', outils: [planAction, pdca, indicateurs, carteControle, swot] },
];

export const OUTILS = CATEGORIES.flatMap((c) => c.outils);

export const BIENTOT = [
  { id: 'audit-iso-14001', nom: 'Check-list ISO 14001', ico: '🌱', court: 'Auditer le management environnemental.' },
  { id: 'aspects-env', nom: 'Aspects et impacts environnementaux', ico: '🌍', court: 'Identifier et coter les impacts de vos activités sur l’environnement.' },
  { id: 'fiche-nc', nom: 'Fiche de non-conformité', ico: '🧾', court: 'Enregistrer, traiter et clôturer une non-conformité.' },
  { id: 'revue-direction', nom: 'Revue de direction', ico: '🏛️', court: 'Préparer et tracer la revue de direction ISO 9001.' },
];

export const outil = (id) => OUTILS.find((o) => o.id === id);
