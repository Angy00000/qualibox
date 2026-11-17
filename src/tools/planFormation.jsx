import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const STATUTS = {
  prevue: { nom: 'Prévue', bg: '#e2e8f0', fg: '#334155' },
  faite: { nom: 'Réalisée', bg: '#dcfce7', fg: '#15803d' },
  reportee: { nom: 'Reportée', bg: '#fef9c3', fg: '#854d0e' },
  annulee: { nom: 'Annulée', bg: '#fde8e8', fg: '#b91c1c' },
};
const EFFICACITE = { '': 'Non évaluée', oui: 'Efficace', partiel: 'Partiellement', non: 'Pas efficace' };
const EFF_COUL = { oui: '#15803d', partiel: '#a16207', non: '#b91c1c', '': '#94a3b8' };
const formationVide = () => ({ formation: '', public: '', objectif: '', type: 'Interne', organisme: '', mois: 1, heures: 0, personnes: 1, cout: 0, statut: 'prevue', efficacite: '', evaluation: '' });
const fcfa = (n) => `${Number(n || 0).toLocaleString('fr-FR')} FCFA`;

export const planFormation = {
  id: 'plan-formation',
  nom: 'Plan de formation',
  ico: '📚',
  court: 'Planifier les formations de l’année, suivre heures et budget, et évaluer leur efficacité.',
  fiche: (
    <>
      <p>Le plan de formation organise le développement des compétences (ISO 9001 § 7.2). Il part des besoins repérés : matrice des compétences, entretiens, audits, accidents, nouveaux équipements.</p>
      <ul>
        <li>Chaque formation a un <b>objectif</b> concret : ce que les personnes sauront faire après.</li>
        <li>Suivez le statut, les heures et le budget.</li>
        <li>Quelques semaines après, <b>évaluez l’efficacité</b> sur le terrain (observation, indicateur, test) : c’est ce que l’auditeur vérifie.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', annee: String(new Date().getFullYear() + 1), budget: '', formations: [formationVide()] }),
  exemple: () => ({
    titre: 'Plan de formation 2027', date: aujourdhui(), reference: 'PF-2027', redacteur: 'Aïssatou Diop', service: 'Ressources humaines — Imprimerie', annee: '2027', budget: '2500000',
    formations: [
      { formation: 'Réglage couleur sur presse offset', public: 'Conducteurs offset', objectif: 'Obtenir la teinte du BAT en moins de 3 réglages', type: 'Externe', organisme: 'Fournisseur de la presse', mois: 1, heures: 16, personnes: 3, cout: 900000, statut: 'faite', efficacite: 'oui', evaluation: 'Réglages couleur passés de 6 à 3 en moyenne.' },
      { formation: 'Exigences de l’ISO 9001', public: 'Encadrement', objectif: 'Comprendre les exigences avant la certification', type: 'Externe', organisme: 'Cabinet de conseil QHSE', mois: 1, heures: 14, personnes: 6, cout: 600000, statut: 'faite', efficacite: 'partiel', evaluation: 'Bonne compréhension ; à compléter sur la gestion des risques.' },
      { formation: 'Auditeur interne', public: 'Futurs auditeurs internes', objectif: 'Conduire un audit interne selon l’ISO 19011', type: 'Externe', organisme: 'Cabinet de conseil QHSE', mois: 3, heures: 21, personnes: 4, cout: 800000, statut: 'reportee', efficacite: '', evaluation: '' },
      { formation: 'Gestes et postures', public: 'Atelier et magasin', objectif: 'Porter les charges sans se blesser', type: 'Interne', organisme: 'Responsable QHSE', mois: 4, heures: 3, personnes: 12, cout: 0, statut: 'prevue', efficacite: '', evaluation: '' },
      { formation: 'Manipulation des extincteurs', public: 'Tout le personnel', objectif: 'Savoir utiliser un extincteur sur un feu réel', type: 'Externe', organisme: 'Sapeurs-pompiers', mois: 6, heures: 2, personnes: 25, cout: 200000, statut: 'prevue', efficacite: '', evaluation: '' },
      { formation: 'Logiciel de PAO (perfectionnement)', public: 'Opérateurs prépresse', objectif: 'Préparer les fichiers sans erreur de fond perdu', type: 'Interne', organisme: 'Awa Ndoye', mois: 9, heures: 8, personnes: 2, cout: 0, statut: 'prevue', efficacite: '', evaluation: '' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ formations: data.formations.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>L’année</h2>
          <div className="deux">
            <Champ label="Année" value={data.annee} onChange={(v) => set({ annee: v })} />
            <Champ label="Budget alloué (FCFA)" value={data.budget} onChange={(v) => set({ budget: v })} />
          </div>
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Formations</h2>
          {data.formations.map((x, i) => {
            const s = STATUTS[x.statut];
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Formation {i + 1}</b><span className="niveau" style={{ background: s.bg, color: s.fg }}>{s.nom}</span></div>
                <Champ label="Intitulé" value={x.formation} onChange={(v) => maj(i, { formation: v })} />
                <div className="deux">
                  <Champ label="Public" value={x.public} onChange={(v) => maj(i, { public: v })} />
                  <Champ label="Objectif (ce qu’ils sauront faire)" value={x.objectif} onChange={(v) => maj(i, { objectif: v })} />
                </div>
                <div className="trois">
                  <div className="champ"><label>Type</label><select value={x.type} onChange={(e) => maj(i, { type: e.target.value })}><option>Interne</option><option>Externe</option></select></div>
                  <Champ label="Formateur ou organisme" value={x.organisme} onChange={(v) => maj(i, { organisme: v })} />
                  <div className="champ"><label>Mois</label><select value={x.mois} onChange={(e) => maj(i, { mois: Number(e.target.value) })}>{MOIS.map((m, k) => <option key={k} value={k + 1}>{m}</option>)}</select></div>
                </div>
                <div className="trois">
                  <Champ label="Durée (heures)" type="number" value={x.heures} onChange={(v) => maj(i, { heures: Math.max(0, Number(v) || 0) })} />
                  <Champ label="Personnes" type="number" value={x.personnes} onChange={(v) => maj(i, { personnes: Math.max(0, Number(v) || 0) })} />
                  <Champ label="Coût (FCFA)" type="number" value={x.cout} onChange={(v) => maj(i, { cout: Math.max(0, Number(v) || 0) })} />
                </div>
                <div className="deux">
                  <div className="champ"><label>Statut</label><select value={x.statut} onChange={(e) => maj(i, { statut: e.target.value })}>{Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.nom}</option>)}</select></div>
                  <div className="champ"><label>Efficacité</label><select value={x.efficacite} onChange={(e) => maj(i, { efficacite: e.target.value })}>{Object.entries(EFFICACITE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                </div>
                <Champ label="Comment l’efficacité a été vérifiée" value={x.evaluation} onChange={(v) => maj(i, { evaluation: v })} />
                {data.formations.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ formations: data.formations.filter((_, j) => j !== i) })}>Retirer</button></div>}
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ formations: [...data.formations, formationVide()] })}>+ Ajouter une formation</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const f = [...data.formations].sort((a, b) => a.mois - b.mois);
    const actives = f.filter((x) => x.statut !== 'annulee');
    const faites = f.filter((x) => x.statut === 'faite');
    const heures = actives.reduce((s, x) => s + x.heures * x.personnes, 0);
    const cout = actives.reduce((s, x) => s + Number(x.cout || 0), 0);
    const budget = Number(String(data.budget || '').replace(/\s/g, ''));
    const evaluees = faites.filter((x) => x.efficacite).length;
    const tuiles = [['Formations', actives.length, '#0a0f0c'], ['Réalisées', `${faites.length} / ${actives.length}`, '#15803d'], ['Heures × personnes', heures, '#0a0f0c'], ['Coût prévu', fcfa(cout), budget && cout > budget ? '#e5484d' : '#0a0f0c'], ['Efficacité évaluée', `${evaluees} / ${faites.length}`, evaluees < faites.length ? '#a16207' : '#15803d']];
    return (
      <>
        <h2>Synthèse {data.annee}</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.4fr 1fr', gap: 8 }}>
          {tuiles.map(([l, v, c]) => (
            <div key={l} style={{ border: '1px solid #dfe5ee', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>{l}</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 18, color: c, whiteSpace: 'nowrap' }}>{v}</div>
            </div>
          ))}
        </div>
        {budget ? <div className="legende"><span>Budget alloué : <b>{fcfa(budget)}</b> · utilisé à <b>{Math.round((cout / budget) * 100)} %</b></span></div> : null}
        <h2>Formations</h2>
        <table className="amdec">
          <thead><tr><th style={{ width: 52 }}>Mois</th><th>Formation et objectif</th><th style={{ width: 96 }}>Public</th><th style={{ width: 90 }}>Formateur</th><th style={{ width: 44, textAlign: 'center' }}>Durée</th><th style={{ width: 66 }}>Coût</th><th style={{ width: 92 }}>Statut et efficacité</th></tr></thead>
          <tbody>
            {f.map((x, i) => { const s = STATUTS[x.statut]; return (
              <tr key={i}>
                <td>{MOIS[x.mois - 1]}</td>
                <td><b><T v={x.formation} /></b><div style={{ color: '#66748b' }}>{x.objectif}</div>{x.evaluation ? <div style={{ color: EFF_COUL[x.efficacite], marginTop: 2 }}>→ {x.evaluation}</div> : null}</td>
                <td>{x.public}<div style={{ color: '#66748b' }}>{x.personnes} pers.</div></td>
                <td>{x.organisme}<div style={{ color: '#66748b' }}>{x.type}</div></td>
                <td style={{ textAlign: 'center' }}>{x.heures} h</td>
                <td style={{ whiteSpace: 'nowrap' }}>{x.cout ? Number(x.cout).toLocaleString('fr-FR') : '—'}</td>
                <td><span style={{ background: s.bg, color: s.fg, borderRadius: 999, padding: '2px 7px', fontWeight: 800, whiteSpace: 'nowrap' }}>{s.nom}</span>{x.statut === 'faite' ? <div style={{ color: EFF_COUL[x.efficacite], fontWeight: 700, marginTop: 4 }}>{EFFICACITE[x.efficacite]}</div> : null}</td>
              </tr>
            ); })}
          </tbody>
        </table>
      </>
    );
  },
};
