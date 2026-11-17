import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

export const NIVEAUX = [
  { v: 0, nom: 'Non formé', court: '—', bg: '#f1f5f9', fg: '#94a3b8' },
  { v: 1, nom: 'En formation', court: '1', bg: '#fef9c3', fg: '#854d0e' },
  { v: 2, nom: 'Autonome', court: '2', bg: '#bbf7d0', fg: '#166534' },
  { v: 3, nom: 'Expert, peut former', court: '3', bg: '#16a34a', fg: '#fff' },
];
const personneVide = (n) => ({ nom: '', fonction: '', niveaux: Array(n).fill(0) });

export const matriceCompetences = {
  id: 'matrice-competences',
  nom: 'Matrice des compétences',
  ico: '🎓',
  court: 'Voir qui sait faire quoi, repérer les postes fragiles et planifier les formations.',
  fiche: (
    <>
      <p>La matrice des compétences (ou de polyvalence) répond à l’ISO 9001 § 7.2 : prouver que chaque poste est tenu par des personnes compétentes.</p>
      <ul>
        <li>En colonnes : les compétences ou postes. En lignes : les personnes.</li>
        <li>Niveaux : <b>0</b> non formé, <b>1</b> en formation, <b>2</b> autonome, <b>3</b> expert qui peut former.</li>
        <li>Une compétence tenue par moins de <b>2 personnes autonomes</b> est fragile : une absence suffit à bloquer l’activité.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', competences: ['', ''], personnes: [personneVide(2)], plan: '' }),
  exemple: () => ({
    titre: 'Matrice de polyvalence — atelier', date: aujourdhui(), reference: 'MC-2026-01', redacteur: 'Ousmane Kane', service: 'Production — Imprimerie',
    competences: ['Prépresse (PAO)', 'Calage presse offset', 'Réglage couleur', 'Massicot', 'Façonnage', 'Contrôle qualité'],
    personnes: [
      { nom: 'Moussa Diallo', fonction: 'Chef d’atelier', niveaux: [1, 3, 3, 2, 2, 3] },
      { nom: 'Awa Ndoye', fonction: 'Opératrice PAO', niveaux: [3, 0, 1, 0, 0, 2] },
      { nom: 'Ibrahima Fall', fonction: 'Conducteur offset', niveaux: [0, 2, 1, 2, 1, 1] },
      { nom: 'Khady Mbaye', fonction: 'Façonnière', niveaux: [0, 0, 0, 2, 3, 2] },
      { nom: 'Cheikh Sow', fonction: 'Aide conducteur', niveaux: [0, 1, 0, 1, 2, 0] },
      { nom: 'Mariama Ba', fonction: 'Contrôleuse', niveaux: [0, 0, 1, 0, 1, 3] },
    ],
    plan: 'Former Ibrahima Fall au réglage couleur avec Moussa Diallo (janvier). Former un deuxième opérateur PAO (Mariama Ba, février). Accompagner Cheikh Sow au calage jusqu’à l’autonomie.',
  }),
  Formulaire({ data, set }) {
    const majCompetence = (j, v) => set({ competences: data.competences.map((c, x) => (x === j ? v : c)) });
    const ajouterCompetence = () => set({ competences: [...data.competences, ''], personnes: data.personnes.map((p) => ({ ...p, niveaux: [...p.niveaux, 0] })) });
    const retirerCompetence = (j) => set({ competences: data.competences.filter((_, x) => x !== j), personnes: data.personnes.map((p) => ({ ...p, niveaux: p.niveaux.filter((_, x) => x !== j) })) });
    const majP = (i, patch) => set({ personnes: data.personnes.map((p, x) => (x === i ? { ...p, ...patch } : p)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Compétences ou postes</h2>
          <div className="liste-causes">
            {data.competences.map((c, j) => (
              <div className="ligne-cause" key={j}>
                <input value={c} placeholder={`Compétence ${j + 1}`} onChange={(e) => majCompetence(j, e.target.value)} />
                {data.competences.length > 1 && <button type="button" className="x" aria-label="Retirer" onClick={() => retirerCompetence(j)}>×</button>}
              </div>
            ))}
          </div>
          <button type="button" className="btn secondaire petit" onClick={ajouterCompetence}>+ Ajouter une compétence</button>
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Personnes et niveaux</h2>
          {data.personnes.map((p, i) => (
            <div className="risque-bloc" key={i}>
              <div className="deux">
                <Champ label="Nom" value={p.nom} onChange={(v) => majP(i, { nom: v })} />
                <Champ label="Fonction" value={p.fonction} onChange={(v) => majP(i, { fonction: v })} />
              </div>
              {data.competences.map((c, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '6px 0', borderTop: '1px solid var(--trait)' }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{c || `Compétence ${j + 1}`}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {NIVEAUX.map((n) => {
                      const actif = (p.niveaux[j] ?? 0) === n.v;
                      return <button key={n.v} type="button" title={n.nom} onClick={() => majP(i, { niveaux: p.niveaux.map((x, k) => (k === j ? n.v : x)) })} style={{ width: 34, height: 30, borderRadius: 8, border: actif ? '2px solid #0a0f0c' : '1px solid var(--trait)', background: n.bg, color: n.fg, fontWeight: 800, cursor: 'pointer' }}>{n.v}</button>;
                    })}
                  </div>
                </div>
              ))}
              {data.personnes.length > 1 && <div style={{ textAlign: 'right', marginTop: 6 }}><button type="button" className="btn discret petit" onClick={() => set({ personnes: data.personnes.filter((_, x) => x !== i) })}>Retirer</button></div>}
            </div>
          ))}
          <button type="button" className="btn secondaire" onClick={() => set({ personnes: [...data.personnes, personneVide(data.competences.length)] })}>+ Ajouter une personne</button>
          <p style={{ fontSize: 13, color: 'var(--gris)', margin: '10px 0 0' }}>0 non formé · 1 en formation · 2 autonome · 3 expert, peut former</p>
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Plan de formation</h2>
          <Champ label="Formations prévues" multi value={data.plan} onChange={(v) => set({ plan: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    const autonomes = data.competences.map((_, j) => data.personnes.filter((p) => (p.niveaux[j] ?? 0) >= 2).length);
    const fragiles = data.competences.map((c, j) => ({ c, n: autonomes[j] })).filter((x) => x.n < 2);
    const nb = data.competences.length || 1;
    return (
      <>
        <h2>Matrice</h2>
        <table className="amdec">
          <thead><tr><th>Personne</th>{data.competences.map((c, j) => <th key={j} style={{ textAlign: 'center', width: 64 }}>{c || `C${j + 1}`}</th>)}<th style={{ width: 62, textAlign: 'center' }}>Polyvalence</th></tr></thead>
          <tbody>
            {data.personnes.map((p, i) => {
              const poly = Math.round((p.niveaux.filter((n) => n >= 2).length / nb) * 100);
              return (
                <tr key={i}>
                  <td><b><T v={p.nom} /></b><div style={{ color: '#66748b' }}>{p.fonction}</div></td>
                  {data.competences.map((_, j) => { const n = NIVEAUX[p.niveaux[j] ?? 0]; return <td key={j} style={{ background: n.bg, color: n.fg, textAlign: 'center', fontWeight: 800, fontSize: 12, verticalAlign: 'middle', border: '2px solid #fff' }}>{n.court}</td>; })}
                  <td style={{ textAlign: 'center', fontWeight: 800, verticalAlign: 'middle' }}>{poly} %</td>
                </tr>
              );
            })}
            <tr>
              <td><b>Personnes autonomes</b></td>
              {autonomes.map((n, j) => <td key={j} style={{ textAlign: 'center', fontWeight: 800, color: n < 2 ? '#b91c1c' : '#15803d' }}>{n}</td>)}
              <td />
            </tr>
          </tbody>
        </table>
        <div className="legende evite-coupure">{NIVEAUX.map((n) => <span key={n.v}><i style={{ background: n.bg, border: '1px solid #dfe5ee' }} />{n.v} — {n.nom}</span>)}</div>
        <h2>Compétences fragiles ({fragiles.length})</h2>
        {fragiles.length
          ? <div className="doc-encadre probleme evite-coupure">{fragiles.map((x, i) => <div key={i}><b>{x.c || '—'}</b> : {x.n === 0 ? 'personne n’est autonome' : 'une seule personne autonome'}</div>)}</div>
          : <div className="doc-encadre">Chaque compétence est tenue par au moins 2 personnes autonomes.</div>}
        <h2>Plan de formation</h2>
        <div className="doc-encadre racine"><T v={data.plan} /></div>
      </>
    );
  },
};
