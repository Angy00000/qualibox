import { cinqPourquoi } from './cinqPourquoi.jsx';
import { ishikawa } from './ishikawa.jsx';
import { qqoqcp } from './qqoqcp.jsx';
import { matriceRisques } from './matriceRisques.jsx';
import { pareto } from './pareto.jsx';
import { pdca } from './pdca.jsx';
import { huitD } from './huitD.jsx';
import { amdec } from './amdec.jsx';

/** Outils disponibles, dans l'ordre logique d'une démarche : décrire, prioriser, chercher les causes, traiter, prévenir, améliorer. */
export const OUTILS = [qqoqcp, pareto, ishikawa, cinqPourquoi, huitD, matriceRisques, amdec, pdca];

export const BIENTOT = [
  { id: 'plan-action', nom: 'Plan d’action', ico: '📋', court: 'Qui fait quoi, pour quand, avec le suivi de l’avancement.' },
  { id: 'audit-iso-9001', nom: 'Check-list d’audit ISO 9001', ico: '✅', court: 'Préparer et mener un audit interne, chapitre par chapitre.' },
  { id: 'haccp', nom: 'Analyse HACCP', ico: '🍽️', court: 'Construire un plan HACCP pas à pas, avec les 7 principes.' },
  { id: 'swot', nom: 'SWOT', ico: '🧩', court: 'Analyser forces, faiblesses, opportunités et menaces.' },
];

export const outil = (id) => OUTILS.find((o) => o.id === id);
