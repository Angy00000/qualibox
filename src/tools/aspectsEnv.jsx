import { Champ, Choix } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const SITUATIONS = { N: 'Normale', A: 'Anormale', U: 'Urgence' };
const GRAV = [[1, '1 — Faible'], [2, '2 — Modérée'], [3, '3 — Forte'], [4, '4 — Très forte']];
const FREQ = [[1, '1 — Rare'], [2, '2 — Occasionnelle'], [3, '3 — Fréquente'], [4, '4 — Permanente']];
const ligneVide = () => ({ activite: '', aspect: '', impact: '', situation: 'N', g: 2, f: 2, reglementaire: false, mesures: '' });
const significatif = (l, seuil) => l.g * l.f >= seuil || l.reglementaire;

export const aspectsEnv = {
  id: 'aspects-env',
  nom: 'Aspects et impacts environnementaux',
  ico: '🌍',
  court: 'Identifier ce que vos activités rejettent ou consomment, coter les impacts et repérer les aspects significatifs.',
  fiche: (
    <>
      <p>Base de l’<b>ISO 14001</b> (§ 6.1.2). Un <b>aspect</b> est ce que fait l’activité (rejet d’eaux usées, consommation d’électricité, déchets) ; l’<b>impact</b> est la conséquence sur l’environnement (pollution de la mer, épuisement des ressources, nuisances).</p>
      <ul>
        <li>Pour chaque activité, pensez aux situations <b>normales</b>, <b>anormales</b> (panne, démarrage) et d’<b>urgence</b> (fuite, incendie).</li>
        <li>Cotez la gravité et la fréquence de 1 à 4. Criticité = gravité × fréquence.</li>
        <li>Un aspect est <b>significatif</b> si sa criticité atteint le seuil choisi, ou s’il est encadré par la réglementation.</li>
        <li>Les aspects significatifs doivent avoir des mesures de maîtrise et des objectifs.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', perimetre: '', seuil: 8, lignes: [ligneVide()] }),
  exemple: () => ({
    titre: 'Analyse environnementale — usine de transformation de poisson', date: aujourdhui(), reference: 'AE-2026-01', redacteur: 'Lamine Seck', service: 'QHSE — Usine de Mbour',
    perimetre: 'Toutes les activités de l’usine : réception, lavage et découpe du poisson, congélation, stockage, utilités (forage, groupe électrogène, froid).',
    seuil: 8,
    lignes: [
      { activite: 'Lavage et découpe du poisson', aspect: 'Consommation d’eau du forage', impact: 'Épuisement de la nappe', situation: 'N', g: 3, f: 4, reglementaire: false, mesures: 'Compteur sur le forage, pistolets à arrêt automatique, objectif −15 % en 2027' },
      { activite: 'Lavage et découpe du poisson', aspect: 'Rejet d’eaux usées chargées en matière organique', impact: 'Pollution de la mer et de la plage', situation: 'N', g: 4, f: 4, reglementaire: true, mesures: 'Station de prétraitement, analyses mensuelles, maintenance préventive' },
      { activite: 'Découpe', aspect: 'Déchets de poisson (têtes, viscères)', impact: 'Odeurs, mouches, nuisances pour les riverains', situation: 'N', g: 3, f: 4, reglementaire: false, mesures: 'Stockage fermé, enlèvement quotidien, valorisation en farine' },
      { activite: 'Congélation', aspect: 'Fuite de fluide frigorigène', impact: 'Effet de serre, couche d’ozone', situation: 'A', g: 3, f: 1, reglementaire: true, mesures: 'Contrôle d’étanchéité par un frigoriste agréé' },
      { activite: 'Groupe électrogène', aspect: 'Fumées et bruit', impact: 'Pollution de l’air, gêne des voisins', situation: 'N', g: 2, f: 2, reglementaire: false, mesures: 'Entretien régulier, capot insonorisant' },
      { activite: 'Stockage du gasoil', aspect: 'Déversement accidentel', impact: 'Pollution du sol et de la nappe', situation: 'U', g: 4, f: 1, reglementaire: true, mesures: 'Bac de rétention, kit absorbant, exercice annuel' },
      { activite: 'Bureaux', aspect: 'Consommation de papier', impact: 'Consommation de ressources', situation: 'N', g: 1, f: 3, reglementaire: false, mesures: 'Impression recto verso, documents numériques' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ lignes: data.lignes.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Périmètre</h2>
          <Champ label="Site et activités analysés" multi rows={2} value={data.perimetre} onChange={(v) => set({ perimetre: v })} />
          <div className="champ"><label>Seuil de significativité (gravité × fréquence)</label><input type="number" min="1" max="16" value={data.seuil} onChange={(e) => set({ seuil: Math.min(16, Math.max(1, Number(e.target.value) || 8)) })} /></div>
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Aspects et impacts</h2>
          {data.lignes.map((l, i) => {
            const s = l.g * l.f; const sig = significatif(l, data.seuil);
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Ligne {i + 1}</b><span className="niveau" style={{ background: sig ? '#e5484d' : '#dcfce7', color: sig ? '#fff' : '#15803d' }}>{s} · {sig ? 'Significatif' : 'Non significatif'}</span></div>
                <Champ label="Activité" value={l.activite} onChange={(v) => maj(i, { activite: v })} />
                <Champ label="Aspect (ce que fait l’activité)" value={l.aspect} onChange={(v) => maj(i, { aspect: v })} />
                <Champ label="Impact (conséquence sur l’environnement)" value={l.impact} onChange={(v) => maj(i, { impact: v })} />
                <div className="trois">
                  <div className="champ"><label>Situation</label><select value={l.situation} onChange={(e) => maj(i, { situation: e.target.value })}>{Object.entries(SITUATIONS).map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></div>
                  <Choix label="Gravité" value={l.g} options={GRAV} onChange={(v) => maj(i, { g: v })} />
                  <Choix label="Fréquence" value={l.f} options={FREQ} onChange={(v) => maj(i, { f: v })} />
                </div>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 600, fontSize: 14, marginBottom: 12 }}><input type="checkbox" checked={!!l.reglementaire} onChange={(e) => maj(i, { reglementaire: e.target.checked })} /> Encadré par la réglementation</label>
                <Champ label="Mesures de maîtrise" multi rows={2} value={l.mesures} onChange={(v) => maj(i, { mesures: v })} />
                {data.lignes.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ lignes: data.lignes.filter((_, j) => j !== i) })}>Retirer</button></div>}
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ lignes: [...data.lignes, ligneVide()] })}>+ Ajouter un aspect</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const lignes = data.lignes.map((l, i) => ({ ...l, n: i + 1, s: l.g * l.f, sig: significatif(l, data.seuil) }));
    const sigs = lignes.filter((l) => l.sig).sort((a, b) => b.s - a.s);
    return (
      <>
        <h2>Périmètre</h2>
        <div className="doc-encadre"><T v={data.perimetre} /> <span style={{ color: '#66748b' }}>· Significatif si criticité ≥ {data.seuil} ou réglementé</span></div>
        <h2>Tableau des aspects et impacts</h2>
        <table className="amdec">
          <thead><tr><th style={{ width: 22 }}>N°</th><th>Activité</th><th>Aspect</th><th>Impact</th><th style={{ width: 52 }}>Situation</th><th style={{ width: 20 }}>G</th><th style={{ width: 20 }}>F</th><th style={{ width: 66 }}>Criticité</th><th>Mesures</th></tr></thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.n}>
                <td>{l.n}</td><td><b><T v={l.activite} /></b></td><td><T v={l.aspect} /></td><td>{l.impact}</td><td>{SITUATIONS[l.situation]}</td><td>{l.g}</td><td>{l.f}</td>
                <td><span style={{ background: l.sig ? '#e5484d' : '#dcfce7', color: l.sig ? '#fff' : '#15803d', borderRadius: 6, padding: '2px 5px', fontWeight: 800, whiteSpace: 'nowrap' }}>{l.s}{l.reglementaire ? ' · R' : ''}</span></td>
                <td>{l.mesures}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="legende" style={{ marginTop: 8 }}><span><i style={{ background: '#e5484d' }} />Significatif</span><span><i style={{ background: '#22c55e' }} />Non significatif</span><span>R = encadré par la réglementation</span></div>
        <h2>Aspects significatifs ({sigs.length})</h2>
        {sigs.length ? <div className="doc-encadre racine evite-coupure">{sigs.map((l) => <div key={l.n}><b>{l.n}. {l.aspect}</b> ({l.activite}) — criticité {l.s}{l.reglementaire ? ', réglementé' : ''}</div>)}</div> : <div className="doc-encadre">Aucun aspect significatif.</div>}
      </>
    );
  },
};
