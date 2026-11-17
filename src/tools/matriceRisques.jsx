import { Champ, Choix } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

export const GRAVITE = [[1, '1 — Mineure'], [2, '2 — Significative'], [3, '3 — Grave'], [4, '4 — Très grave']];
export const PROBA = [[1, '1 — Rare'], [2, '2 — Possible'], [3, '3 — Probable'], [4, '4 — Très probable']];
const NOMS_G = ['', 'Mineure', 'Significative', 'Grave', 'Très grave'];
const NOMS_P = ['', 'Rare', 'Possible', 'Probable', 'Très probable'];

export function niveau(score) {
  if (score >= 12) return { nom: 'Critique', fond: '#e5484d', texte: '#fff', pale: '#fde8e8' };
  if (score >= 8) return { nom: 'Élevé', fond: '#f97316', texte: '#fff', pale: '#ffedd5' };
  if (score >= 4) return { nom: 'Moyen', fond: '#facc15', texte: '#422006', pale: '#fef9c3' };
  return { nom: 'Faible', fond: '#22c55e', texte: '#fff', pale: '#dcfce7' };
}

const risqueVide = () => ({ danger: '', consequence: '', gravite: 2, probabilite: 2, mesures: '', responsable: '' });

export const matriceRisques = {
  id: 'matrice-risques',
  nom: 'Matrice des risques',
  ico: '⚠️',
  court: 'Coter chaque risque (gravité × probabilité) et voir d’un coup d’œil ceux à traiter en premier.',
  fiche: (
    <>
      <p>La matrice des risques sert à <b>hiérarchiser</b> les risques (sécurité, qualité, environnement). Chaque risque reçoit une note de gravité et une note de probabilité, de 1 à 4. Leur produit donne la <b>criticité</b>.</p>
      <ul>
        <li>1 à 3 : faible · 4 à 6 : moyen · 8 à 9 : élevé · 12 à 16 : critique.</li>
        <li>Traitez d’abord les risques critiques et élevés, avec des mesures concrètes.</li>
        <li>Après les mesures, recotez le risque pour vérifier qu’il a baissé.</li>
        <li>Utile pour le document unique, ISO 45001, ISO 9001 (approche par les risques) et HACCP.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', perimetre: '', risques: [risqueVide()] }),
  exemple: () => ({
    titre: 'Évaluation des risques — chantier R+2', date: aujourdhui(), reference: 'EVR-2026-021', redacteur: 'Ibrahima Fall', service: 'HSE — Chantier Keur Massar',
    perimetre: 'Construction d’un immeuble R+2 : maçonnerie, coffrage, bétonnage, manutention et circulation sur le chantier.',
    risques: [
      { danger: 'Travail en hauteur sans protection collective', consequence: 'Chute de hauteur, blessure grave ou décès', gravite: 4, probabilite: 3, mesures: 'Garde-corps sur les dalles, harnais obligatoires, échafaudages vérifiés chaque matin', responsable: 'Chef de chantier' },
      { danger: 'Port de sacs de ciment de 50 kg', consequence: 'Douleurs au dos, lombalgies', gravite: 2, probabilite: 4, mesures: 'Brouettes et diables, port à deux, formation gestes et postures', responsable: 'Chef d’équipe' },
      { danger: 'Câbles de la bétonnière au sol mouillé', consequence: 'Électrocution', gravite: 4, probabilite: 2, mesures: 'Câbles surélevés, disjoncteur différentiel, vérification avant usage', responsable: 'Électricien' },
      { danger: 'Poussière de ciment', consequence: 'Irritation des yeux et des voies respiratoires', gravite: 2, probabilite: 3, mesures: 'Masques et lunettes, arrosage des zones de travail', responsable: 'Magasinier' },
      { danger: 'Circulation des camions de livraison', consequence: 'Écrasement, collision', gravite: 4, probabilite: 1, mesures: 'Zone de manœuvre balisée, guide au sol pour chaque livraison', responsable: 'Chef de chantier' },
      { danger: 'Bruit du marteau-piqueur', consequence: 'Fatigue auditive', gravite: 1, probabilite: 3, mesures: 'Bouchons d’oreilles, rotation des opérateurs', responsable: 'Chef d’équipe' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ risques: data.risques.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Périmètre</h2>
          <Champ label="Activité, poste ou site évalué" multi rows={2} value={data.perimetre} onChange={(v) => set({ perimetre: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Les risques</h2>
          {data.risques.map((r, i) => {
            const s = r.gravite * r.probabilite; const n = niveau(s);
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete">
                  <b>R{i + 1}</b>
                  <span className="niveau" style={{ background: n.fond, color: n.texte }}>{s} · {n.nom}</span>
                </div>
                <Champ label="Danger / situation dangereuse" value={r.danger} onChange={(v) => maj(i, { danger: v })} />
                <Champ label="Conséquence possible" value={r.consequence} onChange={(v) => maj(i, { consequence: v })} />
                <div className="deux">
                  <Choix label="Gravité" value={r.gravite} options={GRAVITE} onChange={(v) => maj(i, { gravite: v })} />
                  <Choix label="Probabilité" value={r.probabilite} options={PROBA} onChange={(v) => maj(i, { probabilite: v })} />
                </div>
                <Champ label="Mesures de prévention" multi rows={2} value={r.mesures} onChange={(v) => maj(i, { mesures: v })} />
                <div className="deux">
                  <Champ label="Responsable" value={r.responsable} onChange={(v) => maj(i, { responsable: v })} />
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom: 12 }}>
                    {data.risques.length > 1 && <button type="button" className="btn discret petit" onClick={() => set({ risques: data.risques.filter((_, j) => j !== i) })}>Retirer ce risque</button>}
                  </div>
                </div>
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ risques: [...data.risques, risqueVide()] })}>+ Ajouter un risque</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const liste = data.risques.map((r, i) => ({ ...r, n: i + 1, s: r.gravite * r.probabilite }));
    const tries = [...liste].sort((a, b) => b.s - a.s);
    return (
      <>
        <h2>Périmètre</h2>
        <div className="doc-encadre"><T v={data.perimetre} /></div>
        <h2>Matrice gravité × probabilité</h2>
        <div className="matrice-wrap">
          <div className="axe-v">Gravité</div>
          <div>
            <div className="matrice">
              {[4, 3, 2, 1].map((g) => (
                <div key={g} style={{ display: 'contents' }}>
                  <div className="lab">{g} · {NOMS_G[g]}</div>
                  {[1, 2, 3, 4].map((p) => {
                    const n = niveau(g * p);
                    const ici = liste.filter((r) => r.gravite === g && r.probabilite === p);
                    return (
                      <div key={p} className="cellule" style={{ background: n.fond, color: n.texte }}>
                        <span className="score">{g * p}</span>
                        {ici.map((r) => <span key={r.n} className="r">R{r.n}</span>)}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div />
              {[1, 2, 3, 4].map((p) => <div key={p} className="lab col">{p} · {NOMS_P[p]}</div>)}
            </div>
            <div style={{ textAlign: 'center', fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#66748b', marginTop: 6 }}>Probabilité</div>
          </div>
        </div>
        <div className="legende">
          {[2, 4, 8, 12].map((s) => { const n = niveau(s); return <span key={s}><i style={{ background: n.fond }} />{n.nom} ({s === 2 ? '1–3' : s === 4 ? '4–6' : s === 8 ? '8–9' : '12–16'})</span>; })}
        </div>
        <h2>Risques classés par criticité</h2>
        <table>
          <thead><tr><th style={{ width: 34 }}>N°</th><th>Danger et conséquence</th><th style={{ width: 34 }}>G</th><th style={{ width: 34 }}>P</th><th style={{ width: 96 }}>Criticité</th><th>Mesures</th><th style={{ width: 100 }}>Resp.</th></tr></thead>
          <tbody>
            {tries.map((r) => {
              const n = niveau(r.s);
              return (
                <tr key={r.n}>
                  <td><b>R{r.n}</b></td>
                  <td><b><T v={r.danger} /></b>{r.consequence ? <div style={{ color: '#66748b' }}>{r.consequence}</div> : null}</td>
                  <td>{r.gravite}</td><td>{r.probabilite}</td>
                  <td><span style={{ background: n.fond, color: n.texte, borderRadius: 999, padding: '2px 8px', fontWeight: 800, fontSize: 11, whiteSpace: 'nowrap' }}>{r.s} {n.nom}</span></td>
                  <td><T v={r.mesures} /></td><td><T v={r.responsable} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  },
};
