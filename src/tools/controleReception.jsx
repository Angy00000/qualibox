import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const CRITERES = [['quantite', 'Quantité'], ['emballage', 'Emballage intact'], ['etiquetage', 'Étiquetage et dates'], ['aspect', 'Aspect, odeur'], ['documents', 'Documents (BL, certificat)']];
const DECISIONS = {
  accepte: { nom: 'Acceptée', bg: '#dcfce7', fg: '#15803d' },
  reserve: { nom: 'Sous réserve', bg: '#fef9c3', fg: '#854d0e' },
  refuse: { nom: 'Refusée', bg: '#fde8e8', fg: '#b91c1c' },
};
const livraisonVide = () => ({ date: aujourdhui(), fournisseur: '', produit: '', lot: '', temp: '', tempMax: '', checks: Object.fromEntries(CRITERES.map(([k]) => [k, true])), decision: 'accepte', commentaire: '', visa: '' });
const dans = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const tempKo = (l) => l.temp !== '' && l.tempMax !== '' && Number(String(l.temp).replace(',', '.')) > Number(String(l.tempMax).replace(',', '.'));

export const controleReception = {
  id: 'controle-reception',
  nom: 'Contrôle à réception',
  ico: '📦',
  court: 'Vérifier chaque livraison (quantité, emballage, dates, température, documents) et décider : accepter ou refuser.',
  fiche: (
    <>
      <p>Le contrôle à réception est la première barrière contre les produits non conformes (ISO 9001 § 8.4.2, bonnes pratiques d’hygiène). Il est rapide : quelques minutes par livraison, devant le livreur.</p>
      <ul>
        <li>Vérifiez la quantité, l’état des emballages, les dates (DLC, DDM), l’aspect et les documents.</li>
        <li>Pour les produits frais ou surgelés, mesurez la <b>température</b> à cœur ou entre deux emballages.</li>
        <li>Refusez devant le livreur si un critère important n’est pas bon, et notez-le sur le bon de livraison.</li>
        <li>Les refus alimentent l’évaluation des fournisseurs.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', periode: '', livraisons: [livraisonVide()] }),
  exemple: () => ({
    titre: 'Fiche de contrôle à réception — cuisine', date: aujourdhui(), reference: 'CR-2026-46', redacteur: 'Fatou Sarr', service: 'Restaurant — Économat',
    periode: 'Semaine en cours',
    livraisons: [
      { date: dans(-6), fournisseur: 'Boucherie Touba', produit: 'Viande de bœuf (20 kg)', lot: 'BT-1106', temp: '3', tempMax: '4', checks: { quantite: true, emballage: true, etiquetage: true, aspect: true, documents: true }, decision: 'accepte', commentaire: '', visa: 'F. S.' },
      { date: dans(-5), fournisseur: 'Mareyeur Soumbédioune', produit: 'Thiof frais (15 kg)', lot: '—', temp: '6', tempMax: '2', checks: { quantite: true, emballage: true, etiquetage: false, aspect: true, documents: false }, decision: 'refuse', commentaire: 'Poisson à 6 °C sans glace, pas de bon de livraison.', visa: 'F. S.' },
      { date: dans(-4), fournisseur: 'Grossiste Sandaga', produit: 'Riz brisé (10 sacs)', lot: 'RZ-2210', temp: '', tempMax: '', checks: { quantite: true, emballage: false, etiquetage: true, aspect: true, documents: true }, decision: 'reserve', commentaire: '1 sac percé : retiré et avoir demandé.', visa: 'M. D.' },
      { date: dans(-3), fournisseur: 'Laiterie du Cap-Vert', produit: 'Yaourts et crème (60 pots)', lot: 'LCV-311', temp: '4', tempMax: '6', checks: { quantite: true, emballage: true, etiquetage: true, aspect: true, documents: true }, decision: 'accepte', commentaire: '', visa: 'F. S.' },
      { date: dans(-2), fournisseur: 'Frigo Import', produit: 'Frites surgelées (40 kg)', lot: 'FI-0925', temp: '-19', tempMax: '-18', checks: { quantite: false, emballage: true, etiquetage: true, aspect: true, documents: true }, decision: 'reserve', commentaire: '36 kg livrés sur 40 : complément demain.', visa: 'M. D.' },
      { date: dans(-1), fournisseur: 'Maraîcher des Niayes', produit: 'Légumes (oignons, carottes, tomates)', lot: '—', temp: '', tempMax: '', checks: { quantite: true, emballage: true, etiquetage: true, aspect: true, documents: true }, decision: 'accepte', commentaire: '', visa: 'F. S.' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ livraisons: data.livraisons.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Période</h2>
          <Champ label="Période" value={data.periode} onChange={(v) => set({ periode: v })} placeholder="Ex. : semaine 46" />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Livraisons</h2>
          {data.livraisons.map((l, i) => {
            const d = DECISIONS[l.decision];
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Livraison {i + 1}</b><span className="niveau" style={{ background: d.bg, color: d.fg }}>{d.nom}</span></div>
                <div className="trois">
                  <Champ label="Date" type="date" value={l.date} onChange={(v) => maj(i, { date: v })} />
                  <Champ label="Fournisseur" value={l.fournisseur} onChange={(v) => maj(i, { fournisseur: v })} />
                  <Champ label="N° de lot" value={l.lot} onChange={(v) => maj(i, { lot: v })} />
                </div>
                <Champ label="Produit et quantité" value={l.produit} onChange={(v) => maj(i, { produit: v })} />
                <div className="deux">
                  <Champ label="Température mesurée (°C)" value={l.temp} onChange={(v) => maj(i, { temp: v })} placeholder="Vide si sans objet" />
                  <Champ label="Température maximale (°C)" value={l.tempMax} onChange={(v) => maj(i, { tempMax: v })} />
                </div>
                {tempKo(l) && <p className="aide" style={{ color: '#b91c1c', marginTop: -6 }}>Température trop haute : le produit devrait être refusé.</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {CRITERES.map(([k, n]) => <button key={k} type="button" className={`puce${l.checks[k] ? ' active' : ''}`} onClick={() => maj(i, { checks: { ...l.checks, [k]: !l.checks[k] } })}>{l.checks[k] ? '✓' : '✗'} {n}</button>)}
                </div>
                <div className="deux">
                  <div className="champ"><label>Décision</label><select value={l.decision} onChange={(e) => maj(i, { decision: e.target.value })}>{Object.entries(DECISIONS).map(([k, v]) => <option key={k} value={k}>{v.nom}</option>)}</select></div>
                  <Champ label="Visa (initiales)" value={l.visa} onChange={(v) => maj(i, { visa: v })} />
                </div>
                <Champ label="Commentaire" value={l.commentaire} onChange={(v) => maj(i, { commentaire: v })} />
                {data.livraisons.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ livraisons: data.livraisons.filter((_, j) => j !== i) })}>Retirer</button></div>}
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ livraisons: [...data.livraisons, livraisonVide()] })}>+ Ajouter une livraison</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const l = [...data.livraisons].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    const n = (k) => l.filter((x) => x.decision === k).length;
    const ok = l.length ? Math.round((n('accepte') / l.length) * 100) : 0;
    const coche = (v) => <span style={{ fontWeight: 900, color: v ? '#15803d' : '#b91c1c' }}>{v ? '✓' : '✗'}</span>;
    return (
      <>
        <h2>Bilan {data.periode ? `— ${data.periode}` : ''}</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {[['Livraisons', l.length, '#0a0f0c'], ...Object.entries(DECISIONS).map(([k, v]) => [v.nom, n(k), v.fg]), ['Conformes', `${ok} %`, ok < 90 ? '#e5484d' : '#15803d']].map(([t, v, c]) => (
            <div key={t} style={{ border: '1px solid #dfe5ee', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>{t}</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 21, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <h2>Contrôles</h2>
        <table className="amdec">
          <thead><tr><th style={{ width: 50 }}>Date</th><th>Fournisseur et produit</th><th style={{ width: 56, textAlign: 'center' }}>T° / max</th>{CRITERES.map(([k, n]) => <th key={k} style={{ width: 46, textAlign: 'center', padding: '7px 2px' }}>{n.split(' ')[0]}</th>)}<th style={{ width: 70 }}>Décision</th><th style={{ width: 30 }}>Visa</th></tr></thead>
          <tbody>
            {l.map((x, i) => { const d = DECISIONS[x.decision]; return (
              <tr key={i}>
                <td>{dateFr(x.date) || '—'}</td>
                <td><b><T v={x.fournisseur} /></b><div>{x.produit}{x.lot && x.lot !== '—' ? ` · lot ${x.lot}` : ''}</div>{x.commentaire ? <div style={{ color: '#b45309' }}>→ {x.commentaire}</div> : null}</td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: tempKo(x) ? '#b91c1c' : undefined }}>{x.temp !== '' ? `${x.temp} / ${x.tempMax} °C` : '—'}</td>
                {CRITERES.map(([k]) => <td key={k} style={{ textAlign: 'center' }}>{coche(x.checks[k])}</td>)}
                <td><span style={{ background: d.bg, color: d.fg, borderRadius: 999, padding: '2px 7px', fontWeight: 800, whiteSpace: 'nowrap' }}>{d.nom}</span></td>
                <td>{x.visa}</td>
              </tr>
            ); })}
          </tbody>
        </table>
        <div className="legende"><span>✓ conforme · ✗ non conforme</span><span>Produits frais : refus au-dessus de la température maximale</span></div>
      </>
    );
  },
};
