import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const NOTES = [[4, '4 — Très bien'], [3, '3 — Bien'], [2, '2 — Moyen'], [1, '1 — Insuffisant']];
const CLASSES = {
  A: { nom: 'A — Agréé', bg: '#dcfce7', fg: '#15803d' },
  B: { nom: 'B — Sous surveillance', bg: '#fef9c3', fg: '#854d0e' },
  C: { nom: 'C — À remplacer', bg: '#fde8e8', fg: '#b91c1c' },
};
const criteresDefaut = () => [
  { nom: 'Qualité des produits', poids: 40 },
  { nom: 'Respect des délais', poids: 30 },
  { nom: 'Prix', poids: 15 },
  { nom: 'Service et réactivité', poids: 15 },
];
const fournisseurVide = (n = 4) => ({ nom: '', produit: '', notes: Array(n).fill(3), commentaire: '' });

export const scoreFournisseur = (f, criteres) => {
  const total = criteres.reduce((s, c) => s + Number(c.poids || 0), 0) || 1;
  const pts = criteres.reduce((s, c, i) => s + Number(c.poids || 0) * Number(f.notes[i] ?? 0), 0);
  return Math.round((pts / (4 * total)) * 100);
};
const classe = (s) => (s >= 80 ? 'A' : s >= 60 ? 'B' : 'C');

export const evalFournisseurs = {
  id: 'eval-fournisseurs',
  nom: 'Évaluation des fournisseurs',
  ico: '🚚',
  court: 'Noter vos fournisseurs sur la qualité, les délais et le prix, et les classer A, B ou C.',
  fiche: (
    <>
      <p>L’ISO 9001 (§ 8.4) demande d’évaluer les fournisseurs et prestataires, en général une ou deux fois par an. C’est un point que les auditeurs vérifient presque toujours.</p>
      <ul>
        <li>Choisissez vos critères et leur poids (le total n’a pas besoin de faire 100).</li>
        <li>Notez chaque fournisseur de 1 à 4 en vous appuyant sur des faits : retards, non-conformités, réclamations.</li>
        <li><b>A</b> (≥ 80 %) : agréé. <b>B</b> (60 à 79 %) : sous surveillance, à revoir. <b>C</b> (&lt; 60 %) : plan d’action ou remplacement.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', periode: '', criteres: criteresDefaut(), fournisseurs: [fournisseurVide()] }),
  exemple: () => ({
    titre: 'Évaluation annuelle des fournisseurs', date: aujourdhui(), reference: 'EF-2026-02', redacteur: 'Aïssatou Diop', service: 'Achats — Imprimerie',
    periode: 'Second semestre 2026',
    criteres: criteresDefaut(),
    fournisseurs: [
      { nom: 'Papeterie Atlantique', produit: 'Papier couché et offset', notes: [4, 3, 3, 4], commentaire: '' },
      { nom: 'Encres du Sahel', produit: 'Encres offset', notes: [3, 2, 3, 2], commentaire: '2 livraisons en retard ; relance par courrier.' },
      { nom: 'Plaques Pro Dakar', produit: 'Plaques CTP', notes: [4, 4, 2, 3], commentaire: '' },
      { nom: 'Transports Ndiaye & Fils', produit: 'Livraison clients', notes: [2, 1, 4, 2], commentaire: '5 retards et 1 colis abîmé. Chercher un second transporteur.' },
      { nom: 'Maintenance Graphique SN', produit: 'Entretien des presses', notes: [3, 3, 2, 4], commentaire: '' },
    ],
  }),
  Formulaire({ data, set }) {
    const majC = (i, patch) => set({ criteres: data.criteres.map((c, j) => (j === i ? { ...c, ...patch } : c)) });
    const majF = (i, patch) => set({ fournisseurs: data.fournisseurs.map((f, j) => (j === i ? { ...f, ...patch } : f)) });
    const ajouterCritere = () => set({ criteres: [...data.criteres, { nom: '', poids: 10 }], fournisseurs: data.fournisseurs.map((f) => ({ ...f, notes: [...f.notes, 3] })) });
    const retirerCritere = (i) => set({ criteres: data.criteres.filter((_, j) => j !== i), fournisseurs: data.fournisseurs.map((f) => ({ ...f, notes: f.notes.filter((_, j) => j !== i) })) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Critères et poids</h2>
          <Champ label="Période évaluée" value={data.periode} onChange={(v) => set({ periode: v })} placeholder="Ex. : second semestre 2026" />
          {data.criteres.map((c, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 34px', gap: 8, alignItems: 'end' }}>
              <Champ label={`Critère ${i + 1}`} value={c.nom} onChange={(v) => majC(i, { nom: v })} />
              <Champ label="Poids" type="number" value={c.poids} onChange={(v) => majC(i, { poids: Math.max(0, Number(v) || 0) })} />
              <button type="button" className="btn discret petit" style={{ marginBottom: 14 }} aria-label="Retirer" disabled={data.criteres.length < 2} onClick={() => retirerCritere(i)}>×</button>
            </div>
          ))}
          <button type="button" className="btn secondaire petit" onClick={ajouterCritere}>+ Ajouter un critère</button>
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Fournisseurs</h2>
          {data.fournisseurs.map((f, i) => {
            const s = scoreFournisseur(f, data.criteres); const k = CLASSES[classe(s)];
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Fournisseur {i + 1}</b><span className="niveau" style={{ background: k.bg, color: k.fg }}>{s} % · {k.nom}</span></div>
                <div className="deux">
                  <Champ label="Nom" value={f.nom} onChange={(v) => majF(i, { nom: v })} />
                  <Champ label="Produit ou service" value={f.produit} onChange={(v) => majF(i, { produit: v })} />
                </div>
                <div className="deux">
                  {data.criteres.map((c, j) => (
                    <div className="champ" key={j}><label>{c.nom || `Critère ${j + 1}`}</label>
                      <select value={f.notes[j] ?? 3} onChange={(e) => majF(i, { notes: f.notes.map((n, x) => (x === j ? Number(e.target.value) : n)) })}>{NOTES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                    </div>
                  ))}
                </div>
                <Champ label="Commentaire / action décidée" value={f.commentaire} onChange={(v) => majF(i, { commentaire: v })} />
                {data.fournisseurs.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ fournisseurs: data.fournisseurs.filter((_, j) => j !== i) })}>Retirer</button></div>}
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ fournisseurs: [...data.fournisseurs, fournisseurVide(data.criteres.length)] })}>+ Ajouter un fournisseur</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const lignes = data.fournisseurs.map((f) => { const s = scoreFournisseur(f, data.criteres); return { ...f, s, k: classe(s) }; }).sort((a, b) => b.s - a.s);
    const n = (k) => lignes.filter((l) => l.k === k).length;
    const total = data.criteres.reduce((s, c) => s + Number(c.poids || 0), 0);
    return (
      <>
        <h2>Méthode</h2>
        <div className="doc-encadre"><b>Période : </b>{data.periode || '—'}{'\n'}Critères : {data.criteres.map((c) => `${c.nom || '—'} (${total ? Math.round((c.poids / total) * 100) : 0} %)`).join(' · ')}{'\n'}Notes de 1 (insuffisant) à 4 (très bien). A ≥ 80 % · B de 60 à 79 % · C &lt; 60 %</div>
        <h2>Résultat</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[['Fournisseurs', lignes.length, '#0a0f0c'], ...Object.entries(CLASSES).map(([k, c]) => [c.nom, n(k), c.fg])].map(([l, v, c]) => (
            <div key={l} style={{ border: '1px solid #dfe5ee', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>{l}</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 22, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <h2>Classement</h2>
        <table className="amdec">
          <thead><tr><th>Fournisseur</th>{data.criteres.map((c, j) => <th key={j} style={{ width: 62, textAlign: 'center' }}>{c.nom || `C${j + 1}`}</th>)}<th style={{ width: 52, textAlign: 'center' }}>Score</th><th style={{ width: 104 }}>Classe</th></tr></thead>
          <tbody>
            {lignes.map((l, i) => (
              <tr key={i}>
                <td><b><T v={l.nom} /></b><div style={{ color: '#66748b' }}>{l.produit}</div>{l.commentaire ? <div style={{ color: '#4a5770', marginTop: 3 }}>→ {l.commentaire}</div> : null}</td>
                {data.criteres.map((_, j) => <td key={j} style={{ textAlign: 'center', fontWeight: 700, color: l.notes[j] <= 1 ? '#b91c1c' : l.notes[j] === 2 ? '#b45309' : undefined }}>{l.notes[j]}</td>)}
                <td style={{ textAlign: 'center', fontWeight: 800 }}>{l.s} %</td>
                <td><span style={{ background: CLASSES[l.k].bg, color: CLASSES[l.k].fg, borderRadius: 999, padding: '2px 8px', fontWeight: 800, whiteSpace: 'nowrap' }}>{CLASSES[l.k].nom}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  },
};
