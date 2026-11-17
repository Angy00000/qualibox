import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const RESULTATS = { C: 'Conforme', NC: 'Non conforme', '': 'Pas encore étalonné' };
const ETATS = {
  ok: { nom: 'À jour', bg: '#dcfce7', fg: '#15803d' },
  bientot: { nom: 'Bientôt', bg: '#fef9c3', fg: '#854d0e' },
  retard: { nom: 'En retard', bg: '#e5484d', fg: '#fff' },
  bloque: { nom: 'Hors service', bg: '#1b2538', fg: '#fff' },
};
const instrumentVide = () => ({ code: '', designation: '', lieu: '', plage: '', tolerance: '', frequence: 12, dernier: '', resultat: '', organisme: '' });
const dans = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

export const prochaine = (i) => {
  if (!i.dernier) return '';
  const d = new Date(i.dernier); d.setMonth(d.getMonth() + Number(i.frequence || 12));
  return d.toISOString().slice(0, 10);
};
const etat = (i) => {
  if (i.resultat === 'NC') return 'bloque';
  const p = prochaine(i);
  if (!p || p < aujourdhui()) return 'retard';
  return p <= dans(30) ? 'bientot' : 'ok';
};

export const etalonnage = {
  id: 'etalonnage',
  nom: 'Suivi de l’étalonnage',
  ico: '⚖️',
  court: 'Lister vos instruments de mesure, leurs dates d’étalonnage et voir ceux en retard.',
  fiche: (
    <>
      <p>Balances, thermomètres, manomètres, pieds à coulisse… Un instrument faux donne des mesures fausses. L’ISO 9001 (§ 7.1.5) et le HACCP demandent de les <b>étalonner</b> ou vérifier à intervalles définis.</p>
      <ul>
        <li>Donnez un code unique à chaque instrument et collez-le dessus.</li>
        <li>Indiquez la tolérance acceptée, la fréquence et la date du dernier étalonnage : la prochaine date est calculée.</li>
        <li>En retard ou non conforme : on n’utilise plus l’instrument, et on vérifie les mesures faites depuis le dernier étalonnage correct.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', instruments: [instrumentVide()] }),
  exemple: () => ({
    titre: 'Suivi des instruments de mesure', date: aujourdhui(), reference: 'ETAL-2026', redacteur: 'Lamine Seck', service: 'Qualité — Usine de Mbour',
    instruments: [
      { code: 'BAL-01', designation: 'Balance de réception 300 kg', lieu: 'Quai de réception', plage: '0 à 300 kg', tolerance: '± 0,1 kg', frequence: 12, dernier: dans(-200), resultat: 'C', organisme: 'Laboratoire de métrologie agréé' },
      { code: 'BAL-02', designation: 'Balance de conditionnement', lieu: 'Salle de conditionnement', plage: '0 à 15 kg', tolerance: '± 5 g', frequence: 6, dernier: dans(-165), resultat: 'C', organisme: 'Laboratoire de métrologie agréé' },
      { code: 'TH-01', designation: 'Thermomètre sonde', lieu: 'Découpe', plage: '−40 à +120 °C', tolerance: '± 0,5 °C', frequence: 6, dernier: dans(-60), resultat: 'C', organisme: 'Vérification interne (glace fondante)' },
      { code: 'TH-02', designation: 'Enregistreur de la chambre froide', lieu: 'Chambre froide négative', plage: '−30 à +10 °C', tolerance: '± 1 °C', frequence: 12, dernier: dans(-400), resultat: 'C', organisme: 'Laboratoire de métrologie agréé' },
      { code: 'TH-03', designation: 'Thermomètre du tunnel de congélation', lieu: 'Congélation', plage: '−50 à 0 °C', tolerance: '± 1 °C', frequence: 12, dernier: dans(-20), resultat: 'NC', organisme: 'Laboratoire de métrologie agréé' },
      { code: 'PH-01', designation: 'pH-mètre de la station d’épuration', lieu: 'Station d’épuration', plage: 'pH 0 à 14', tolerance: '± 0,1', frequence: 3, dernier: dans(-30), resultat: 'C', organisme: 'Vérification interne (solutions tampons)' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ instruments: data.instruments.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    return (
      <div className="panneau">
        <h2><span className="num">1</span>Instruments de mesure</h2>
        {data.instruments.map((x, i) => {
          const e = ETATS[etat(x)];
          return (
            <div className="risque-bloc" key={i}>
              <div className="rtete"><b>{x.code || `Instrument ${i + 1}`}</b><span className="niveau" style={{ background: e.bg, color: e.fg }}>{e.nom}{prochaine(x) ? ` · ${dateFr(prochaine(x))}` : ''}</span></div>
              <div className="deux">
                <Champ label="Code" value={x.code} onChange={(v) => maj(i, { code: v })} />
                <Champ label="Désignation" value={x.designation} onChange={(v) => maj(i, { designation: v })} />
              </div>
              <div className="trois">
                <Champ label="Lieu" value={x.lieu} onChange={(v) => maj(i, { lieu: v })} />
                <Champ label="Plage de mesure" value={x.plage} onChange={(v) => maj(i, { plage: v })} />
                <Champ label="Tolérance" value={x.tolerance} onChange={(v) => maj(i, { tolerance: v })} />
              </div>
              <div className="trois">
                <Champ label="Fréquence (mois)" type="number" value={x.frequence} onChange={(v) => maj(i, { frequence: Math.max(1, Number(v) || 12) })} />
                <Champ label="Dernier étalonnage" type="date" value={x.dernier} onChange={(v) => maj(i, { dernier: v })} />
                <div className="champ"><label>Résultat</label><select value={x.resultat} onChange={(ev) => maj(i, { resultat: ev.target.value })}>{Object.entries(RESULTATS).map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></div>
              </div>
              <Champ label="Organisme ou méthode" value={x.organisme} onChange={(v) => maj(i, { organisme: v })} />
              {data.instruments.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ instruments: data.instruments.filter((_, j) => j !== i) })}>Retirer</button></div>}
            </div>
          );
        })}
        <button type="button" className="btn secondaire" onClick={() => set({ instruments: [...data.instruments, instrumentVide()] })}>+ Ajouter un instrument</button>
      </div>
    );
  },
  Document({ data }) {
    const liste = data.instruments.map((x) => ({ ...x, e: etat(x), p: prochaine(x) })).sort((a, b) => (a.p || '').localeCompare(b.p || ''));
    const n = (k) => liste.filter((x) => x.e === k).length;
    const alertes = liste.filter((x) => x.e === 'retard' || x.e === 'bloque');
    return (
      <>
        <h2>Situation au {dateFr(aujourdhui())}</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {[['Instruments', liste.length, '#0a0f0c'], ...Object.entries(ETATS).map(([k, v]) => [v.nom, n(k), k === 'ok' ? '#15803d' : k === 'bientot' ? '#a16207' : k === 'retard' ? '#e5484d' : '#1b2538'])].map(([l, v, c]) => (
            <div key={l} style={{ border: '1px solid #dfe5ee', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>{l}</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 22, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <h2>Liste des instruments</h2>
        <table className="amdec">
          <thead><tr><th style={{ width: 48 }}>Code</th><th>Instrument</th><th style={{ width: 82 }}>Plage</th><th style={{ width: 54 }}>Tolérance</th><th style={{ width: 38, textAlign: 'center' }}>Fréq.</th><th style={{ width: 60 }}>Dernier</th><th style={{ width: 62 }}>Résultat</th><th style={{ width: 60 }}>Prochain</th><th style={{ width: 68 }}>État</th></tr></thead>
          <tbody>
            {liste.map((x, i) => (
              <tr key={i}>
                <td><b>{x.code || '—'}</b></td>
                <td><b><T v={x.designation} /></b><div style={{ color: '#66748b' }}>{[x.lieu, x.organisme].filter(Boolean).join(' · ')}</div></td>
                <td>{x.plage}</td><td>{x.tolerance}</td><td style={{ textAlign: 'center' }}>{x.frequence} m</td>
                <td>{dateFr(x.dernier) || '—'}</td>
                <td style={{ color: x.resultat === 'NC' ? '#b91c1c' : undefined, fontWeight: x.resultat === 'NC' ? 800 : 400 }}>{RESULTATS[x.resultat]}</td>
                <td style={{ fontWeight: 700 }}>{dateFr(x.p) || '—'}</td>
                <td><span style={{ background: ETATS[x.e].bg, color: ETATS[x.e].fg, borderRadius: 999, padding: '2px 7px', fontWeight: 800, whiteSpace: 'nowrap' }}>{ETATS[x.e].nom}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>À traiter tout de suite ({alertes.length})</h2>
        {alertes.length
          ? <div className="doc-encadre probleme evite-coupure">{alertes.map((x, i) => <div key={i}><b>{x.code} — {x.designation}</b> : {x.e === 'bloque' ? 'non conforme, à retirer de l’usage, réparer ou remplacer ; vérifier les mesures faites avec.' : 'étalonnage dépassé, à planifier sans attendre.'}</div>)}</div>
          : <div className="doc-encadre">Tous les instruments sont à jour.</div>}
      </>
    );
  },
};
