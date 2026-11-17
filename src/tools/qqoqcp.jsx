import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const QUESTIONS = [
  ['quoi', 'Quoi ?', 'Quel est le problème ? Que se passe-t-il exactement ?'],
  ['qui', 'Qui ?', 'Qui est concerné, qui l’a constaté, qui est touché ?'],
  ['ou', 'Où ?', 'Dans quel lieu, quel service, sur quel poste ?'],
  ['quand', 'Quand ?', 'Depuis quand, à quel moment, à quelle fréquence ?'],
  ['comment', 'Comment ?', 'Comment cela se produit-il, comment l’a-t-on découvert ?'],
  ['combien', 'Combien ?', 'Combien de cas, quel coût, quelle quantité ?'],
  ['pourquoi', 'Pourquoi ?', 'Pourquoi est-ce important de le traiter ? Quels enjeux ?'],
];

export const qqoqcp = {
  id: 'qqoqcp',
  nom: 'QQOQCP',
  ico: '🧭',
  court: 'Décrire un problème de façon complète et factuelle avec sept questions simples.',
  fiche: (
    <>
      <p>Le QQOQCP (Quoi, Qui, Où, Quand, Comment, Combien, Pourquoi) sert à <b>bien poser le problème</b> avant de chercher ses causes. Un problème bien décrit est à moitié résolu.</p>
      <ul>
        <li>Répondez avec des faits et des chiffres, pas des opinions.</li>
        <li>Ne proposez pas encore de solutions : on décrit seulement.</li>
        <li>Terminez par une phrase de synthèse qui résume le problème.</li>
        <li>Enchaînez ensuite avec Ishikawa ou les 5 Pourquoi.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', ...Object.fromEntries(QUESTIONS.map(([k]) => [k, ''])), synthese: '' }),
  exemple: () => ({
    titre: 'Retards de remise des résultats d’analyses', date: aujourdhui(), reference: 'QQ-2026-003', redacteur: 'Dr Fatou Sarr', service: 'Laboratoire — Clinique',
    quoi: 'Les résultats d’analyses sont remis aux patients avec 2 à 3 jours de retard sur le délai annoncé (24 h).',
    qui: 'Laboratoire (techniciens), accueil (remise des résultats) ; patients externes surtout.',
    ou: 'Service laboratoire et guichet d’accueil de la clinique.',
    quand: 'Depuis septembre 2026, surtout les lundis et après les jours fériés.',
    comment: 'Les résultats sont imprimés en fin de journée, rangés par ordre d’arrivée, puis recherchés à la main à l’accueil. Plusieurs dossiers sont mal classés.',
    combien: 'Environ 40 réclamations par mois, soit 25 % des dossiers ; 3 patients ont refait leurs analyses ailleurs.',
    pourquoi: 'Insatisfaction des patients, retards de traitement, perte de clients et risque pour l’image de la clinique.',
    synthese: 'Depuis septembre 2026, 25 % des résultats d’analyses sont remis avec 2 à 3 jours de retard, surtout le lundi, à cause d’un circuit de classement et de remise manuel entre le laboratoire et l’accueil.',
  }),
  Formulaire({ data, set }) {
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Les sept questions</h2>
          {QUESTIONS.map(([k, q, aide]) => <Champ key={k} label={`${q} — ${aide}`} multi rows={2} value={data[k]} onChange={(v) => set({ [k]: v })} />)}
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Synthèse</h2>
          <Champ label="Le problème en une ou deux phrases" multi value={data.synthese} onChange={(v) => set({ synthese: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    return (
      <>
        <h2>Description du problème</h2>
        <table className="qq">
          <tbody>
            {QUESTIONS.map(([k, q, aide]) => (
              <tr key={k}><td><div className="q">{q}<small>{aide}</small></div></td><td><T v={data[k]} /></td></tr>
            ))}
          </tbody>
        </table>
        <h2>Synthèse</h2>
        <div className="doc-encadre racine"><b><T v={data.synthese} /></b></div>
      </>
    );
  },
};
