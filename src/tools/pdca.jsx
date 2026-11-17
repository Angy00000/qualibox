import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const actionVide = () => ({ action: '', resp: '', echeance: '', faite: false });
const DECISIONS = [['standardiser', 'Objectif atteint : on standardise'], ['ajuster', 'Partiellement atteint : on ajuste et on relance'], ['abandonner', 'Non atteint : on change d’approche']];
const dans = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

export const pdca = {
  id: 'pdca',
  nom: 'PDCA',
  ico: '🔄',
  court: 'Piloter une amélioration de bout en bout : planifier, faire, vérifier, agir.',
  fiche: (
    <>
      <p>Le PDCA, ou roue de Deming, est la base de l’amélioration continue (ISO 9001 chapitre 10). On tourne la roue en quatre temps :</p>
      <ul>
        <li><b>Plan</b> : fixer l’objectif chiffré, l’indicateur et les actions.</li>
        <li><b>Do</b> : réaliser les actions, sur une période définie.</li>
        <li><b>Check</b> : mesurer le résultat et le comparer à l’objectif.</li>
        <li><b>Act</b> : standardiser ce qui marche, ajuster ce qui ne marche pas, puis relancer un tour.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', constat: '', objectif: '', indicateur: '', initial: '', cible: '', actions: [actionVide()], realisation: '', resultat: '', obtenu: '', decision: 'standardiser', suite: '' }),
  exemple: () => ({
    titre: 'Réduire l’attente des clients au déjeuner', date: aujourdhui(), reference: 'PDCA-2026-02', redacteur: 'Mariama Ba', service: 'Restaurant — Salle et cuisine',
    constat: 'Au déjeuner, les clients attendent en moyenne 25 minutes entre la commande et le plat. Plusieurs partent avant d’être servis.',
    objectif: 'Servir chaque client en moins de 12 minutes au déjeuner', indicateur: 'Temps moyen commande → plat (minutes), relevé sur 30 tables par semaine', initial: '25 min', cible: '12 min',
    actions: [
      { action: 'Préparer la mise en place des plats du jour la veille au soir', resp: 'Chef cuisinier', echeance: dans(-30), faite: true },
      { action: 'Limiter le menu du déjeuner à 3 plats du jour', resp: 'Gérante', echeance: dans(-30), faite: true },
      { action: 'Ouvrir une deuxième caisse de 12 h à 14 h', resp: 'Responsable de salle', echeance: dans(-25), faite: true },
    ],
    realisation: 'Actions mises en place du 1er au 31 octobre 2026. Relevé du temps d’attente sur 30 tables par semaine.',
    resultat: 'Le temps moyen passe à 14 minutes. Plus aucun client parti sans être servi. Le vendredi reste au-dessus de 18 minutes.',
    obtenu: '14 min', decision: 'ajuster',
    suite: 'Standardiser la mise en place et le menu court (fiche affichée en cuisine). Ajouter un serveur en renfort le vendredi et refaire un tour de PDCA en novembre.',
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ actions: data.actions.map((a, j) => (j === i ? { ...a, ...patch } : a)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num" style={{ background: '#2563eb' }}>P</span>Plan · Planifier</h2>
          <Champ label="Constat de départ" multi rows={2} value={data.constat} onChange={(v) => set({ constat: v })} />
          <Champ label="Objectif" value={data.objectif} onChange={(v) => set({ objectif: v })} placeholder="Ex. : réduire l’attente à moins de 12 minutes" />
          <Champ label="Indicateur et façon de le mesurer" value={data.indicateur} onChange={(v) => set({ indicateur: v })} />
          <div className="deux">
            <Champ label="Valeur de départ" value={data.initial} onChange={(v) => set({ initial: v })} />
            <Champ label="Valeur visée" value={data.cible} onChange={(v) => set({ cible: v })} />
          </div>
          <h3 style={{ fontSize: 14.5, margin: '6px 0 10px' }}>Actions prévues</h3>
          {data.actions.map((a, i) => (
            <div className="risque-bloc" key={i}>
              <Champ label={`Action ${i + 1}`} value={a.action} onChange={(v) => maj(i, { action: v })} />
              <div className="deux">
                <Champ label="Responsable" value={a.resp} onChange={(v) => maj(i, { resp: v })} />
                <Champ label="Échéance" type="date" value={a.echeance} onChange={(v) => maj(i, { echeance: v })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 600, fontSize: 14 }}><input type="checkbox" checked={!!a.faite} onChange={(e) => maj(i, { faite: e.target.checked })} /> Réalisée</label>
                {data.actions.length > 1 && <button type="button" className="btn discret petit" onClick={() => set({ actions: data.actions.filter((_, j) => j !== i) })}>Retirer</button>}
              </div>
            </div>
          ))}
          <button type="button" className="btn secondaire petit" onClick={() => set({ actions: [...data.actions, actionVide()] })}>+ Ajouter une action</button>
        </div>
        <div className="panneau">
          <h2><span className="num" style={{ background: '#f59e0b' }}>D</span>Do · Faire</h2>
          <Champ label="Ce qui a été réalisé, et sur quelle période" multi value={data.realisation} onChange={(v) => set({ realisation: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num" style={{ background: '#16a34a' }}>C</span>Check · Vérifier</h2>
          <Champ label="Valeur obtenue" value={data.obtenu} onChange={(v) => set({ obtenu: v })} />
          <Champ label="Résultats observés" multi value={data.resultat} onChange={(v) => set({ resultat: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num" style={{ background: '#7c3aed' }}>A</span>Act · Agir</h2>
          <div className="champ">
            <label>Décision</label>
            <select value={data.decision} onChange={(e) => set({ decision: e.target.value })}>{DECISIONS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          </div>
          <Champ label="Standardisation et prochaines étapes" multi value={data.suite} onChange={(v) => set({ suite: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    const dec = DECISIONS.find(([k]) => k === data.decision)?.[1];
    const Q = ({ l, nom, coul, children }) => (
      <div style={{ border: `2px solid ${coul}`, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: coul, color: '#fff', padding: '7px 12px', fontFamily: 'Sora', fontWeight: 800, fontSize: 13 }}>{l} · {nom}</div>
        <div style={{ padding: '10px 12px', whiteSpace: 'pre-wrap', fontSize: 12.5 }}>{children}</div>
      </div>
    );
    return (
      <>
        <h2>Constat de départ</h2>
        <div className="doc-encadre probleme"><T v={data.constat} /></div>
        <h2>Objectif et indicateur</h2>
        <table className="evite-coupure">
          <thead><tr><th>Objectif</th><th>Indicateur</th><th style={{ width: 80 }}>Départ</th><th style={{ width: 80 }}>Visé</th><th style={{ width: 80 }}>Obtenu</th></tr></thead>
          <tbody><tr><td><b><T v={data.objectif} /></b></td><td><T v={data.indicateur} /></td><td><T v={data.initial} /></td><td><T v={data.cible} /></td><td><b><T v={data.obtenu} /></b></td></tr></tbody>
        </table>
        <h2>La roue PDCA</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Q l="P" nom="Planifier" coul="#2563eb">{data.actions.filter((a) => a.action.trim()).length} action(s) prévue(s) · objectif : {data.cible || '—'}</Q>
          <Q l="D" nom="Faire" coul="#f59e0b"><T v={data.realisation} /></Q>
          <Q l="A" nom="Agir" coul="#7c3aed"><b>{dec}</b>{data.suite ? `\n${data.suite}` : ''}</Q>
          <Q l="C" nom="Vérifier" coul="#16a34a"><T v={data.resultat} /></Q>
        </div>
        <h2>Plan d’actions</h2>
        <table>
          <thead><tr><th style={{ width: 30 }}>N°</th><th>Action</th><th style={{ width: 130 }}>Responsable</th><th style={{ width: 90 }}>Échéance</th><th style={{ width: 80 }}>État</th></tr></thead>
          <tbody>
            {data.actions.map((a, i) => (
              <tr key={i}><td>{i + 1}</td><td><T v={a.action} /></td><td><T v={a.resp} /></td><td>{dateFr(a.echeance) || '—'}</td>
                <td><span style={{ fontWeight: 800, fontSize: 11, color: a.faite ? '#15803d' : '#a16207' }}>{a.faite ? '✓ Réalisée' : 'À faire'}</span></td></tr>
            ))}
          </tbody>
        </table>
      </>
    );
  },
};
