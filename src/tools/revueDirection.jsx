import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

/** Éléments d'entrée de la revue de direction (ISO 9001:2015 § 9.3.2). */
const ENTREES = [
  ['actions', 'Suivi des actions des revues précédentes'],
  ['enjeux', 'Changements des enjeux internes et externes'],
  ['clients', 'Satisfaction des clients et retours des parties intéressées'],
  ['objectifs', 'Atteinte des objectifs qualité'],
  ['processus', 'Performance des processus et conformité des produits'],
  ['nc', 'Non-conformités et actions correctives'],
  ['mesures', 'Résultats de la surveillance et des mesures'],
  ['audits', 'Résultats des audits'],
  ['fournisseurs', 'Performance des prestataires externes'],
  ['ressources', 'Adéquation des ressources'],
  ['risques', 'Efficacité des actions face aux risques et opportunités'],
  ['amelioration', 'Opportunités d’amélioration'],
];
const AVIS = { ok: ['Satisfaisant', '#15803d', '#dcfce7'], surveiller: ['À surveiller', '#854d0e', '#fef9c3'], insuffisant: ['Insuffisant', '#b91c1c', '#fde8e8'] };
const decisionVide = () => ({ decision: '', type: 'Amélioration', resp: '', echeance: '' });
const TYPES = ['Amélioration', 'Changement du système', 'Ressources'];

export const revueDirection = {
  id: 'revue-direction',
  nom: 'Revue de direction',
  ico: '🏛️',
  court: 'Préparer et tracer la revue de direction ISO 9001 : bilan point par point, décisions et actions.',
  fiche: (
    <>
      <p>La revue de direction (ISO 9001 § 9.3) est la réunion où la direction fait le bilan du système qualité, en général une fois par an. L’auditeur de certification la demande toujours.</p>
      <ul>
        <li>Préparez chaque point avec des chiffres : indicateurs, résultats d’audits, réclamations.</li>
        <li>Donnez une appréciation à chaque point : satisfaisant, à surveiller, insuffisant.</li>
        <li>Terminez par des <b>décisions</b> : améliorations, changements du système, besoins en ressources, avec un responsable et une échéance.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', periode: '', participants: '', points: Object.fromEntries(ENTREES.map(([k]) => [k, { texte: '', avis: '' }])), decisions: [decisionVide()], conclusion: '' }),
  exemple: () => {
    const p = (texte, avis) => ({ texte, avis });
    const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
    return {
      titre: 'Revue de direction 2026', date: aujourdhui(), reference: 'RD-2026', redacteur: 'Ousmane Kane', service: 'Direction — Imprimerie',
      periode: 'Novembre 2025 à octobre 2026', participants: 'Directeur général (président), responsable qualité, directeur technique, responsable commercial, responsable achats, chef d’atelier.',
      points: {
        actions: p('8 actions décidées en 2025 : 6 réalisées, 2 en cours (étalonnage, enquête de satisfaction).', 'surveiller'),
        enjeux: p('Hausse du prix du papier importé (+18 %). Nouveau concurrent à Diamniadio. Demande croissante d’emballages imprimés.', 'surveiller'),
        clients: p('42 réclamations sur 1 250 commandes (3,4 %), contre 4,1 % en 2025. Délais de livraison : principal motif.', 'surveiller'),
        objectifs: p('3 objectifs sur 4 atteints. Livraisons à l’heure : 88 % pour un objectif de 95 %.', 'surveiller'),
        processus: p('Taux de gâche papier : 4,2 % (objectif 5 %). TRS de la presse offset : 61 %.', 'ok'),
        nc: p('57 non-conformités internes, dont 70 % liées aux réglages couleur. 5 actions correctives, 4 efficaces.', 'ok'),
        mesures: p('Indicateurs suivis chaque mois et affichés à l’atelier depuis mars.', 'ok'),
        audits: p('Audit interne d’octobre : 3 non-conformités (étalonnage, documents, fournisseurs), 2 observations.', 'insuffisant'),
        fournisseurs: p('Fournisseurs principaux non évalués depuis 2025. Deux retards de livraison de papier.', 'insuffisant'),
        ressources: p('Besoin d’un deuxième opérateur prépresse et d’un spectrophotomètre pour la couleur.', 'surveiller'),
        risques: p('Risque de rupture de papier réduit grâce à un stock de sécurité d’un mois.', 'ok'),
        amelioration: p('Logiciel de suivi des commandes ; formation des opérateurs au réglage couleur.', 'ok'),
      },
      decisions: [
        { decision: 'Traiter les 3 non-conformités d’audit avant l’audit de certification', type: 'Changement du système', resp: 'Responsable qualité', echeance: d(75) },
        { decision: 'Acheter un spectrophotomètre et former 4 opérateurs au réglage couleur', type: 'Ressources', resp: 'Directeur technique', echeance: d(90) },
        { decision: 'Planifier la production avec le commercial chaque lundi pour tenir les délais', type: 'Amélioration', resp: 'Responsable commercial', echeance: d(14) },
        { decision: 'Évaluer les 8 fournisseurs principaux deux fois par an', type: 'Changement du système', resp: 'Responsable achats', echeance: d(45) },
      ],
      conclusion: 'Le système qualité est efficace et progresse (réclamations en baisse). Priorités 2027 : délais de livraison, couleur, préparation de la certification ISO 9001 en février.',
    };
  },
  Formulaire({ data, set }) {
    const majP = (k, patch) => set({ points: { ...data.points, [k]: { ...data.points[k], ...patch } } });
    const majD = (i, patch) => set({ decisions: data.decisions.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>La réunion</h2>
          <Champ label="Période couverte" value={data.periode} onChange={(v) => set({ periode: v })} placeholder="Ex. : novembre 2025 à octobre 2026" />
          <Champ label="Participants" multi rows={2} value={data.participants} onChange={(v) => set({ participants: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Bilan point par point</h2>
          {ENTREES.map(([k, nom], i) => {
            const pt = data.points[k] || { texte: '', avis: '' };
            return (
              <div key={k} style={{ borderTop: i ? '1px solid var(--trait)' : 0, padding: '12px 0 2px' }}>
                <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: 14.5 }}>{i + 1}. {nom}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {Object.entries(AVIS).map(([a, [n, fg, bg]]) => <button key={a} type="button" className="btn petit" onClick={() => majP(k, { avis: pt.avis === a ? '' : a })} style={{ background: pt.avis === a ? fg : bg, color: pt.avis === a ? '#fff' : fg, borderRadius: 999 }}>{n}</button>)}
                </div>
                <Champ label="Synthèse et chiffres clés" multi rows={2} value={pt.texte} onChange={(v) => majP(k, { texte: v })} />
              </div>
            );
          })}
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Décisions</h2>
          {data.decisions.map((x, i) => (
            <div className="risque-bloc" key={i}>
              <Champ label={`Décision ${i + 1}`} multi rows={2} value={x.decision} onChange={(v) => majD(i, { decision: v })} />
              <div className="trois">
                <div className="champ"><label>Type</label><select value={x.type} onChange={(e) => majD(i, { type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
                <Champ label="Responsable" value={x.resp} onChange={(v) => majD(i, { resp: v })} />
                <Champ label="Échéance" type="date" value={x.echeance} onChange={(v) => majD(i, { echeance: v })} />
              </div>
              {data.decisions.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ decisions: data.decisions.filter((_, j) => j !== i) })}>Retirer</button></div>}
            </div>
          ))}
          <button type="button" className="btn secondaire petit" onClick={() => set({ decisions: [...data.decisions, decisionVide()] })}>+ Ajouter une décision</button>
        </div>
        <div className="panneau">
          <h2><span className="num">✓</span>Conclusion</h2>
          <Champ label="Conclusion sur l’efficacité du système qualité" multi value={data.conclusion} onChange={(v) => set({ conclusion: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    const compte = (a) => ENTREES.filter(([k]) => data.points[k]?.avis === a).length;
    return (
      <>
        <h2>Réunion</h2>
        <div className="doc-encadre"><b>Période : </b>{data.periode || '—'}{data.participants ? `\nParticipants : ${data.participants}` : ''}</div>
        <div className="legende evite-coupure" style={{ marginTop: 10 }}>{Object.entries(AVIS).map(([a, [n, fg]]) => <span key={a}><i style={{ background: fg }} />{n} : <b>{compte(a)}</b></span>)}</div>
        <h2>Bilan (éléments d’entrée § 9.3.2)</h2>
        <table>
          <thead><tr><th style={{ width: 22 }}>N°</th><th style={{ width: 170 }}>Point</th><th>Synthèse</th><th style={{ width: 92 }}>Appréciation</th></tr></thead>
          <tbody>
            {ENTREES.map(([k, nom], i) => {
              const pt = data.points[k] || {}; const a = AVIS[pt.avis];
              return <tr key={k}><td>{i + 1}</td><td><b style={{ fontSize: 11.5 }}>{nom}</b></td><td><T v={pt.texte} /></td><td>{a ? <span style={{ background: a[2], color: a[1], borderRadius: 999, padding: '2px 8px', fontWeight: 800, fontSize: 10.5, whiteSpace: 'nowrap' }}>{a[0]}</span> : '—'}</td></tr>;
            })}
          </tbody>
        </table>
        <h2>Décisions et actions (éléments de sortie § 9.3.3)</h2>
        <table>
          <thead><tr><th style={{ width: 22 }}>N°</th><th>Décision</th><th style={{ width: 120 }}>Type</th><th style={{ width: 120 }}>Responsable</th><th style={{ width: 80 }}>Échéance</th></tr></thead>
          <tbody>{data.decisions.map((x, i) => <tr key={i}><td>{i + 1}</td><td><b><T v={x.decision} /></b></td><td style={{ fontSize: 11 }}>{x.type}</td><td><T v={x.resp} /></td><td>{dateFr(x.echeance) || '—'}</td></tr>)}</tbody>
        </table>
        <h2>Conclusion</h2>
        <div className="doc-encadre racine"><T v={data.conclusion} /></div>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
          {['Visa du responsable qualité', 'Visa de la direction générale'].map((v) => <div key={v} style={{ border: '1px dashed #c9d4e3', borderRadius: 10, height: 64, padding: '6px 10px', fontSize: 10.5, color: '#8190a8', fontWeight: 700 }}>{v}</div>)}
        </div>
      </>
    );
  },
};
