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

/** Outils disponibles, dans l'ordre logique d'une démarche : décrire, prioriser, chercher les causes, traiter, prévenir, piloter. */
export const OUTILS = [qqoqcp, pareto, ishikawa, cinqPourquoi, huitD, matriceRisques, amdec, haccp, auditIso9001, planAction, pdca, swot];

export const BIENTOT = [
  { id: 'audit-haccp', nom: 'Check-list HACCP / ISO 22000', ico: '🥫', court: 'Auditer une unité agroalimentaire : hygiène, PRP, plan HACCP.' },
  { id: 'audit-iso-45001', nom: 'Check-list ISO 45001', ico: '🦺', court: 'Auditer la santé et la sécurité au travail.' },
  { id: 'carte-controle', nom: 'Carte de contrôle', ico: '📈', court: 'Surveiller un procédé dans le temps et repérer les dérives.' },
  { id: 'indicateurs', nom: 'Calculateurs d’indicateurs', ico: '🧮', court: 'Taux de non-conformité, TRS, taux de fréquence des accidents.' },
];

export const outil = (id) => OUTILS.find((o) => o.id === id);
