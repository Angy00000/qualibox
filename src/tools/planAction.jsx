import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

export const STATUTS = {
  a_faire: { nom: 'À faire', bg: '#e2e8f0', fg: '#334155' },
  en_cours: { nom: 'En cours', bg: '#dbeafe', fg: '#1d4ed8' },
  fait: { nom: 'Fait', bg: '#dcfce7', fg: '#15803d' },
  bloque: { nom: 'Bloqué', bg: '#fde8e8', fg: '#b91c1c' },
};
const ORIGINES = ['Audit interne', 'Audit externe', 'Réclamation client', 'Non-conformité', 'Revue de direction', 'Analyse des risques', 'Idée d’amélioration', 'Autre'];

const actionVide = () => ({ action: '', origine: 'Audit interne', resp: '', echeance: '', statut: 'a_faire', avancement: 0, preuve: '' });
const dans = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const enRetard = (a) => a.statut !== 'fait' && a.echeance && a.echeance < aujourdhui();

export const planAction = {
  id: 'plan-action',
  nom: 'Plan d’action',
  ico: '📋',
  court: 'Qui fait quoi, pour quand, avec le suivi de l’avancement et des retards.',
  fiche: (
    <>
      <p>Le plan d’action rassemble toutes les actions qualité en un seul tableau : après un audit, une réclamation, une non-conformité ou une revue de direction. C’est l’outil qu’un auditeur demande en premier.</p>
      <ul>
        <li>Une action = un verbe + un résultat vérifiable (« Former les 6 caissiers au contrôle des billets »).</li>
        <li>Un seul responsable par action, avec une échéance réaliste.</li>
        <li>Mettez à jour le statut et l’avancement chaque semaine ; les retards ressortent en rouge.</li>
        <li>Une action n’est « faite » que si l’on a une preuve (document, photo, enregistrement).</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', contexte: '', actions: [actionVide()] }),
  exemple: () => ({
    titre: 'Plan d’action suite à l’audit interne ISO 9001', date: aujourdhui(), reference: 'PA-2026-009', redacteur: 'Ousmane Kane', service: 'Direction qualité — Imprimerie',
    contexte: 'Audit interne ISO 9001 du 20 octobre 2026 : 3 non-conformités et 2 observations. Objectif : tout traiter avant l’audit de certification de février 2027.',
    actions: [
      { action: 'Mettre à jour la liste des documents en vigueur et retirer les anciennes versions des ateliers', origine: 'Audit interne', resp: 'Responsable qualité', echeance: dans(-5), statut: 'fait', avancement: 100, preuve: 'Liste maîtresse v3 du 10/11' },
      { action: 'Étalonner les 4 balances de l’atelier et créer un planning d’étalonnage annuel', origine: 'Audit interne', resp: 'Responsable maintenance', echeance: dans(-2), statut: 'en_cours', avancement: 50, preuve: '2 certificats reçus' },
      { action: 'Évaluer les 8 fournisseurs principaux (papier, encre, plaques)', origine: 'Audit interne', resp: 'Responsable achats', echeance: dans(20), statut: 'en_cours', avancement: 40, preuve: '' },
      { action: 'Mettre en place une enquête de satisfaction client trimestrielle', origine: 'Revue de direction', resp: 'Responsable commercial', echeance: dans(35), statut: 'a_faire', avancement: 0, preuve: '' },
      { action: 'Former les 12 opérateurs au traitement des produits non conformes', origine: 'Non-conformité', resp: 'Chef d’atelier', echeance: dans(28), statut: 'a_faire', avancement: 0, preuve: '' },
      { action: 'Réparer la climatisation de la salle des plaques', origine: 'Réclamation client', resp: 'Directeur technique', echeance: dans(-10), statut: 'bloque', avancement: 20, preuve: 'Attente de la pièce' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ actions: data.actions.map((a, j) => (j === i ? { ...a, ...patch } : a)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Contexte</h2>
          <Champ label="Origine du plan et objectif" multi rows={2} value={data.contexte} onChange={(v) => set({ contexte: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Les actions</h2>
          {data.actions.map((a, i) => {
            const s = STATUTS[a.statut];
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Action {i + 1}</b><span className="niveau" style={{ background: enRetard(a) ? '#e5484d' : s.bg, color: enRetard(a) ? '#fff' : s.fg }}>{enRetard(a) ? 'En retard' : s.nom}</span></div>
                <Champ label="Action" multi rows={2} value={a.action} onChange={(v) => maj(i, { action: v })} />
                <div className="deux">
                  <div className="champ"><label>Origine</label><select value={a.origine} onChange={(e) => maj(i, { origine: e.target.value })}>{ORIGINES.map((o) => <option key={o}>{o}</option>)}</select></div>
                  <Champ label="Responsable" value={a.resp} onChange={(v) => maj(i, { resp: v })} />
                </div>
                <div className="trois">
                  <Champ label="Échéance" type="date" value={a.echeance} onChange={(v) => maj(i, { echeance: v })} />
                  <div className="champ"><label>Statut</label><select value={a.statut} onChange={(e) => maj(i, { statut: e.target.value, avancement: e.target.value === 'fait' ? 100 : a.avancement })}>{Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.nom}</option>)}</select></div>
                  <div className="champ"><label>Avancement : {a.avancement} %</label><input type="range" min="0" max="100" step="10" value={a.avancement} onChange={(e) => maj(i, { avancement: Number(e.target.value) })} style={{ padding: 0 }} /></div>
                </div>
                <Champ label="Preuve / commentaire" value={a.preuve} onChange={(v) => maj(i, { preuve: v })} />
                {data.actions.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ actions: data.actions.filter((_, j) => j !== i) })}>Retirer cette action</button></div>}
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ actions: [...data.actions, actionVide()] })}>+ Ajouter une action</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const n = data.actions.length || 1;
    const compte = (k) => data.actions.filter((a) => a.statut === k).length;
    const retards = data.actions.filter(enRetard).length;
    const global = Math.round(data.actions.reduce((s, a) => s + Number(a.avancement || 0), 0) / n);
    const tuiles = [['Actions', data.actions.length, '#0a0f0c'], ['Faites', compte('fait'), '#15803d'], ['En cours', compte('en_cours'), '#1d4ed8'], ['En retard', retards, '#e5484d'], ['Avancement', `${global} %`, '#16a34a']];
    return (
      <>
        <h2>Contexte</h2>
        <div className="doc-encadre"><T v={data.contexte} /></div>
        <h2>Tableau de bord</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {tuiles.map(([l, v, c]) => (
            <div key={l} style={{ border: '1px solid #dfe5ee', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>{l}</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 22, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="evite-coupure" style={{ height: 10, borderRadius: 6, background: '#e8eef6', marginTop: 10, overflow: 'hidden' }}><div style={{ width: `${global}%`, height: '100%', background: '#16a34a' }} /></div>
        <h2>Actions</h2>
        <table>
          <thead><tr><th style={{ width: 24 }}>N°</th><th>Action</th><th style={{ width: 92 }}>Origine</th><th style={{ width: 100 }}>Responsable</th><th style={{ width: 72 }}>Échéance</th><th style={{ width: 86 }}>Statut</th></tr></thead>
          <tbody>
            {data.actions.map((a, i) => {
              const s = STATUTS[a.statut]; const r = enRetard(a);
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td><b><T v={a.action} /></b>{a.preuve ? <div style={{ color: '#66748b', fontSize: 11 }}>{a.preuve}</div> : null}
                    <div style={{ height: 5, borderRadius: 3, background: '#e8eef6', marginTop: 5, width: 160 }}><div style={{ width: `${a.avancement}%`, height: '100%', borderRadius: 3, background: '#16a34a' }} /></div></td>
                  <td style={{ fontSize: 11 }}>{a.origine}</td><td><T v={a.resp} /></td>
                  <td style={{ color: r ? '#e5484d' : undefined, fontWeight: r ? 700 : 400 }}>{dateFr(a.echeance) || '—'}</td>
                  <td><span style={{ background: r ? '#e5484d' : s.bg, color: r ? '#fff' : s.fg, borderRadius: 999, padding: '2px 8px', fontWeight: 800, fontSize: 10.5, whiteSpace: 'nowrap' }}>{r ? 'En retard' : s.nom}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  },
};
