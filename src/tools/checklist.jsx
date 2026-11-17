import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

export const REPONSES = {
  C: { nom: 'Conforme', bg: '#dcfce7', fg: '#15803d' },
  OBS: { nom: 'Observation', bg: '#fef9c3', fg: '#854d0e' },
  NC: { nom: 'Non conforme', bg: '#fde8e8', fg: '#b91c1c' },
  NA: { nom: 'Non applicable', bg: '#f1f5f9', fg: '#64748b' },
};

export const scoreAudit = (rep, liste) => {
  const evalues = liste.filter(([n]) => rep[n]?.r && rep[n].r !== 'NA');
  const ok = evalues.filter(([n]) => rep[n].r === 'C').length + evalues.filter(([n]) => rep[n].r === 'OBS').length * 0.5;
  return { evalues: evalues.length, pct: evalues.length ? Math.round((ok / evalues.length) * 100) : null };
};

const Pastille = ({ r }) => (r ? <span style={{ background: r.bg, color: r.fg, borderRadius: 999, padding: '2px 8px', fontWeight: 800, fontSize: 10.5, whiteSpace: 'nowrap' }}>{r.nom}</span> : <span className="doc-vide">—</span>);

/**
 * Fabrique une check-list d'audit à partir de ses chapitres : [numéro, nom, [[réf, question], …]].
 * exemple(rep, marquer) remplit un audit de démonstration.
 */
export function creerChecklist({ id, nom, ico, court, fiche, chapitres, prefixe = '§', exemple }) {
  const QUESTIONS = chapitres.flatMap(([, , qs]) => qs);
  const vides = () => Object.fromEntries(QUESTIONS.map(([n]) => [n, { r: '', constat: '' }]));
  const score = (rep, liste = QUESTIONS) => scoreAudit(rep, liste);

  return {
    id, nom, ico, court, fiche,
    vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', perimetre: '', audites: '', rep: vides(), conclusion: '' }),
    exemple: () => {
      const rep = vides();
      QUESTIONS.forEach(([n]) => { rep[n] = { r: 'C', constat: '' }; });
      const marquer = (n, r, constat = '') => { rep[n] = { r, constat }; };
      return { ...exemple.meta, date: aujourdhui(), rep: (exemple.reponses(marquer), rep) };
    },
    Formulaire({ data, set }) {
      const rep = data.rep || vides();
      const maj = (n, patch) => set({ rep: { ...rep, [n]: { ...(rep[n] || { r: '', constat: '' }), ...patch } } });
      const { pct, evalues } = score(rep);
      return (
        <>
          <div className="panneau">
            <h2><span className="num">1</span>L’audit</h2>
            <Champ label="Périmètre audité" multi rows={2} value={data.perimetre} onChange={(v) => set({ perimetre: v })} />
            <Champ label="Personnes rencontrées" value={data.audites} onChange={(v) => set({ audites: v })} />
            <p className="aide">Score actuel : <b>{pct === null ? '—' : `${pct} %`}</b> sur {evalues} question(s) évaluée(s) sur {QUESTIONS.length}.</p>
          </div>
          {chapitres.map(([num, titre, qs]) => (
            <div className="panneau" key={num}>
              <h2><span className="num" style={{ minWidth: 34, width: 'auto', padding: '0 7px', borderRadius: 9 }}>{prefixe}{num}</span>{titre}</h2>
              {qs.map(([n, q]) => {
                const r = rep[n] || { r: '', constat: '' };
                return (
                  <div key={n} style={{ borderTop: '1px solid var(--trait)', padding: '12px 0 4px' }}>
                    <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 14.5 }}><span style={{ color: 'var(--teal)', fontWeight: 800 }}>{n}</span> · {q}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      {Object.entries(REPONSES).map(([k, v]) => (
                        <button key={k} type="button" className="btn petit" onClick={() => maj(n, { r: r.r === k ? '' : k })}
                          style={{ background: r.r === k ? v.fg : v.bg, color: r.r === k ? '#fff' : v.fg, borderRadius: 999 }}>{v.nom}</button>
                      ))}
                    </div>
                    {(r.r === 'NC' || r.r === 'OBS' || r.constat) && <Champ label="Constat / preuve" multi rows={2} value={r.constat} onChange={(v) => maj(n, { constat: v })} />}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="panneau">
            <h2><span className="num">✓</span>Conclusion</h2>
            <Champ label="Conclusion de l’audit" multi value={data.conclusion} onChange={(v) => set({ conclusion: v })} />
          </div>
        </>
      );
    },
    Document({ data }) {
      const rep = data.rep || vides();
      const { pct } = score(rep);
      const nb = (k) => QUESTIONS.filter(([n]) => rep[n]?.r === k).length;
      const ecarts = QUESTIONS.filter(([n]) => ['NC', 'OBS'].includes(rep[n]?.r)).sort(([a], [b]) => (rep[a].r === 'NC' ? 0 : 1) - (rep[b].r === 'NC' ? 0 : 1));
      const couleur = pct === null ? '#8190a8' : pct >= 85 ? '#15803d' : pct >= 60 ? '#d97706' : '#e5484d';
      return (
        <>
          <h2>Périmètre et personnes rencontrées</h2>
          <div className="doc-encadre"><T v={data.perimetre} />{data.audites ? `\nPersonnes rencontrées : ${data.audites}` : ''}</div>
          <h2>Résultat global</h2>
          <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 14, alignItems: 'center' }}>
            <div style={{ border: `3px solid ${couleur}`, borderRadius: 14, padding: 12, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 34, color: couleur }}>{pct === null ? '—' : `${pct} %`}</div>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#66748b' }}>de conformité</div>
            </div>
            <div style={{ display: 'grid', gap: 5 }}>
              {chapitres.map(([num, titre, qs]) => {
                const s = score(rep, qs);
                return (
                  <div key={num} style={{ display: 'grid', gridTemplateColumns: '210px 1fr 42px', gap: 8, alignItems: 'center', fontSize: 11 }}>
                    <span><b>{prefixe}{num}</b> {titre}</span>
                    <div style={{ height: 9, borderRadius: 5, background: '#e8eef6', overflow: 'hidden' }}><div style={{ width: `${s.pct || 0}%`, height: '100%', background: s.pct === null ? 'transparent' : s.pct >= 85 ? '#16a34a' : s.pct >= 60 ? '#f59e0b' : '#e5484d' }} /></div>
                    <b style={{ textAlign: 'right' }}>{s.pct === null ? '—' : `${s.pct} %`}</b>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="legende" style={{ marginTop: 10 }}>
            {Object.entries(REPONSES).map(([k, v]) => <span key={k}><i style={{ background: v.fg }} />{v.nom} : <b>{nb(k)}</b></span>)}
          </div>
          <h2>Écarts relevés</h2>
          {ecarts.length ? (
            <table>
              <thead><tr><th style={{ width: 52 }}>Réf.</th><th style={{ width: 96 }}>Type</th><th>Exigence</th><th>Constat</th></tr></thead>
              <tbody>
                {ecarts.map(([n, q]) => (
                  <tr key={n}><td><b>{n}</b></td><td><Pastille r={REPONSES[rep[n].r]} /></td><td style={{ fontSize: 11.5 }}>{q}</td><td><T v={rep[n].constat} /></td></tr>
                ))}
              </tbody>
            </table>
          ) : <div className="doc-encadre">Aucun écart relevé.</div>}
          <h2>Conclusion</h2>
          <div className="doc-encadre racine"><T v={data.conclusion} /></div>
          <h2>Détail de la check-list</h2>
          <table className="compact">
            <thead><tr><th style={{ width: 52 }}>Réf.</th><th>Question</th><th style={{ width: 100 }}>Réponse</th></tr></thead>
            <tbody>
              {QUESTIONS.map(([n, q]) => <tr key={n}><td><b>{n}</b></td><td style={{ fontSize: 11.5 }}>{q}</td><td><Pastille r={REPONSES[rep[n]?.r]} /></td></tr>)}
            </tbody>
          </table>
        </>
      );
    },
  };
}

/** Texte commun des fiches de check-list. */
export const ficheChecklist = (intro) => (
  <>
    <p>{intro} Pour chaque question, cherchez une <b>preuve</b> sur le terrain (document, enregistrement, entretien, observation) avant de répondre.</p>
    <ul>
      <li><b>Conforme</b> : l’exigence est respectée, preuve à l’appui.</li>
      <li><b>Observation</b> : respectée, mais fragile ou à améliorer.</li>
      <li><b>Non conforme</b> : l’exigence n’est pas respectée. Décrivez le constat précisément.</li>
      <li>Le score compte 1 point par conformité et 0,5 par observation, sans les questions non applicables.</li>
      <li>Les écarts trouvés alimentent ensuite votre <b>plan d’action</b>.</li>
    </ul>
  </>
);
