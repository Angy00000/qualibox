import { Champ, Choix } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const GRAV = [[1, '1 — Légère (soins sur place)'], [2, '2 — Moyenne (arrêt court)'], [3, '3 — Grave (arrêt long)'], [4, '4 — Très grave (invalidité, décès)']];
const PROBA = [[1, '1 — Très rare'], [2, '2 — Rare'], [3, '3 — Fréquente'], [4, '4 — Très fréquente']];
const priorite = (c) => (c >= 9 ? { n: 'P1', nom: 'Priorité 1', bg: '#e5484d', fg: '#fff' } : c >= 4 ? { n: 'P2', nom: 'Priorité 2', bg: '#fb923c', fg: '#fff' } : { n: 'P3', nom: 'Priorité 3', bg: '#dcfce7', fg: '#15803d' });
const ligneVide = () => ({ unite: '', danger: '', risque: '', exposes: '', g: 2, p: 2, existantes: '', aPrendre: '', resp: '', echeance: '' });
const dans = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

export const documentUnique = {
  id: 'document-unique',
  nom: 'Évaluation des risques professionnels',
  ico: '🦺',
  court: 'Le document unique : dangers et risques par unité de travail, cotation, mesures existantes et à prendre.',
  fiche: (
    <>
      <p>L’évaluation des risques professionnels (souvent appelée <b>document unique</b>) recense, poste par poste, ce qui peut blesser ou rendre malade les travailleurs. C’est la base de l’ISO 45001 (§ 6.1.2) et une obligation de l’employeur dans le Code du travail.</p>
      <ul>
        <li>Découpez l’entreprise en <b>unités de travail</b> (atelier, bureau, livraison…).</li>
        <li><b>Danger</b> : ce qui peut blesser (machine, produit, hauteur). <b>Risque</b> : ce qui peut arriver (coupure, chute, intoxication).</li>
        <li>Criticité = gravité × probabilité. P1 (9 à 16) : agir tout de suite. P2 (4 à 8) : planifier. P3 : surveiller.</li>
        <li>Mettez-le à jour au moins une fois par an et après chaque accident ou changement.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', effectif: '', lignes: [ligneVide()] }),
  exemple: () => ({
    titre: 'Évaluation des risques professionnels — boulangerie', date: aujourdhui(), reference: 'DU-2026', redacteur: 'Aminata Fall', service: 'Direction — Boulangerie de quartier',
    effectif: '9 salariés : 4 boulangers, 3 vendeuses, 1 livreur, 1 gérant',
    lignes: [
      { unite: 'Fournil', danger: 'Four à sole (surfaces > 200 °C)', risque: 'Brûlures aux mains et avant-bras', exposes: '4 boulangers', g: 3, p: 3, existantes: 'Gants anti-chaleur', aPrendre: 'Pelles à long manche, manchettes de protection', resp: 'Gérant', echeance: dans(30) },
      { unite: 'Fournil', danger: 'Farine en suspension', risque: 'Asthme du boulanger, irritation', exposes: '4 boulangers', g: 3, p: 4, existantes: 'Aucune', aPrendre: 'Verser la farine doucement, couvercle sur le pétrin, masques FFP2', resp: 'Chef boulanger', echeance: dans(15) },
      { unite: 'Fournil', danger: 'Pétrin et façonneuse', risque: 'Happement de la main', exposes: '4 boulangers', g: 4, p: 1, existantes: 'Grille de protection avec arrêt automatique', aPrendre: 'Vérifier le fonctionnement de la grille chaque semaine', resp: 'Chef boulanger', echeance: dans(7) },
      { unite: 'Fournil', danger: 'Sacs de farine de 50 kg', risque: 'Mal de dos, lombalgie', exposes: '4 boulangers', g: 2, p: 4, existantes: 'Diable', aPrendre: 'Commander des sacs de 25 kg, former aux gestes et postures', resp: 'Gérant', echeance: dans(45) },
      { unite: 'Vente', danger: 'Sol mouillé ou fariné', risque: 'Glissade, chute', exposes: '3 vendeuses', g: 2, p: 2, existantes: 'Nettoyage en fin de journée', aPrendre: 'Chaussures antidérapantes', resp: 'Gérant', echeance: dans(30) },
      { unite: 'Vente', danger: 'Caisse et espèces', risque: 'Agression', exposes: '3 vendeuses', g: 3, p: 1, existantes: 'Dépôt quotidien à la banque', aPrendre: '', resp: '', echeance: '' },
      { unite: 'Livraison', danger: 'Circulation en scooter', risque: 'Accident de la route', exposes: '1 livreur', g: 4, p: 3, existantes: 'Casque fourni', aPrendre: 'Gilet réfléchissant, entretien mensuel du scooter, pas de livraison sous la pluie forte', resp: 'Gérant', echeance: dans(10) },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ lignes: data.lignes.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>L’entreprise</h2>
          <Champ label="Effectif et postes" multi rows={2} value={data.effectif} onChange={(v) => set({ effectif: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Risques par unité de travail</h2>
          {data.lignes.map((l, i) => {
            const c = l.g * l.p; const pr = priorite(c);
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Risque {i + 1}</b><span className="niveau" style={{ background: pr.bg, color: pr.fg }}>{c} · {pr.nom}</span></div>
                <div className="deux">
                  <Champ label="Unité de travail" value={l.unite} onChange={(v) => maj(i, { unite: v })} />
                  <Champ label="Personnes exposées" value={l.exposes} onChange={(v) => maj(i, { exposes: v })} />
                </div>
                <Champ label="Danger" value={l.danger} onChange={(v) => maj(i, { danger: v })} />
                <Champ label="Risque (ce qui peut arriver)" value={l.risque} onChange={(v) => maj(i, { risque: v })} />
                <div className="deux">
                  <Choix label="Gravité" value={l.g} options={GRAV} onChange={(v) => maj(i, { g: v })} />
                  <Choix label="Probabilité" value={l.p} options={PROBA} onChange={(v) => maj(i, { p: v })} />
                </div>
                <Champ label="Mesures existantes" value={l.existantes} onChange={(v) => maj(i, { existantes: v })} />
                <Champ label="Mesures à prendre" multi rows={2} value={l.aPrendre} onChange={(v) => maj(i, { aPrendre: v })} />
                <div className="deux">
                  <Champ label="Responsable" value={l.resp} onChange={(v) => maj(i, { resp: v })} />
                  <Champ label="Échéance" type="date" value={l.echeance} onChange={(v) => maj(i, { echeance: v })} />
                </div>
                {data.lignes.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ lignes: data.lignes.filter((_, j) => j !== i) })}>Retirer</button></div>}
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ lignes: [...data.lignes, ligneVide()] })}>+ Ajouter un risque</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const lignes = data.lignes.map((l, i) => ({ ...l, n: i + 1, c: l.g * l.p })).sort((a, b) => b.c - a.c);
    const nb = (k) => lignes.filter((l) => priorite(l.c).n === k).length;
    return (
      <>
        <h2>L’entreprise</h2>
        <div className="doc-encadre"><T v={data.effectif} /></div>
        <div className="legende evite-coupure" style={{ marginTop: 10 }}>
          {['P1', 'P2', 'P3'].map((k, i) => { const pr = priorite([9, 4, 1][i]); return <span key={k}><i style={{ background: pr.bg, border: '1px solid #dfe5ee' }} />{pr.nom} ({['9 à 16', '4 à 8', '1 à 3'][i]}) : <b>{nb(k)}</b></span>; })}
        </div>
        <h2>Évaluation (de la plus haute criticité à la plus basse)</h2>
        <table className="amdec">
          <thead><tr><th style={{ width: 62 }}>Unité</th><th>Danger et risque</th><th style={{ width: 16 }}>G</th><th style={{ width: 16 }}>P</th><th style={{ width: 36 }}>Crit.</th><th>Mesures existantes</th><th>Mesures à prendre</th><th style={{ width: 70 }}>Qui, quand</th></tr></thead>
          <tbody>
            {lignes.map((l) => { const pr = priorite(l.c); return (
              <tr key={l.n}>
                <td><b>{l.unite}</b></td>
                <td><b><T v={l.danger} /></b><div>{l.risque}</div>{l.exposes ? <div style={{ color: '#66748b' }}>{l.exposes}</div> : null}</td>
                <td>{l.g}</td><td>{l.p}</td>
                <td><span style={{ background: pr.bg, color: pr.fg, borderRadius: 6, padding: '2px 5px', fontWeight: 800 }}>{l.c}</span></td>
                <td>{l.existantes}</td><td><b>{l.aPrendre}</b></td>
                <td>{l.resp}{l.echeance ? <div style={{ color: '#66748b' }}>{dateFr(l.echeance)}</div> : null}</td>
              </tr>
            ); })}
          </tbody>
        </table>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
          {['L’employeur (nom, date, signature)', 'Représentant du personnel ou délégué sécurité'].map((v) => <div key={v} style={{ border: '1px dashed #c9d4e3', borderRadius: 10, height: 60, padding: '6px 10px', fontSize: 10.5, color: '#8190a8', fontWeight: 700 }}>{v}</div>)}
        </div>
      </>
    );
  },
};
