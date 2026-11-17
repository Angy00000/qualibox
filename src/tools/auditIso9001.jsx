import { creerChecklist, ficheChecklist } from './checklist.jsx';

/** Questions d'audit interne, par chapitre de l'ISO 9001:2015. */
const CHAPITRES = [
  ['4', 'Contexte de l’organisme', [
    ['4.1', 'Les enjeux internes et externes de l’entreprise sont-ils identifiés et suivis ?'],
    ['4.2', 'Les parties intéressées (clients, autorités, fournisseurs…) et leurs exigences sont-elles identifiées ?'],
    ['4.3', 'Le domaine d’application du système qualité est-il défini et documenté ?'],
    ['4.4', 'Les processus et leurs interactions sont-ils déterminés (cartographie, pilotes, indicateurs) ?'],
  ]],
  ['5', 'Leadership', [
    ['5.1', 'La direction démontre-t-elle son engagement (ressources, revues, communication) ?'],
    ['5.2', 'La politique qualité est-elle établie, affichée et comprise par le personnel ?'],
    ['5.3', 'Les rôles, responsabilités et autorités sont-ils attribués et connus ?'],
  ]],
  ['6', 'Planification', [
    ['6.1', 'Les risques et opportunités sont-ils identifiés et traités par des actions ?'],
    ['6.2', 'Des objectifs qualité mesurables sont-ils fixés, suivis et communiqués ?'],
  ]],
  ['7', 'Support', [
    ['7.1', 'Les ressources (personnes, locaux, équipements) sont-elles suffisantes et entretenues ?'],
    ['7.1.5', 'Les équipements de mesure sont-ils étalonnés ou vérifiés et identifiés ?'],
    ['7.2', 'Les compétences requises sont-elles définies, et les formations enregistrées ?'],
    ['7.4', 'La communication interne et externe est-elle organisée ?'],
    ['7.5', 'Les documents et enregistrements sont-ils maîtrisés (versions, accès, conservation) ?'],
  ]],
  ['8', 'Réalisation des activités opérationnelles', [
    ['8.2', 'Les exigences des clients sont-elles revues avant d’accepter une commande ?'],
    ['8.4', 'Les fournisseurs et sous-traitants sont-ils évalués, sélectionnés et suivis ?'],
    ['8.5', 'La production est-elle maîtrisée (instructions, contrôles, identification, traçabilité) ?'],
    ['8.6', 'Les produits ou services sont-ils vérifiés avant leur livraison ?'],
    ['8.7', 'Les produits non conformes sont-ils identifiés, isolés et traités ?'],
  ]],
  ['9', 'Évaluation des performances', [
    ['9.1', 'La satisfaction des clients est-elle mesurée et analysée ?'],
    ['9.2', 'Des audits internes sont-ils planifiés et réalisés par des auditeurs indépendants ?'],
    ['9.3', 'La revue de direction est-elle réalisée et enregistrée ?'],
  ]],
  ['10', 'Amélioration', [
    ['10.2', 'Les non-conformités et réclamations donnent-elles lieu à des actions correctives efficaces ?'],
    ['10.3', 'L’amélioration continue est-elle démontrée (projets, indicateurs en progrès) ?'],
  ]],
];

export const auditIso9001 = creerChecklist({
  id: 'audit-iso-9001',
  nom: 'Check-list d’audit ISO 9001',
  ico: '✅',
  court: 'Mener un audit interne ISO 9001, chapitre par chapitre, avec score et liste des écarts.',
  fiche: ficheChecklist(<>Cette check-list suit les chapitres 4 à 10 de l’<b>ISO 9001:2015</b>.</>),
  chapitres: CHAPITRES,
  exemple: {
    meta: {
      titre: 'Audit interne ISO 9001 — 2026', reference: 'AUD-2026-02', redacteur: 'Ousmane Kane (auditeur)', service: 'Imprimerie — tous services',
      perimetre: 'Tous les processus : commercial, prépresse, impression, façonnage, achats, maintenance, ressources humaines.',
      audites: 'Directeur général, responsable qualité, chef d’atelier, responsable achats, 4 opérateurs.',
      conclusion: 'Système qualité bien en place et compris par le personnel. 3 non-conformités à traiter avant l’audit de certification de février 2027 : étalonnage, maîtrise des documents, évaluation des fournisseurs.',
    },
    reponses: (m) => {
      m('4.1', 'C', 'Analyse SWOT de janvier 2026, revue en revue de direction.');
      m('6.2', 'OBS', 'Objectifs fixés mais pas affichés dans les ateliers.');
      m('7.1.5', 'NC', '2 balances sur 4 sans certificat d’étalonnage valide (dernier en 2024).');
      m('7.5', 'NC', 'Anciennes versions de la fiche de contrôle encore utilisées à l’atelier façonnage.');
      m('8.4', 'NC', 'Aucune évaluation des fournisseurs de papier depuis 2025.');
      m('9.1', 'OBS', 'Réclamations suivies, mais pas d’enquête de satisfaction.');
      m('7.2', 'C', 'Matrice des compétences à jour, formations enregistrées.');
      m('8.6', 'C', 'Bon à tirer signé par le client avant chaque production.');
    },
  },
});
