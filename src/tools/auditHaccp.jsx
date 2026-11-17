import { creerChecklist, ficheChecklist } from './checklist.jsx';

/** Audit d'hygiène et de sécurité des aliments : PRP (bonnes pratiques), plan HACCP, système ISO 22000:2018. */
const CHAPITRES = [
  ['A', 'Programmes prérequis (bonnes pratiques d’hygiène)', [
    ['A1', 'Les locaux sont-ils propres, en bon état et organisés en marche en avant (pas de croisement propre / sale) ?'],
    ['A2', 'L’eau utilisée est-elle potable et contrôlée par des analyses régulières ?'],
    ['A3', 'Un plan de nettoyage et désinfection existe-t-il, est-il appliqué et enregistré ?'],
    ['A4', 'La lutte contre les nuisibles (rongeurs, insectes, oiseaux) est-elle organisée et suivie ?'],
    ['A5', 'Le personnel porte-t-il une tenue propre, coiffe comprise, et se lave-t-il les mains aux bons moments ?'],
    ['A6', 'Le personnel est-il formé à l’hygiène, avec une aptitude médicale à jour ?'],
    ['A7', 'Les déchets sont-ils évacués régulièrement et stockés à l’écart des aliments ?'],
    ['A8', 'Les matières premières et les fournisseurs sont-ils contrôlés à la réception ?'],
    ['A9', 'Le stockage est-il maîtrisé (températures, premier périmé premier sorti, séparation cru / cuit) ?'],
    ['A10', 'Les allergènes sont-ils identifiés, séparés et indiqués sur l’étiquetage ?'],
  ]],
  ['B', 'Plan HACCP', [
    ['B1', 'Une équipe HACCP pluridisciplinaire et formée est-elle constituée ?'],
    ['B2', 'Les produits et leur utilisation prévue sont-ils décrits ?'],
    ['B3', 'Les diagrammes de fabrication sont-ils établis et vérifiés sur place ?'],
    ['B4', 'L’analyse des dangers (biologiques, chimiques, physiques, allergènes) est-elle faite pour chaque étape ?'],
    ['B5', 'Les CCP et PRPo sont-ils déterminés, avec des limites critiques justifiées ?'],
    ['B6', 'La surveillance des CCP est-elle réalisée et enregistrée à la fréquence prévue ?'],
    ['B7', 'Des actions correctives sont-elles définies et appliquées en cas de dépassement ?'],
    ['B8', 'Les thermomètres et autres équipements de mesure sont-ils étalonnés ?'],
  ]],
  ['C', 'Système de management (ISO 22000)', [
    ['C1', 'Une politique de sécurité des aliments est-elle établie et communiquée ?'],
    ['C2', 'La traçabilité amont et aval est-elle en place et testée ?'],
    ['C3', 'Une procédure de retrait et de rappel des produits existe-t-elle et a-t-elle été testée ?'],
    ['C4', 'Les situations d’urgence (coupure d’électricité, panne de froid, inondation) sont-elles prévues ?'],
    ['C5', 'La vérification est-elle faite (analyses de laboratoire, audits internes) ?'],
    ['C6', 'La revue de direction et la mise à jour du système sont-elles réalisées ?'],
  ]],
];

export const auditHaccp = creerChecklist({
  id: 'audit-haccp',
  nom: 'Check-list HACCP / ISO 22000',
  ico: '🥫',
  court: 'Auditer une unité agroalimentaire : bonnes pratiques d’hygiène, plan HACCP, système ISO 22000.',
  fiche: ficheChecklist(<>Cette check-list couvre les <b>bonnes pratiques d’hygiène</b> (programmes prérequis), le <b>plan HACCP</b> (Codex Alimentarius) et les exigences clés de l’<b>ISO 22000:2018</b>.</>),
  chapitres: CHAPITRES,
  prefixe: '',
  exemple: {
    meta: {
      titre: 'Audit hygiène et HACCP — unité de jus', reference: 'AUD-HACCP-2026-03', redacteur: 'Awa Ndiaye (auditrice)', service: 'Qualité — Unité de transformation, Thiès',
      perimetre: 'Atelier de production de jus de bissap et de bouye, stockage et expédition.',
      audites: 'Présidente du GIE, responsable production, magasinière, 3 opératrices.',
      conclusion: 'Bonnes pratiques globalement respectées et équipe motivée. Points prioritaires : surveillance du CCP pasteurisation, plan de lutte contre les nuisibles, test de rappel des produits.',
    },
    reponses: (m) => {
      m('A1', 'OBS', 'Zone de lavage des bouteilles proche de la zone de remplissage.');
      m('A2', 'C', 'Eau du réseau, analyse de juin 2026.');
      m('A4', 'NC', 'Aucun plan de lutte contre les nuisibles ; traces de rongeurs au magasin.');
      m('A6', 'OBS', '2 opératrices sur 8 sans formation hygiène enregistrée.');
      m('B6', 'NC', 'Températures de pasteurisation non enregistrées depuis 3 semaines.');
      m('B8', 'NC', 'Thermomètre jamais étalonné.');
      m('C3', 'NC', 'Pas de procédure de rappel, jamais testée.');
      m('C4', 'OBS', 'Coupures d’électricité fréquentes, pas de plan écrit.');
    },
  },
});
