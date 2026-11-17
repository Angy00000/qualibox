import { Champ, Choix } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const ECHELLE = (noms) => Array.from({ length: 10 }, (_, i) => [i + 1, `${i + 1}${noms[i] ? ' — ' + noms[i] : ''}`]);
const G = ECHELLE(['Aucun effet visible', '', 'Gêne mineure', '', 'Client mécontent', '', 'Produit inutilisable', '', 'Risque pour la santé', 'Danger grave, réglementaire']);
const O = ECHELLE(['Quasi impossible', '', 'Très rare', '', 'Occasionnelle', '', 'Fréquente', '', 'Très fréquente', 'Presque certaine']);
const D = ECHELLE(['Toujours détectée', '', 'Détection très probable', '', 'Détection possible', '', 'Détection peu probable', '', 'Presque jamais détectée', 'Indétectable']);

const ligneVide = () => ({ etape: '', mode: '', effet: '', cause: '', g: 5, o: 3, d: 5, action: '', resp: '' });
const couleurIpr = (ipr, seuil) => (ipr >= seuil * 2 ? { bg: '#e5484d', fg: '#fff' } : ipr >= seuil ? { bg: '#f97316', fg: '#fff' } : ipr >= seuil / 2 ? { bg: '#facc15', fg: '#422006' } : { bg: '#22c55e', fg: '#fff' });

export const amdec = {
  id: 'amdec',
  nom: 'AMDEC',
  ico: '🔍',
  court: 'Anticiper les défaillances d’un procédé ou d’un produit et traiter d’abord les plus critiques.',
  fiche: (
    <>
      <p>L’AMDEC (Analyse des Modes de Défaillance, de leurs Effets et de leur Criticité) sert à <b>prévenir</b> les problèmes avant qu’ils arrivent. Pour chaque étape, on imagine ce qui peut mal tourner.</p>
      <ul>
        <li>Pour chaque défaillance, notez de 1 à 10 la <b>gravité</b> (G), l’<b>occurrence</b> (O) et la <b>détection</b> (D, 10 = presque jamais détectée).</li>
        <li>L’indice de priorité IPR = G × O × D, de 1 à 1 000.</li>
        <li>Au-dessus du seuil choisi (souvent 100), une action est obligatoire.</li>
        <li>Après les actions, recotez pour vérifier que l’IPR a baissé.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', perimetre: '', seuil: 100, lignes: [ligneVide()] }),
  exemple: () => ({
    titre: 'AMDEC procédé — jus de bissap en bouteille', date: aujourdhui(), reference: 'AMDEC-2026-01', redacteur: 'Awa Ndiaye', service: 'Qualité — Unité de transformation',
    perimetre: 'Production de jus de bissap en bouteille de 50 cl : de la réception des fleurs au stockage des bouteilles.',
    seuil: 100,
    lignes: [
      { etape: 'Réception des fleurs', mode: 'Fleurs moisies ou humides', effet: 'Goût altéré, risque de moisissures dans le jus', cause: 'Pas de contrôle visuel ni d’humidité à la réception', g: 7, o: 4, d: 6, action: 'Fiche de contrôle à la réception, refus des sacs humides', resp: 'Magasinier' },
      { etape: 'Lavage', mode: 'Lavage insuffisant', effet: 'Sable et impuretés dans le jus', cause: 'Un seul bac de lavage, eau peu changée', g: 5, o: 5, d: 4, action: 'Deux bacs successifs, eau changée à chaque lot', resp: 'Chef d’équipe' },
      { etape: 'Pasteurisation', mode: 'Température ou durée insuffisante', effet: 'Fermentation, risque pour la santé du consommateur', cause: 'Pas de thermomètre, durée estimée à l’œil', g: 9, o: 5, d: 8, action: 'Thermomètre, 85 °C pendant 15 min, fiche d’enregistrement par lot', resp: 'Responsable production' },
      { etape: 'Remplissage', mode: 'Bouteilles mal nettoyées', effet: 'Contamination du jus', cause: 'Rinçage seulement à l’eau froide', g: 8, o: 3, d: 7, action: 'Lavage à l’eau chaude et désinfection, contrôle visuel', resp: 'Opérateur remplissage' },
      { etape: 'Bouchage', mode: 'Bouchon mal serré', effet: 'Fuite, contamination', cause: 'Bouchage manuel, fatigue en fin de journée', g: 6, o: 3, d: 3, action: 'Test de retournement sur 5 bouteilles par heure', resp: 'Opérateur remplissage' },
      { etape: 'Stockage', mode: 'Rupture de la chaîne du froid', effet: 'Fermentation avant la date limite', cause: 'Coupures d’électricité, pas de groupe électrogène', g: 7, o: 4, d: 5, action: 'Relevé de température matin et soir, plan en cas de coupure', resp: 'Logistique' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ lignes: data.lignes.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Périmètre</h2>
          <Champ label="Procédé ou produit analysé" multi rows={2} value={data.perimetre} onChange={(v) => set({ perimetre: v })} />
          <div className="champ">
            <label>Seuil d’action (IPR)</label>
            <input type="number" min="1" max="1000" value={data.seuil} onChange={(e) => set({ seuil: Math.max(1, Number(e.target.value) || 100) })} />
          </div>
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Les défaillances</h2>
          {data.lignes.map((l, i) => {
            const ipr = l.g * l.o * l.d; const c = couleurIpr(ipr, data.seuil);
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Ligne {i + 1}</b><span className="niveau" style={{ background: c.bg, color: c.fg }}>IPR {ipr}{ipr >= data.seuil ? ' · action requise' : ''}</span></div>
                <Champ label="Étape du procédé / fonction" value={l.etape} onChange={(v) => maj(i, { etape: v })} />
                <Champ label="Mode de défaillance (ce qui peut mal tourner)" value={l.mode} onChange={(v) => maj(i, { mode: v })} />
                <Champ label="Effet" value={l.effet} onChange={(v) => maj(i, { effet: v })} />
                <Champ label="Cause" value={l.cause} onChange={(v) => maj(i, { cause: v })} />
                <div className="trois">
                  <Choix label="Gravité (G)" value={l.g} options={G} onChange={(v) => maj(i, { g: v })} />
                  <Choix label="Occurrence (O)" value={l.o} options={O} onChange={(v) => maj(i, { o: v })} />
                  <Choix label="Détection (D)" value={l.d} options={D} onChange={(v) => maj(i, { d: v })} />
                </div>
                <Champ label="Action préventive" multi rows={2} value={l.action} onChange={(v) => maj(i, { action: v })} />
                <div className="deux">
                  <Champ label="Responsable" value={l.resp} onChange={(v) => maj(i, { resp: v })} />
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom: 12 }}>
                    {data.lignes.length > 1 && <button type="button" className="btn discret petit" onClick={() => set({ lignes: data.lignes.filter((_, j) => j !== i) })}>Retirer</button>}
                  </div>
                </div>
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ lignes: [...data.lignes, ligneVide()] })}>+ Ajouter une défaillance</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const lignes = data.lignes.map((l, i) => ({ ...l, n: i + 1, ipr: l.g * l.o * l.d }));
    const prioritaires = [...lignes].filter((l) => l.ipr >= data.seuil).sort((a, b) => b.ipr - a.ipr);
    return (
      <>
        <h2>Périmètre</h2>
        <div className="doc-encadre"><T v={data.perimetre} /> <span style={{ color: '#66748b' }}>· Seuil d’action : IPR ≥ {data.seuil}</span></div>
        <h2>Tableau AMDEC</h2>
        <table className="amdec">
          <thead><tr><th style={{ width: 22 }}>N°</th><th>Étape</th><th>Défaillance</th><th>Effet</th><th>Cause</th><th style={{ width: 22 }}>G</th><th style={{ width: 22 }}>O</th><th style={{ width: 22 }}>D</th><th style={{ width: 44 }}>IPR</th><th>Action</th></tr></thead>
          <tbody>
            {lignes.map((l) => {
              const c = couleurIpr(l.ipr, data.seuil);
              return (
                <tr key={l.n}>
                  <td>{l.n}</td><td><b><T v={l.etape} /></b></td><td><T v={l.mode} /></td><td>{l.effet}</td><td>{l.cause}</td>
                  <td>{l.g}</td><td>{l.o}</td><td>{l.d}</td>
                  <td><span style={{ background: c.bg, color: c.fg, borderRadius: 6, padding: '2px 5px', fontWeight: 800 }}>{l.ipr}</span></td>
                  <td>{l.action}{l.resp ? <div style={{ color: '#66748b', fontSize: 10 }}>{l.resp}</div> : null}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2>Priorités (IPR ≥ {data.seuil})</h2>
        {prioritaires.length
          ? <div className="doc-encadre racine evite-coupure">{prioritaires.map((l) => <div key={l.n}><b>Ligne {l.n} · IPR {l.ipr}</b> — {l.etape} : {l.mode}</div>)}</div>
          : <div className="doc-encadre">Aucune défaillance au-dessus du seuil.</div>}
      </>
    );
  },
};
