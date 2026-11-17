import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

/** Questions d'audit interne, par chapitre de l'ISO 9001:2015. */
export const CHAPITRES = [
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
const QUESTIONS = CHAPITRES.flatMap(([, , qs]) => qs);
export const REPONSES = {
  C: { nom: 'Conforme', bg: '#dcfce7', fg: '#15803d' },
  OBS: { nom: 'Observation', bg: '#fef9c3', fg: '#854d0e' },
  NC: { nom: 'Non conforme', bg: '#fde8e8', fg: '#b91c1c' },
  NA: { nom: 'Non applicable', bg: '#f1f5f9', fg: '#64748b' },
};

const vides = () => Object.fromEntries(QUESTIONS.map(([n]) => [n, { r: '', constat: '' }]));
export const scoreAudit = (rep, liste = QUESTIONS) => {
  const evalues = liste.filter(([n]) => rep[n]?.r && rep[n].r !== 'NA');
  const ok = evalues.filter(([n]) => rep[n].r === 'C').length + evalues.filter(([n]) => rep[n].r === 'OBS').length * 0.5;
  return { evalues: evalues.length, pct: evalues.length ? Math.round((ok / evalues.length) * 100) : null };
};

export const auditIso9001 = {
  id: 'audit-iso-9001',
  nom: 'Check-list d’audit ISO 9001',
  ico: '✅',
  court: 'Mener un audit interne ISO 9001, chapitre par chapitre, avec score et liste des écarts.',
  fiche: (
    <>
      <p>Cette check-list suit les chapitres 4 à 10 de l’<b>ISO 9001:2015</b>. Pour chaque question, cherchez une <b>preuve</b> sur le terrain (document, enregistrement, entretien, observation) avant de répondre.</p>
      <ul>
        <li><b>Conforme</b> : l’exigence est respectée, preuve à l’appui.</li>
        <li><b>Observation</b> : respectée, mais fragile ou à améliorer.</li>
        <li><b>Non conforme</b> : l’exigence n’est pas respectée. Décrivez le constat précisément.</li>
        <li>Le score compte 1 point par conformité et 0,5 par observation, sans les questions non applicables.</li>
        <li>Les non-conformités trouvées alimentent ensuite votre <b>plan d’action</b>.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', perimetre: '', audites: '', rep: vides(), conclusion: '' }),
  exemple: () => {
    const rep = vides();
    const set = (n, r, constat = '') => { rep[n] = { r, constat }; };
    QUESTIONS.forEach(([n]) => set(n, 'C'));
    set('4.1', 'C', 'Analyse SWOT de janvier 2026, revue en revue de direction.');
    set('6.2', 'OBS', 'Objectifs fixés mais pas affichés dans les ateliers.');
    set('7.1.5', 'NC', '2 balances sur 4 sans certificat d’étalonnage valide (dernier en 2024).');
    set('7.5', 'NC', 'Anciennes versions de la fiche de contrôle encore utilisées à l’atelier façonnage.');
    set('8.4', 'NC', 'Aucune évaluation des fournisseurs de papier depuis 2025.');
    set('9.1', 'OBS', 'Réclamations suivies, mais pas d’enquête de satisfaction.');
    set('7.2', 'C', 'Matrice des compétences à jour, formations enregistrées.');
    set('8.6', 'C', 'Bon à tirer signé par le client avant chaque production.');
    return {
      titre: 'Audit interne ISO 9001 — 2026', date: aujourdhui(), reference: 'AUD-2026-02', redacteur: 'Ousmane Kane (auditeur)', service: 'Imprimerie — tous services',
      perimetre: 'Tous les processus : commercial, prépresse, impression, façonnage, achats, maintenance, ressources humaines.',
      audites: 'Directeur général, responsable qualité, chef d’atelier, responsable achats, 4 opérateurs.',
      rep, conclusion: 'Système qualité bien en place et compris par le personnel. 3 non-conformités à traiter avant l’audit de certification de février 2027 : étalonnage, maîtrise des documents, évaluation des fournisseurs.',
    };
  },
  Formulaire({ data, set }) {
    const maj = (n, patch) => set({ rep: { ...data.rep, [n]: { ...data.rep[n], ...patch } } });
    const { pct, evalues } = scoreAudit(data.rep);
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>L’audit</h2>
          <Champ label="Périmètre audité" multi rows={2} value={data.perimetre} onChange={(v) => set({ perimetre: v })} />
          <Champ label="Personnes rencontrées" value={data.audites} onChange={(v) => set({ audites: v })} />
          <p className="aide">Score actuel : <b>{pct === null ? '—' : `${pct} %`}</b> sur {evalues} question(s) évaluée(s).</p>
        </div>
        {CHAPITRES.map(([num, nom, qs]) => (
          <div className="panneau" key={num}>
            <h2><span className="num" style={{ width: 34, borderRadius: 9 }}>§{num}</span>{nom}</h2>
            {qs.map(([n, q]) => {
              const r = data.rep[n] || { r: '', constat: '' };
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
    const { pct } = scoreAudit(data.rep);
    const nb = (k) => QUESTIONS.filter(([n]) => data.rep[n]?.r === k).length;
    const ecarts = QUESTIONS.filter(([n]) => ['NC', 'OBS'].includes(data.rep[n]?.r)).sort(([a], [b]) => (data.rep[a].r === 'NC' ? 0 : 1) - (data.rep[b].r === 'NC' ? 0 : 1));
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
            {CHAPITRES.map(([num, nom, qs]) => {
              const s = scoreAudit(data.rep, qs);
              return (
                <div key={num} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 42px', gap: 8, alignItems: 'center', fontSize: 11 }}>
                  <span><b>§{num}</b> {nom}</span>
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
            <thead><tr><th style={{ width: 46 }}>§</th><th style={{ width: 96 }}>Type</th><th>Exigence</th><th>Constat</th></tr></thead>
            <tbody>
              {ecarts.map(([n, q]) => { const r = REPONSES[data.rep[n].r]; return (
                <tr key={n}><td><b>{n}</b></td><td><span style={{ background: r.bg, color: r.fg, borderRadius: 999, padding: '2px 8px', fontWeight: 800, fontSize: 10.5, whiteSpace: 'nowrap' }}>{r.nom}</span></td><td style={{ fontSize: 11.5 }}>{q}</td><td><T v={data.rep[n].constat} /></td></tr>
              ); })}
            </tbody>
          </table>
        ) : <div className="doc-encadre">Aucun écart relevé.</div>}
        <h2>Conclusion</h2>
        <div className="doc-encadre racine"><T v={data.conclusion} /></div>
        <h2>Détail de la check-list</h2>
        <table>
          <thead><tr><th style={{ width: 46 }}>§</th><th>Question</th><th style={{ width: 100 }}>Réponse</th></tr></thead>
          <tbody>
            {QUESTIONS.map(([n, q]) => { const r = REPONSES[data.rep[n]?.r]; return (
              <tr key={n}><td><b>{n}</b></td><td style={{ fontSize: 11.5 }}>{q}</td><td>{r ? <span style={{ background: r.bg, color: r.fg, borderRadius: 999, padding: '2px 8px', fontWeight: 800, fontSize: 10.5, whiteSpace: 'nowrap' }}>{r.nom}</span> : <span className="doc-vide">—</span>}</td></tr>
            ); })}
          </tbody>
        </table>
      </>
    );
  },
};
