import { Champ, ListeLignes } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const ECHELLE = [
  { k: 'ts', nom: 'Très satisfait', c: '#15803d' },
  { k: 's', nom: 'Satisfait', c: '#4ade80' },
  { k: 'ps', nom: 'Peu satisfait', c: '#fb923c' },
  { k: 'ns', nom: 'Pas satisfait', c: '#e5484d' },
];
const questionVide = (q = '') => ({ q, ts: 0, s: 0, ps: 0, ns: 0 });
const total = (x) => ECHELLE.reduce((s, e) => s + Number(x[e.k] || 0), 0);
const taux = (x) => { const t = total(x); return t ? Math.round(((Number(x.ts) + Number(x.s)) / t) * 100) : null; };

export const satisfactionClient = {
  id: 'satisfaction-client',
  nom: 'Enquête de satisfaction',
  ico: '😊',
  court: 'Saisir les réponses de vos clients question par question et obtenir le taux de satisfaction et les points faibles.',
  fiche: (
    <>
      <p>L’ISO 9001 (§ 9.1.2) demande de surveiller la <b>perception des clients</b>. Une enquête simple, une ou deux fois par an, suffit.</p>
      <ul>
        <li>5 à 8 questions courtes : accueil, qualité, délais, prix, service après-vente… et une question ouverte.</li>
        <li>Échelle à 4 niveaux (pas de « moyen » : le client doit choisir un côté).</li>
        <li>Saisissez le nombre de réponses par niveau. Taux de satisfaction = (très satisfaits + satisfaits) / réponses.</li>
        <li>Une question sous <b>80 %</b> est un point faible : décidez une action.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', periode: '', methode: '', questions: ['Accueil', 'Qualité des produits', 'Respect des délais', 'Prix', 'Service après-vente'].map(questionVide), verbatims: [''], actions: '' }),
  exemple: () => ({
    titre: 'Enquête de satisfaction clients 2026', date: aujourdhui(), reference: 'ESC-2026', redacteur: 'Pape Ndiaye', service: 'Boutique — Vente et réparation',
    periode: 'Octobre 2026', methode: 'Questionnaire papier en caisse et lien WhatsApp envoyé après chaque réparation. 84 réponses.',
    questions: [
      { q: 'Accueil en boutique', ts: 52, s: 28, ps: 3, ns: 1 },
      { q: 'Qualité des produits', ts: 41, s: 33, ps: 8, ns: 2 },
      { q: 'Délai de réparation', ts: 18, s: 32, ps: 24, ns: 10 },
      { q: 'Prix', ts: 22, s: 44, ps: 15, ns: 3 },
      { q: 'Explications et conseils', ts: 47, s: 30, ps: 6, ns: 1 },
      { q: 'Garantie et service après-vente', ts: 25, s: 36, ps: 16, ns: 7 },
    ],
    verbatims: ['« Très bon accueil, on m’a bien expliqué la panne. »', '« J’ai attendu 5 jours pour un écran alors qu’on m’avait dit 2. »', '« Pas de reçu de garantie au début, il a fallu le demander. »'],
    actions: 'Annoncer un délai réaliste et prévenir le client par WhatsApp en cas de retard. Stock minimum d’écrans pour les 5 modèles les plus réparés. Remettre systématiquement un bon de garantie écrit.',
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ questions: data.questions.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>L’enquête</h2>
          <Champ label="Période" value={data.periode} onChange={(v) => set({ periode: v })} placeholder="Ex. : octobre 2026" />
          <Champ label="Méthode et nombre de réponses" multi rows={2} value={data.methode} onChange={(v) => set({ methode: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Résultats par question</h2>
          {data.questions.map((x, i) => {
            const t = taux(x);
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Question {i + 1}</b><span className="niveau" style={{ background: t === null ? '#f1f5f9' : t >= 80 ? '#dcfce7' : '#fde8e8', color: t === null ? '#64748b' : t >= 80 ? '#15803d' : '#b91c1c' }}>{t === null ? '—' : `${t} % satisfaits`}</span></div>
                <Champ label="Question ou thème" value={x.q} onChange={(v) => maj(i, { q: v })} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {ECHELLE.map((e) => <Champ key={e.k} label={e.nom} type="number" value={x[e.k]} onChange={(v) => maj(i, { [e.k]: Math.max(0, Number(v) || 0) })} />)}
                </div>
                {data.questions.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ questions: data.questions.filter((_, j) => j !== i) })}>Retirer</button></div>}
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ questions: [...data.questions, questionVide()] })}>+ Ajouter une question</button>
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Commentaires et actions</h2>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Commentaires marquants des clients</label>
          <ListeLignes items={data.verbatims} onChange={(v) => set({ verbatims: v })} placeholder="« … »" ajout="+ Ajouter un commentaire" />
          <div style={{ height: 12 }} />
          <Champ label="Actions décidées" multi value={data.actions} onChange={(v) => set({ actions: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    const qs = data.questions.map((x) => ({ ...x, t: total(x), p: taux(x) }));
    const somme = (k) => qs.reduce((s, x) => s + Number(x[k] || 0), 0);
    const tt = ECHELLE.reduce((s, e) => s + somme(e.k), 0);
    const global = tt ? Math.round(((somme('ts') + somme('s')) / tt) * 100) : null;
    const faibles = qs.filter((x) => x.p !== null && x.p < 80).sort((a, b) => a.p - b.p);
    const verbatims = data.verbatims.filter((v) => v.trim());
    return (
      <>
        <h2>L’enquête</h2>
        <div className="doc-encadre"><b>Période : </b>{data.periode || '—'}{data.methode ? `\n${data.methode}` : ''}</div>
        <h2>Résultat global</h2>
        <div className="evite-coupure" style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <div style={{ border: `3px solid ${global !== null && global < 80 ? '#e5484d' : '#16a34a'}`, borderRadius: 14, padding: '10px 18px', textAlign: 'center', minWidth: 130 }}>
            <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 32, color: global !== null && global < 80 ? '#e5484d' : '#15803d' }}>{global === null ? '—' : `${global} %`}</div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>de clients satisfaits</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', height: 18, borderRadius: 6, overflow: 'hidden', background: '#e8eef6' }}>
              {ECHELLE.map((e) => { const v = somme(e.k); return v ? <div key={e.k} style={{ width: `${(v / tt) * 100}%`, background: e.c }} /> : null; })}
            </div>
            <div className="legende">{ECHELLE.map((e) => <span key={e.k}><i style={{ background: e.c }} />{e.nom} : <b>{tt ? Math.round((somme(e.k) / tt) * 100) : 0} %</b></span>)}</div>
          </div>
        </div>
        <h2>Résultats par question</h2>
        <table className="compact">
          <thead><tr><th>Question</th><th style={{ width: 230 }}>Répartition</th><th style={{ width: 54, textAlign: 'center' }}>Rép.</th><th style={{ width: 80, textAlign: 'center' }}>Satisfaits</th></tr></thead>
          <tbody>
            {qs.map((x, i) => (
              <tr key={i}>
                <td><b><T v={x.q} /></b></td>
                <td style={{ verticalAlign: 'middle' }}><div style={{ display: 'flex', height: 12, borderRadius: 4, overflow: 'hidden', background: '#e8eef6' }}>{ECHELLE.map((e) => (x.t && x[e.k] ? <div key={e.k} style={{ width: `${(x[e.k] / x.t) * 100}%`, background: e.c }} /> : null))}</div></td>
                <td style={{ textAlign: 'center' }}>{x.t}</td>
                <td style={{ textAlign: 'center', fontWeight: 800, color: x.p === null ? '#94a3b8' : x.p < 80 ? '#b91c1c' : '#15803d' }}>{x.p === null ? '—' : `${x.p} %`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Points faibles (moins de 80 %)</h2>
        {faibles.length ? <div className="doc-encadre probleme evite-coupure">{faibles.map((x, i) => <div key={i}><b>{x.q || '—'}</b> : {x.p} % de satisfaits, {x.ps + x.ns} client(s) peu ou pas satisfait(s)</div>)}</div> : <div className="doc-encadre">Aucun : toutes les questions atteignent 80 %.</div>}
        {verbatims.length ? <><h2>Ce que disent les clients</h2><div className="doc-encadre evite-coupure">{verbatims.map((v, i) => <div key={i} style={{ fontStyle: 'italic' }}>{v}</div>)}</div></> : null}
        <h2>Actions décidées</h2>
        <div className="doc-encadre racine"><T v={data.actions} /></div>
      </>
    );
  },
};
