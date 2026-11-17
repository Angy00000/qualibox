import { creerChecklist, ficheChecklist } from './checklist.jsx';

/** Questions d'audit environnemental, par chapitre de l'ISO 14001:2015. */
const CHAPITRES = [
  ['4', 'Contexte de l’organisme', [
    ['4.1', 'Les enjeux internes et externes liés à l’environnement (climat, eau, déchets, voisinage) sont-ils identifiés ?'],
    ['4.2', 'Les parties intéressées (riverains, autorités, clients) et leurs attentes sont-elles identifiées ?'],
    ['4.3', 'Le domaine d’application du système environnemental est-il défini et documenté ?'],
  ]],
  ['5', 'Leadership', [
    ['5.1', 'La direction s’implique-t-elle dans la démarche environnementale (moyens, suivi, exemplarité) ?'],
    ['5.2', 'Une politique environnementale (prévention de la pollution, respect des obligations) est-elle établie et communiquée ?'],
    ['5.3', 'Les rôles et responsabilités en environnement sont-ils attribués ?'],
  ]],
  ['6', 'Planification', [
    ['6.1.2', 'Les aspects environnementaux de chaque activité sont-ils identifiés, et les aspects significatifs déterminés ?'],
    ['6.1.3', 'Les obligations de conformité (réglementation environnementale, autorisations, normes de rejets) sont-elles identifiées ?'],
    ['6.1.4', 'Des actions sont-elles planifiées pour les aspects significatifs, les obligations et les risques ?'],
    ['6.2', 'Des objectifs environnementaux mesurables sont-ils fixés et suivis (eau, énergie, déchets) ?'],
  ]],
  ['7', 'Support', [
    ['7.2', 'Le personnel dont le travail a un impact sur l’environnement est-il compétent et formé ?'],
    ['7.3', 'Le personnel connaît-il la politique et les aspects significatifs de son poste ?'],
    ['7.4', 'La communication interne et externe sur l’environnement est-elle organisée ?'],
    ['7.5', 'Les documents et enregistrements environnementaux sont-ils maîtrisés ?'],
  ]],
  ['8', 'Réalisation des activités opérationnelles', [
    ['8.1', 'Les activités à impact sont-elles maîtrisées (tri des déchets, eaux usées, produits chimiques sur rétention) ?'],
    ['8.1b', 'Les prestataires (collecte des déchets, transport, sous-traitants) sont-ils choisis et suivis selon des critères environnementaux ?'],
    ['8.2', 'Les situations d’urgence (déversement, incendie, fuite) sont-elles préparées et testées ?'],
  ]],
  ['9', 'Évaluation des performances', [
    ['9.1.1', 'Les consommations (eau, énergie) et les rejets sont-ils mesurés et suivis ?'],
    ['9.1.2', 'La conformité aux obligations est-elle évaluée périodiquement ?'],
    ['9.2', 'Des audits internes environnementaux sont-ils réalisés ?'],
    ['9.3', 'La revue de direction traite-t-elle de l’environnement ?'],
  ]],
  ['10', 'Amélioration', [
    ['10.2', 'Les incidents et non-conformités environnementales donnent-ils lieu à des actions correctives ?'],
    ['10.3', 'La performance environnementale s’améliore-t-elle (indicateurs en progrès) ?'],
  ]],
];

export const auditIso14001 = creerChecklist({
  id: 'audit-iso-14001',
  nom: 'Check-list ISO 14001',
  ico: '🌱',
  court: 'Auditer le management environnemental, chapitre par chapitre, avec score et écarts.',
  fiche: ficheChecklist(<>Cette check-list suit les chapitres 4 à 10 de l’<b>ISO 14001:2015</b> (management environnemental).</>),
  chapitres: CHAPITRES,
  exemple: {
    meta: {
      titre: 'Audit environnemental — usine de transformation de poisson', reference: 'AUD-ENV-2026-01', redacteur: 'Lamine Seck (auditeur)', service: 'QHSE — Usine de Mbour',
      perimetre: 'Réception du poisson, découpe, congélation, stockage, station de traitement des eaux usées, groupe électrogène.',
      audites: 'Directeur d’usine, responsable QHSE, chef de production, responsable maintenance, agent de la station d’épuration.',
      conclusion: 'Démarche lancée avec une bonne connaissance des aspects. Priorités : traitement des eaux usées, suivi des consommations d’eau, rétention des cuves de gasoil et exercice en cas de déversement.',
    },
    reponses: (m) => {
      m('6.1.3', 'OBS', 'Liste des obligations faite, mais autorisation de rejet non renouvelée depuis 2024.');
      m('8.1', 'NC', 'Eaux de lavage rejetées sans prétraitement quand la station est en panne.');
      m('8.2', 'NC', 'Cuve de gasoil de 5 000 litres sans bac de rétention ; aucun exercice de déversement.');
      m('9.1.1', 'NC', 'Consommation d’eau non mesurée : pas de compteur sur le forage.');
      m('7.3', 'OBS', 'Opérateurs peu informés du tri des déchets de poisson.');
      m('8.1b', 'OBS', 'Collecteur des déchets sans contrat ni bordereau de suivi.');
    },
  },
});
