import { creerChecklist } from './checklist.jsx';

/** Audit 5S d'un poste ou d'une zone : une série de questions par « S ». */
const CHAPITRES = [
  ['S1', 'Seiri — Trier', [
    ['1.1', 'Seuls les objets utiles au travail sont-ils présents au poste (pas d’objets cassés, périmés ou personnels) ?'],
    ['1.2', 'Les objets inutiles ou douteux sont-ils identifiés (étiquette rouge) et évacués ?'],
    ['1.3', 'Les quantités stockées au poste correspondent-elles au besoin (pas de surstock) ?'],
  ]],
  ['S2', 'Seiton — Ranger', [
    ['2.1', 'Chaque objet a-t-il une place définie et repérée (marquage, étiquette, contour) ?'],
    ['2.2', 'Les objets sont-ils à leur place et faciles à trouver en moins de 30 secondes ?'],
    ['2.3', 'Les allées, issues de secours et extincteurs sont-ils dégagés et marqués au sol ?'],
  ]],
  ['S3', 'Seiso — Nettoyer', [
    ['3.1', 'Le sol, les murs et les machines sont-ils propres (pas de poussière, d’huile, de déchets) ?'],
    ['3.2', 'Le matériel de nettoyage est-il disponible, rangé et en bon état ?'],
    ['3.3', 'Les sources de saleté (fuites, poussières) sont-elles identifiées et traitées ?'],
  ]],
  ['S4', 'Seiketsu — Standardiser', [
    ['4.1', 'Les règles 5S du poste sont-elles écrites et affichées (photo du poste rangé, standard) ?'],
    ['4.2', 'Les responsabilités de rangement et de nettoyage sont-elles réparties (planning) ?'],
    ['4.3', 'Les anomalies sont-elles visibles d’un coup d’œil (management visuel, codes couleur) ?'],
  ]],
  ['S5', 'Shitsuke — Faire durer', [
    ['5.1', 'Le personnel applique-t-il les règles sans rappel ?'],
    ['5.2', 'Des audits 5S sont-ils faits régulièrement et les résultats affichés ?'],
    ['5.3', 'Les actions des audits précédents ont-elles été réalisées ?'],
  ]],
];

export const audit5s = creerChecklist({
  id: 'audit-5s',
  nom: 'Audit 5S',
  ico: '🧹',
  court: 'Noter le tri, le rangement et la propreté d’un poste ou d’une zone, S par S, avec score et actions.',
  fiche: (
    <>
      <p>Les <b>5S</b> viennent du Japon : trier, ranger, nettoyer, standardiser, faire durer. Un poste en 5S gagne du temps, fait moins d’erreurs et d’accidents.</p>
      <ul>
        <li>Faites l’audit sur le terrain, au poste, en 15 minutes, si possible avec l’équipe.</li>
        <li><b>Conforme</b> : c’est en place. <b>Observation</b> : en partie. <b>Non conforme</b> : absent.</li>
        <li>Notez le constat pour chaque écart ; affichez le score au poste et refaites l’audit chaque mois pour suivre le progrès.</li>
      </ul>
    </>
  ),
  chapitres: CHAPITRES,
  prefixe: '',
  exemple: {
    meta: {
      titre: 'Audit 5S — atelier de réparation de téléphones', reference: '5S-2026-11', redacteur: 'ANGY (auditeur)', service: 'Boutique — Atelier réparation',
      perimetre: 'Établi de réparation, armoire des pièces détachées, zone des téléphones en attente.',
      audites: 'Deux techniciens réparateurs.',
      conclusion: 'Bonne propreté générale. Priorité au rangement des pièces (bacs étiquetés par modèle) et à l’identification des téléphones clients en attente. Prochain audit dans un mois.',
    },
    reponses: (m) => {
      m('1.1', 'OBS', 'Vieilles coques et écrans cassés mélangés aux pièces neuves.');
      m('1.3', 'NC', 'Une trentaine de batteries d’anciens modèles sans usage depuis plus d’un an.');
      m('2.1', 'NC', 'Pièces détachées en vrac dans des sachets non étiquetés.');
      m('2.2', 'OBS', 'Tournevis et ventouses retrouvés après 2 minutes de recherche.');
      m('4.1', 'NC', 'Aucune règle écrite ni photo de l’établi rangé.');
      m('4.3', 'OBS', 'Téléphones clients sans fiche visible : risque d’inversion.');
      m('5.2', 'NC', 'Premier audit 5S.');
      m('5.3', 'NA');
    },
  },
});
