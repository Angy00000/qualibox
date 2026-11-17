import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const dans = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

export const cinqPourquoi = {
  id: '5-pourquoi',
  nom: '5 Pourquoi',
  ico: '❓',
  court: 'Remonter à la vraie cause d’un problème en posant « pourquoi ? » cinq fois de suite.',
  fiche: (
    <>
      <p>Les 5 Pourquoi servent à ne pas s’arrêter au premier symptôme. On part du problème constaté et on demande « pourquoi ? » jusqu’à atteindre une cause sur laquelle on peut agir durablement : c’est la <b>cause racine</b>.</p>
      <ul>
        <li>Décrivez le problème avec des faits : quoi, où, combien.</li>
        <li>Chaque réponse devient la question suivante. Cinq fois est un repère : arrêtez-vous quand la cause trouvée est actionnable.</li>
        <li>Restez sur les faits vérifiés, pas sur les personnes : on cherche ce qui a permis l’erreur.</li>
        <li>Finissez par une action corrective, un responsable et une échéance.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', probleme: '', pourquoi: ['', '', '', '', ''], racine: '', action: '', responsable: '', echeance: '' }),
  exemple: () => ({
    titre: 'Baguettes brûlées à la première fournée', date: aujourdhui(), reference: 'NC-2026-014', redacteur: 'Moussa Diop', service: 'Production — Boulangerie',
    probleme: 'Depuis 10 jours, environ 15 % des baguettes de la fournée de 5 h sortent brûlées (environ 90 baguettes jetées par jour).',
    pourquoi: [
      'La température du four dépasse 250 °C en fin de fournée.',
      'Le boulanger ne vérifie pas la température entre deux fournées.',
      'Le thermomètre du four est en panne depuis trois semaines.',
      'Personne n’a signalé la panne au responsable.',
      'Il n’existe ni procédure de signalement des pannes ni plan de maintenance du four.',
    ],
    racine: 'Absence de plan de maintenance du four et de procédure de signalement des pannes.',
    action: 'Réparer le thermomètre ; créer une fiche de signalement des pannes affichée à l’atelier ; mettre en place un plan de maintenance mensuel du four.',
    responsable: 'Chef boulanger', echeance: dans(14),
  }),
  Formulaire({ data, set }) {
    const majP = (i, v) => set({ pourquoi: data.pourquoi.map((x, j) => (j === i ? v : x)) });
    const derniere = [...data.pourquoi].reverse().find((x) => x.trim());
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Le problème</h2>
          <Champ label="Problème constaté (faits, lieu, quantité)" multi value={data.probleme} onChange={(v) => set({ probleme: v })} placeholder="Ex. : 15 % des baguettes brûlées à la fournée de 5 h depuis 10 jours" />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Les 5 Pourquoi</h2>
          {data.pourquoi.map((p, i) => (
            <div className="pourquoi-pas" data-n={i + 1} key={i}>
              <Champ label={i === 0 ? 'Pourquoi ce problème arrive-t-il ?' : `Pourquoi ? (à partir de la réponse ${i})`} multi rows={2} value={p} onChange={(v) => majP(i, v)} />
            </div>
          ))}
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Cause racine et action</h2>
          <Champ label="Cause racine" multi rows={2} value={data.racine} onChange={(v) => set({ racine: v })} />
          {derniere && !data.racine && <p className="aide"><button type="button" className="btn secondaire petit" onClick={() => set({ racine: derniere })}>Reprendre la dernière réponse</button></p>}
          <Champ label="Action corrective" multi value={data.action} onChange={(v) => set({ action: v })} />
          <div className="deux">
            <Champ label="Responsable" value={data.responsable} onChange={(v) => set({ responsable: v })} />
            <Champ label="Échéance" type="date" value={data.echeance} onChange={(v) => set({ echeance: v })} />
          </div>
        </div>
      </>
    );
  },
  Document({ data }) {
    const remplis = data.pourquoi.map((p, i) => [p, i]).filter(([p]) => p.trim());
    return (
      <>
        <h2>Problème constaté</h2>
        <div className="doc-encadre probleme"><T v={data.probleme} /></div>
        <h2>Analyse : les 5 Pourquoi</h2>
        <div className="chaine">
          {(remplis.length ? remplis : [['', 0]]).map(([p, i], k) => (
            <div key={i}>
              {k > 0 && <div className="trait-v" />}
              <div className="maillon"><div className="rond">P{i + 1}</div><div className="txt"><small>Pourquoi ?</small><T v={p} /></div></div>
            </div>
          ))}
        </div>
        <h2>Cause racine</h2>
        <div className="doc-encadre racine"><b><T v={data.racine} /></b></div>
        <h2>Action corrective</h2>
        <table>
          <thead><tr><th>Action</th><th style={{ width: 150 }}>Responsable</th><th style={{ width: 100 }}>Échéance</th></tr></thead>
          <tbody><tr><td><T v={data.action} /></td><td><T v={data.responsable} /></td><td><T v={dateFr(data.echeance)} /></td></tr></tbody>
        </table>
      </>
    );
  },
};
