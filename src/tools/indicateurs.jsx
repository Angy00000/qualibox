import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const n = (v) => { const x = Number(String(v ?? '').replace(/\s/g, '').replace(',', '.')); return Number.isFinite(x) && String(v ?? '').trim() !== '' ? x : null; };
const fmt = (x, d = 2) => (x === null || !Number.isFinite(x) ? '—' : x.toLocaleString('fr-FR', { maximumFractionDigits: d }));

/** Chaque calculateur : champs saisis, formule affichée, calcul et repère de lecture. */
export const CALCULS = [
  {
    k: 'nc', nom: 'Taux de non-conformité', ico: '❌',
    champs: [['nc', 'Produits non conformes'], ['total', 'Produits fabriqués ou contrôlés']],
    formule: 'Non conformes ÷ total × 100',
    calcul: (d) => (n(d.nc) !== null && n(d.total) ? { val: (n(d.nc) / n(d.total)) * 100, unite: '%', extra: `soit ${fmt((n(d.nc) / n(d.total)) * 1e6, 0)} ppm` } : null),
    lecture: (v) => (v <= 1 ? ['Bon', '#15803d'] : v <= 3 ? ['À surveiller', '#d97706'] : ['Élevé', '#e5484d']),
  },
  {
    k: 'rec', nom: 'Taux de réclamation client', ico: '📣',
    champs: [['rec', 'Réclamations reçues'], ['cmd', 'Commandes ou livraisons']],
    formule: 'Réclamations ÷ commandes × 100',
    calcul: (d) => (n(d.rec) !== null && n(d.cmd) ? { val: (n(d.rec) / n(d.cmd)) * 100, unite: '%' } : null),
    lecture: (v) => (v <= 1 ? ['Bon', '#15803d'] : v <= 3 ? ['À surveiller', '#d97706'] : ['Élevé', '#e5484d']),
  },
  {
    k: 'otd', nom: 'Livraisons à l’heure', ico: '🚚',
    champs: [['ok', 'Livraisons à la date promise'], ['liv', 'Livraisons totales']],
    formule: 'Livraisons à l’heure ÷ total × 100',
    calcul: (d) => (n(d.ok) !== null && n(d.liv) ? { val: (n(d.ok) / n(d.liv)) * 100, unite: '%' } : null),
    lecture: (v) => (v >= 95 ? ['Bon', '#15803d'] : v >= 85 ? ['À améliorer', '#d97706'] : ['Faible', '#e5484d']),
  },
  {
    k: 'trs', nom: 'TRS (rendement d’une machine)', ico: '⚙️',
    champs: [['ouverture', 'Temps d’ouverture (min)'], ['arrets', 'Temps d’arrêt : pannes, réglages (min)'], ['cadence', 'Cadence nominale (pièces / min)'], ['produites', 'Pièces produites'], ['bonnes', 'Pièces bonnes']],
    formule: 'Disponibilité × Performance × Qualité',
    calcul: (d) => {
      const o = n(d.ouverture), a = n(d.arrets) ?? 0, c = n(d.cadence), p = n(d.produites), b = n(d.bonnes);
      if (!o || !c || !p || b === null || o - a <= 0) return null;
      const dispo = (o - a) / o, perf = p / (c * (o - a)), qual = b / p;
      return { val: dispo * perf * qual * 100, unite: '%', extra: `Disponibilité ${fmt(dispo * 100, 1)} % · Performance ${fmt(perf * 100, 1)} % · Qualité ${fmt(qual * 100, 1)} %` };
    },
    lecture: (v) => (v >= 85 ? ['Très bon', '#15803d'] : v >= 60 ? ['Moyen', '#d97706'] : ['Faible', '#e5484d']),
  },
  {
    k: 'tf', nom: 'Taux de fréquence des accidents (TF)', ico: '🦺',
    champs: [['acc', 'Accidents du travail avec arrêt'], ['heures', 'Heures travaillées sur la période']],
    formule: 'Accidents avec arrêt × 1 000 000 ÷ heures travaillées',
    calcul: (d) => (n(d.acc) !== null && n(d.heures) ? { val: (n(d.acc) * 1e6) / n(d.heures), unite: '' } : null),
    lecture: (v) => (v === 0 ? ['Zéro accident', '#15803d'] : v <= 10 ? ['À surveiller', '#d97706'] : ['Élevé', '#e5484d']),
  },
  {
    k: 'tg', nom: 'Taux de gravité des accidents (TG)', ico: '🩹',
    champs: [['jours', 'Jours d’arrêt dus aux accidents'], ['heures2', 'Heures travaillées sur la période']],
    formule: 'Jours d’arrêt × 1 000 ÷ heures travaillées',
    calcul: (d) => (n(d.jours) !== null && n(d.heures2) ? { val: (n(d.jours) * 1000) / n(d.heures2), unite: '' } : null),
    lecture: (v) => (v === 0 ? ['Aucun arrêt', '#15803d'] : v <= 0.5 ? ['À surveiller', '#d97706'] : ['Élevé', '#e5484d']),
  },
];

export const indicateurs = {
  id: 'indicateurs',
  nom: 'Calculateurs d’indicateurs',
  ico: '🧮',
  court: 'Taux de non-conformité, réclamations, livraisons à l’heure, TRS, taux de fréquence et de gravité.',
  fiche: (
    <>
      <p>Les indicateurs montrent si vos processus atteignent leurs objectifs (ISO 9001 § 9.1, ISO 45001 § 9.1). Remplissez seulement les calculateurs utiles : les autres n’apparaîtront pas dans le PDF.</p>
      <ul>
        <li>Calculez toujours sur une période précise (un mois, un trimestre) pour comparer d’une période à l’autre.</li>
        <li><b>TRS</b> : 85 % est la référence mondiale ; beaucoup d’ateliers sont entre 40 et 60 %.</li>
        <li><b>TF</b> et <b>TG</b> sont les indicateurs de sécurité les plus utilisés.</li>
        <li>Les repères de couleur sont indicatifs : fixez vos propres objectifs.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', periode: '', v: {}, commentaire: '' }),
  exemple: () => ({
    titre: 'Tableau des indicateurs — octobre 2026', date: aujourdhui(), reference: 'IND-2026-10', redacteur: 'Cheikh Sow', service: 'Qualité — Unité d’eau en sachet', periode: 'Octobre 2026',
    v: { nc: 1100, total: 64000, rec: 9, cmd: 420, ok: 371, liv: 420, ouverture: 12480, arrets: 2150, cadence: 6, produites: 54200, bonnes: 53100, acc: 1, heures: 9200, jours: 6, heures2: 9200 },
    commentaire: 'Le TRS est freiné par les pannes de la soudeuse (2 150 minutes d’arrêt). Priorité : maintenance préventive de la soudeuse et réduction des rejets (voir le Pareto des défauts).',
  }),
  Formulaire({ data, set }) {
    const v = data.v || {};
    const maj = (k, x) => set({ v: { ...v, [k]: x } });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Période</h2>
          <Champ label="Période mesurée" value={data.periode} onChange={(x) => set({ periode: x })} placeholder="Ex. : octobre 2026" />
        </div>
        {CALCULS.map((c) => {
          const r = c.calcul(v); const l = r && c.lecture(r.val);
          return (
            <div className="panneau" key={c.k}>
              <h2><span style={{ fontSize: 20 }}>{c.ico}</span>{c.nom}</h2>
              <p className="aide">{c.formule}</p>
              <div className="deux">{c.champs.map(([k, lab]) => <Champ key={k} label={lab} value={v[k] ?? ''} onChange={(x) => maj(k, x)} />)}</div>
              {r && <p style={{ margin: '4px 0 0', fontWeight: 700 }}>Résultat : <span style={{ fontFamily: 'Sora', fontSize: 20, color: l[1] }}>{fmt(r.val)}{r.unite ? ` ${r.unite}` : ''}</span> <span className="niveau" style={{ background: l[1], color: '#fff', marginLeft: 6 }}>{l[0]}</span>{r.extra ? <span className="aide" style={{ display: 'block', margin: '4px 0 0' }}>{r.extra}</span> : null}</p>}
            </div>
          );
        })}
        <div className="panneau">
          <h2><span className="num">✓</span>Commentaire</h2>
          <Champ label="Lecture des résultats et actions" multi value={data.commentaire} onChange={(x) => set({ commentaire: x })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    const v = data.v || {};
    const res = CALCULS.map((c) => ({ c, r: c.calcul(v) })).filter((x) => x.r);
    return (
      <>
        <h2>Période</h2>
        <div className="doc-encadre"><b><T v={data.periode} /></b></div>
        <h2>Indicateurs</h2>
        {res.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {res.map(({ c, r }) => {
              const l = c.lecture(r.val);
              return (
                <div key={c.k} className="evite-coupure" style={{ border: '1px solid #dfe5ee', borderTop: `4px solid ${l[1]}`, borderRadius: 12, padding: '10px 14px' }}>
                  <div style={{ fontWeight: 800, fontSize: 12.5 }}>{c.ico} {c.nom}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '4px 0' }}>
                    <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 26, color: l[1] }}>{fmt(r.val)}{r.unite ? ` ${r.unite}` : ''}</span>
                    <span style={{ background: l[1], color: '#fff', borderRadius: 999, padding: '2px 8px', fontWeight: 800, fontSize: 10.5 }}>{l[0]}</span>
                  </div>
                  {r.extra && <div style={{ fontSize: 11, color: '#4a5770' }}>{r.extra}</div>}
                  <div style={{ fontSize: 10.5, color: '#8190a8', marginTop: 4 }}>{c.formule} · {c.champs.map(([k, lab]) => `${lab} : ${v[k] ?? '—'}`).join(' · ')}</div>
                </div>
              );
            })}
          </div>
        ) : <div className="doc-encadre doc-vide">Remplissez au moins un calculateur.</div>}
        <h2>Commentaire</h2>
        <div className="doc-encadre racine"><T v={data.commentaire} /></div>
      </>
    );
  },
};
