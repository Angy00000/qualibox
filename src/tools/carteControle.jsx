import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const nombre = (v) => { const n = Number(String(v).replace(',', '.').trim()); return Number.isFinite(n) ? n : null; };
export const lireMesures = (txt) => String(txt || '').split(/[\s;]+/).map(nombre).filter((n) => n !== null);
const fmt = (n, d = 2) => (n === null || n === undefined || !Number.isFinite(n) ? '—' : n.toLocaleString('fr-FR', { maximumFractionDigits: d }));

/** Carte des valeurs individuelles et étendues mobiles (I-MR) : limites à ±3 sigma, règles de détection simples, capabilité. */
export function analyseCarte(valeurs, lsi, lss) {
  const n = valeurs.length;
  if (n < 2) return null;
  const moy = valeurs.reduce((s, v) => s + v, 0) / n;
  const mr = valeurs.slice(1).map((v, i) => Math.abs(v - valeurs[i]));
  const mrMoy = mr.reduce((s, v) => s + v, 0) / mr.length;
  const sigma = mrMoy / 1.128;
  const lsc = moy + 2.66 * mrMoy, lic = moy - 2.66 * mrMoy;
  const horsLimites = valeurs.map((v, i) => (v > lsc || v < lic ? i : -1)).filter((i) => i >= 0);
  // Série de 7 points ou plus du même côté de la moyenne
  const series = new Set();
  let debut = 0;
  for (let i = 1; i <= n; i++) {
    const memeCote = i < n && Math.sign(valeurs[i] - moy) === Math.sign(valeurs[debut] - moy) && valeurs[i] !== moy;
    if (!memeCote) { if (i - debut >= 7) for (let k = debut; k < i; k++) series.add(k); debut = i; }
  }
  const a = nombre(lsi), b = nombre(lss);
  const cp = a !== null && b !== null && sigma > 0 ? (b - a) / (6 * sigma) : null;
  const cpk = sigma > 0 && (a !== null || b !== null) ? Math.min(b !== null ? (b - moy) / (3 * sigma) : Infinity, a !== null ? (moy - a) / (3 * sigma) : Infinity) : null;
  const horsSpec = valeurs.filter((v) => (a !== null && v < a) || (b !== null && v > b)).length;
  return { n, moy, mrMoy, sigma, lsc, lic, horsLimites, series: [...series], cp, cpk, a, b, horsSpec, min: Math.min(...valeurs), max: Math.max(...valeurs) };
}

function Graphique({ valeurs, r, cible }) {
  const W = 698, H = 280, g = 52, d = 70, h = 16, bas = 30;
  const lw = W - g - d, lh = H - h - bas;
  const bornes = [r.lic, r.lsc, r.min, r.max, r.a, r.b, cible].filter((v) => v !== null && v !== undefined && Number.isFinite(v));
  let lo = Math.min(...bornes), hi = Math.max(...bornes); const marge = (hi - lo) * 0.08 || 1; lo -= marge; hi += marge;
  const x = (i) => g + (valeurs.length > 1 ? (lw * i) / (valeurs.length - 1) : lw / 2);
  const y = (v) => h + lh - ((v - lo) / (hi - lo)) * lh;
  const alerte = new Set([...r.horsLimites, ...r.series]);
  const Ligne = ({ v, coul, lab, pointille }) => (v === null || v === undefined ? null : (
    <g><line x1={g} x2={W - d} y1={y(v)} y2={y(v)} stroke={coul} strokeWidth="1.5" strokeDasharray={pointille ? '6 4' : undefined} />
      <text x={W - d + 6} y={y(v) + 4} fontSize="10" fill={coul} fontWeight="700">{lab} {fmt(v)}</text></g>));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block' }}>
      <rect x={g} y={y(r.lsc)} width={lw} height={Math.max(0, y(r.lic) - y(r.lsc))} fill="#f0fdf4" />
      <Ligne v={r.lsc} coul="#e5484d" lab="LSC" pointille />
      <Ligne v={r.lic} coul="#e5484d" lab="LIC" pointille />
      <Ligne v={r.moy} coul="#16a34a" lab="Moy." />
      <Ligne v={r.b} coul="#7c3aed" lab="LSS" />
      <Ligne v={r.a} coul="#7c3aed" lab="LSI" />
      <polyline points={valeurs.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke="#0a0f0c" strokeWidth="1.6" />
      {valeurs.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={alerte.has(i) ? 4.5 : 3} fill={alerte.has(i) ? '#e5484d' : '#0a0f0c'} />)}
      {valeurs.map((_, i) => ((i + 1) % Math.ceil(valeurs.length / 15) === 0 || i === 0 ? <text key={i} x={x(i)} y={H - 10} fontSize="9.5" fill="#8190a8" textAnchor="middle">{i + 1}</text> : null))}
      <line x1={g} x2={g} y1={h} y2={h + lh} stroke="#c9d4e3" />
    </svg>
  );
}

export const carteControle = {
  id: 'carte-controle',
  nom: 'Carte de contrôle',
  ico: '📈',
  court: 'Surveiller une mesure dans le temps, repérer les dérives et calculer la capabilité (Cp, Cpk).',
  fiche: (
    <>
      <p>La carte de contrôle (maîtrise statistique des procédés, MSP) montre si un procédé est <b>stable</b>. Elle trace chaque mesure avec la moyenne et deux limites de contrôle calculées à partir des données (carte des valeurs individuelles).</p>
      <ul>
        <li>Saisissez au moins 20 mesures dans l’ordre où elles ont été prises (poids, température, volume…).</li>
        <li>Un point hors des limites de contrôle (LSC, LIC), ou 7 points de suite du même côté de la moyenne, signale une cause spéciale à rechercher. Ces points sont en rouge.</li>
        <li>Les limites de spécification (LSI, LSS) sont celles du client ou de la réglementation : elles servent au calcul de la capabilité.</li>
        <li>Cpk ≥ 1,33 : procédé capable. Entre 1 et 1,33 : limite. Moins de 1 : des produits sortent des spécifications.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', caracteristique: '', unite: '', cible: '', lsi: '', lss: '', mesures: '', analyse: '' }),
  exemple: () => ({
    titre: 'Poids des baguettes — four n°2', date: aujourdhui(), reference: 'MSP-2026-03', redacteur: 'Moussa Diop', service: 'Production — Boulangerie',
    caracteristique: 'Poids d’une baguette après cuisson (1 baguette prélevée toutes les 30 minutes)', unite: 'g', cible: '250', lsi: '240', lss: '260',
    mesures: '251 249 252 248 250 253 247 251 250 249 252 254 250 248 251 253 255 256 254 257 255 256 252 250 249',
    analyse: 'Le procédé dérive vers le haut à partir de la mesure 16 (pâte plus lourde après le changement de sac de farine). Action : vérifier le réglage de la diviseuse à chaque changement de lot de farine.',
  }),
  Formulaire({ data, set }) {
    const v = lireMesures(data.mesures);
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>La mesure suivie</h2>
          <Champ label="Caractéristique mesurée et méthode de prélèvement" multi rows={2} value={data.caracteristique} onChange={(x) => set({ caracteristique: x })} />
          <div className="deux">
            <Champ label="Unité" value={data.unite} onChange={(x) => set({ unite: x })} placeholder="Ex. : g, °C, ml" />
            <Champ label="Valeur cible" value={data.cible} inputMode="decimal" onChange={(x) => set({ cible: x })} />
          </div>
          <div className="deux">
            <Champ label="Limite de spécification inférieure (LSI)" value={data.lsi} onChange={(x) => set({ lsi: x })} />
            <Champ label="Limite de spécification supérieure (LSS)" value={data.lss} onChange={(x) => set({ lss: x })} />
          </div>
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Les mesures</h2>
          <Champ label="Mesures dans l’ordre, séparées par des espaces ou des retours à la ligne" multi rows={5} value={data.mesures} onChange={(x) => set({ mesures: x })} placeholder="251 249 252 248…" />
          <p className="aide">{v.length} mesure(s) lue(s){v.length < 20 ? ' · au moins 20 conseillées' : ''}. Les virgules décimales sont acceptées (12,5).</p>
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Analyse</h2>
          <Champ label="Interprétation et actions" multi value={data.analyse} onChange={(x) => set({ analyse: x })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    const v = lireMesures(data.mesures);
    const r = analyseCarte(v, data.lsi, data.lss);
    const u = data.unite ? ` ${data.unite}` : '';
    const stable = r && !r.horsLimites.length && !r.series.length;
    const verdictCpk = !r || r.cpk === null ? null : r.cpk >= 1.33 ? ['Capable', '#15803d'] : r.cpk >= 1 ? ['Juste capable', '#d97706'] : ['Non capable', '#e5484d'];
    return (
      <>
        <h2>Caractéristique suivie</h2>
        <div className="doc-encadre"><b><T v={data.caracteristique} /></b>{data.cible ? ` · cible ${data.cible}${u}` : ''}{data.lsi || data.lss ? ` · spécification ${data.lsi || '—'} à ${data.lss || '—'}${u}` : ''}</div>
        <h2>Carte des valeurs individuelles</h2>
        {r ? <Graphique valeurs={v} r={r} cible={nombre(data.cible)} /> : <div className="doc-encadre doc-vide">Saisissez au moins 2 mesures.</div>}
        {r && (
          <>
            <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 10 }}>
              {[['Mesures', r.n], ['Moyenne', `${fmt(r.moy)}${u}`], ['Écart type estimé', `${fmt(r.sigma)}${u}`], ['Limites de contrôle', `${fmt(r.lic, 1)} – ${fmt(r.lsc, 1)}`],
                ['Cp', fmt(r.cp)], ['Cpk', fmt(r.cpk)], ['Hors spécification', `${r.horsSpec} / ${r.n}`], ['Procédé', stable ? 'Stable' : 'Instable']].map(([l, val]) => (
                <div key={l} style={{ border: '1px solid #dfe5ee', borderRadius: 10, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>{l}</div>
                  <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 16, color: l === 'Procédé' ? (stable ? '#15803d' : '#e5484d') : l === 'Cpk' && verdictCpk ? verdictCpk[1] : '#0a0f0c' }}>{val}</div>
                </div>
              ))}
            </div>
            <div className={`doc-encadre evite-coupure ${stable ? '' : 'probleme'}`} style={{ marginTop: 10 }}>
              {stable ? 'Aucun signal de dérive : le procédé est sous contrôle statistique.' : <>
                {r.horsLimites.length > 0 && <div><b>Hors limites de contrôle :</b> mesure(s) n° {r.horsLimites.map((i) => i + 1).join(', ')}.</div>}
                {r.series.length > 0 && <div><b>Série de 7 points ou plus du même côté de la moyenne :</b> mesures n° {r.series[0] + 1} à {r.series[r.series.length - 1] + 1}.</div>}
              </>}
              {verdictCpk && <div style={{ marginTop: 4 }}><b>Capabilité :</b> Cpk = {fmt(r.cpk)} → <b style={{ color: verdictCpk[1] }}>{verdictCpk[0]}</b>.</div>}
            </div>
          </>
        )}
        <h2>Analyse et actions</h2>
        <div className="doc-encadre racine"><T v={data.analyse} /></div>
      </>
    );
  },
};
