import { creerChecklist, ficheChecklist } from './checklist.jsx';

/** Questions d'audit santé et sécurité au travail, par chapitre de l'ISO 45001:2018. */
const CHAPITRES = [
  ['4', 'Contexte de l’organisme', [
    ['4.1', 'Les enjeux internes et externes liés à la santé et la sécurité sont-ils identifiés ?'],
    ['4.2', 'Les besoins des travailleurs et des autres parties intéressées sont-ils pris en compte ?'],
    ['4.3', 'Le domaine d’application du système SST est-il défini (sites, activités, sous-traitants) ?'],
  ]],
  ['5', 'Leadership et participation des travailleurs', [
    ['5.1', 'La direction s’implique-t-elle visiblement dans la sécurité (visites, moyens, exemplarité) ?'],
    ['5.2', 'Une politique santé et sécurité est-elle établie, affichée et comprise ?'],
    ['5.3', 'Les rôles et responsabilités en sécurité sont-ils attribués et connus ?'],
    ['5.4', 'Les travailleurs sont-ils consultés et participent-ils (comité d’hygiène et de sécurité, délégués) ?'],
  ]],
  ['6', 'Planification', [
    ['6.1.2', 'Les dangers sont-ils identifiés et les risques évalués pour chaque poste (document unique / évaluation des risques) ?'],
    ['6.1.3', 'Les exigences légales en santé et sécurité (Code du travail, règlements) sont-elles identifiées et respectées ?'],
    ['6.2', 'Des objectifs de sécurité mesurables sont-ils fixés et suivis ?'],
  ]],
  ['7', 'Support', [
    ['7.2', 'Les formations à la sécurité sont-elles réalisées et enregistrées (accueil, postes à risque, secourisme) ?'],
    ['7.3', 'Les travailleurs connaissent-ils les dangers de leur poste et les consignes ?'],
    ['7.5', 'Les consignes, procédures et enregistrements de sécurité sont-ils à jour et accessibles ?'],
  ]],
  ['8', 'Réalisation des activités opérationnelles', [
    ['8.1.2', 'Les mesures suivent-elles la hiérarchie : supprimer le danger, protections collectives, puis équipements individuels ?'],
    ['8.1.2b', 'Les équipements de protection individuelle sont-ils fournis, adaptés, en bon état et portés ?'],
    ['8.1.3', 'Les changements (nouvelle machine, nouveau produit, nouveau poste) sont-ils évalués avant leur mise en place ?'],
    ['8.1.4', 'Les sous-traitants et prestataires sont-ils informés des risques et suivis ?'],
    ['8.2', 'Les situations d’urgence sont-elles préparées (extincteurs vérifiés, issues dégagées, exercices d’évacuation) ?'],
  ]],
  ['9', 'Évaluation des performances', [
    ['9.1', 'Des inspections de sécurité et le suivi médical des travailleurs sont-ils réalisés ?'],
    ['9.2', 'Des audits internes de sécurité sont-ils réalisés ?'],
    ['9.3', 'La revue de direction traite-t-elle de la santé et de la sécurité ?'],
  ]],
  ['10', 'Amélioration', [
    ['10.2', 'Les accidents, presque-accidents et incidents sont-ils déclarés, analysés et suivis d’actions ?'],
    ['10.3', 'Les résultats en sécurité progressent-ils (taux de fréquence, taux de gravité) ?'],
  ]],
];

export const auditIso45001 = creerChecklist({
  id: 'audit-iso-45001',
  nom: 'Check-list ISO 45001',
  ico: '🦺',
  court: 'Auditer la santé et la sécurité au travail, chapitre par chapitre, avec score et écarts.',
  fiche: ficheChecklist(<>Cette check-list suit les chapitres 4 à 10 de l’<b>ISO 45001:2018</b> (santé et sécurité au travail).</>),
  chapitres: CHAPITRES,
  exemple: {
    meta: {
      titre: 'Audit santé et sécurité — chantier R+2', reference: 'AUD-SST-2026-04', redacteur: 'Ibrahima Fall (auditeur HSE)', service: 'HSE — Chantier Keur Massar',
      perimetre: 'Chantier de construction : gros œuvre, coffrage, ferraillage, installations de chantier, sous-traitant électricité.',
      audites: 'Directeur des travaux, chef de chantier, responsable HSE, 2 chefs d’équipe, 5 ouvriers.',
      conclusion: 'Bonne implication de l’encadrement. Priorités : protections collectives contre les chutes de hauteur, port des EPI, déclaration et analyse des presque-accidents.',
    },
    reponses: (m) => {
      m('5.4', 'OBS', 'Pas de réunion sécurité avec les ouvriers depuis septembre.');
      m('6.1.2', 'OBS', 'Évaluation des risques faite, mais pas mise à jour pour le coffrage des dalles.');
      m('8.1.2', 'NC', 'Dalle du 2e étage sans garde-corps ; protection reposant uniquement sur les harnais.');
      m('8.1.2b', 'NC', '3 ouvriers sur 5 sans casque ni chaussures de sécurité lors de la visite.');
      m('8.2', 'OBS', 'Extincteurs présents mais non vérifiés depuis 2025.');
      m('10.2', 'NC', 'Aucun presque-accident déclaré : pas de registre.');
      m('9.1', 'C', 'Visites médicales d’embauche réalisées.');
    },
  },
});
