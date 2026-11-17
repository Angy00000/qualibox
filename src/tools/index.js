import { cinqPourquoi } from './cinqPourquoi.jsx';
import { ishikawa } from './ishikawa.jsx';
import { qqoqcp } from './qqoqcp.jsx';
import { matriceRisques } from './matriceRisques.jsx';

/** Outils disponibles, dans l'ordre logique d'une analyse : décrire, chercher les causes, remonter à la racine, évaluer. */
export const OUTILS = [qqoqcp, ishikawa, cinqPourquoi, matriceRisques];

export const BIENTOT = [
  { id: 'pareto', nom: 'Diagramme de Pareto', ico: '📊', court: 'Trouver les 20 % de causes qui font 80 % des problèmes.' },
  { id: 'pdca', nom: 'PDCA', ico: '🔄', court: 'Piloter une amélioration : planifier, faire, vérifier, agir.' },
  { id: '8d', nom: 'Méthode 8D', ico: '🛠️', court: 'Traiter une réclamation client ou une non-conformité grave.' },
  { id: 'amdec', nom: 'AMDEC', ico: '🔍', court: 'Anticiper les défaillances d’un produit ou d’un procédé.' },
];

export const outil = (id) => OUTILS.find((o) => o.id === id);
