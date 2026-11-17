import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const FREQUENCES = ['Après chaque usage', 'Quotidienne', 'Hebdomadaire', 'Mensuelle'];
const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const ligneVide = () => ({ zone: '', element: '', frequence: 'Quotidienne', produit: '', methode: '', resp: '' });

export const planNettoyage = {
  id: 'plan-nettoyage',
  nom: 'Plan de nettoyage',
  ico: '🧽',
  court: 'Organiser le nettoyage et la désinfection : quoi, quand, avec quoi, qui. Avec la fiche de suivi de la semaine.',
  fiche: (
    <>
      <p>Le plan de nettoyage et de désinfection fait partie des <b>bonnes pratiques d’hygiène</b> (programmes prérequis HACCP, ISO 22000). Les inspecteurs le demandent avec les enregistrements.</p>
      <ul>
        <li>Listez chaque zone et chaque élément : plan de travail, trancheuse, chambre froide, sols, poubelles…</li>
        <li>Précisez le produit et son dosage, la méthode (racler, laver, rincer, désinfecter, rincer, sécher) et le responsable.</li>
        <li>Le PDF contient une <b>fiche de suivi hebdomadaire</b> à afficher : la personne paraphe chaque nettoyage fait.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', lieu: '', lignes: [ligneVide()] }),
  exemple: () => ({
    titre: 'Plan de nettoyage et de désinfection — cuisine', date: aujourdhui(), reference: 'PND-01', redacteur: 'Fatou Sarr', service: 'Restaurant — Cuisine',
    lieu: 'Cuisine centrale du restaurant, Plateau, Dakar',
    lignes: [
      { zone: 'Préparation', element: 'Plans de travail inox', frequence: 'Après chaque usage', produit: 'Détergent-désinfectant, 20 ml/L', methode: 'Débarrasser, laver, laisser agir 5 min, rincer, sécher', resp: 'Commis de cuisine' },
      { zone: 'Préparation', element: 'Planches à découper', frequence: 'Après chaque usage', produit: 'Détergent-désinfectant, 20 ml/L', methode: 'Laver, rincer, désinfecter, sécher à l’air', resp: 'Commis de cuisine' },
      { zone: 'Préparation', element: 'Trancheuse', frequence: 'Après chaque usage', produit: 'Désinfectant alimentaire en spray', methode: 'Débrancher, démonter, laver, désinfecter, remonter', resp: 'Cuisinier' },
      { zone: 'Cuisson', element: 'Fourneaux et hotte (filtres)', frequence: 'Quotidienne', produit: 'Dégraissant alcalin', methode: 'Pulvériser, laisser agir, frotter, rincer', resp: 'Plongeur' },
      { zone: 'Toute la cuisine', element: 'Sols et siphons', frequence: 'Quotidienne', produit: 'Détergent sol, 10 ml/L', methode: 'Balayer, laver, rincer, raclette', resp: 'Plongeur' },
      { zone: 'Plonge', element: 'Poubelles et local déchets', frequence: 'Quotidienne', produit: 'Eau de Javel diluée 1 %', methode: 'Vider, laver, désinfecter, rincer', resp: 'Plongeur' },
      { zone: 'Stockage', element: 'Chambre froide positive', frequence: 'Hebdomadaire', produit: 'Détergent-désinfectant, 20 ml/L', methode: 'Vider, laver parois et étagères, rincer, sécher, remettre', resp: 'Chef de partie' },
      { zone: 'Stockage', element: 'Réserve sèche', frequence: 'Mensuelle', produit: 'Détergent neutre', methode: 'Vider, dépoussiérer, laver étagères, vérifier les nuisibles', resp: 'Économe' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ lignes: data.lignes.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Lieu</h2>
          <Champ label="Site ou local concerné" value={data.lieu} onChange={(v) => set({ lieu: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Ce qu’il faut nettoyer</h2>
          {data.lignes.map((l, i) => (
            <div className="risque-bloc" key={i}>
              <div className="rtete"><b>Élément {i + 1}</b><span className="niveau" style={{ background: '#e8f7ee', color: '#15803d' }}>{l.frequence}</span></div>
              <div className="deux">
                <Champ label="Zone" value={l.zone} onChange={(v) => maj(i, { zone: v })} />
                <Champ label="Élément à nettoyer" value={l.element} onChange={(v) => maj(i, { element: v })} />
              </div>
              <div className="deux">
                <div className="champ"><label>Fréquence</label><select value={l.frequence} onChange={(e) => maj(i, { frequence: e.target.value })}>{FREQUENCES.map((f) => <option key={f}>{f}</option>)}</select></div>
                <Champ label="Responsable" value={l.resp} onChange={(v) => maj(i, { resp: v })} />
              </div>
              <Champ label="Produit et dosage" value={l.produit} onChange={(v) => maj(i, { produit: v })} />
              <Champ label="Méthode" multi rows={2} value={l.methode} onChange={(v) => maj(i, { methode: v })} />
              {data.lignes.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ lignes: data.lignes.filter((_, j) => j !== i) })}>Retirer</button></div>}
            </div>
          ))}
          <button type="button" className="btn secondaire" onClick={() => set({ lignes: [...data.lignes, ligneVide()] })}>+ Ajouter un élément</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const tri = [...data.lignes].sort((a, b) => FREQUENCES.indexOf(a.frequence) - FREQUENCES.indexOf(b.frequence));
    const suivi = tri.filter((l) => l.frequence === 'Après chaque usage' || l.frequence === 'Quotidienne');
    const autres = tri.filter((l) => !suivi.includes(l));
    const caseVide = { border: '1px solid #cfd8e5', height: 16, padding: '2px 5px' };
    const cel = { padding: '3px 5px', verticalAlign: 'middle' };
    return (
      <>
        <h2>Lieu</h2>
        <div className="doc-encadre"><T v={data.lieu} /></div>
        <h2>Plan de nettoyage et de désinfection</h2>
        <table className="amdec">
          <thead><tr><th style={{ width: 64 }}>Zone</th><th style={{ width: 118 }}>Élément</th><th style={{ width: 70 }}>Fréquence</th><th style={{ width: 140 }}>Produit et dosage</th><th>Méthode</th><th style={{ width: 80 }}>Responsable</th></tr></thead>
          <tbody>{tri.map((l, i) => <tr key={i}><td>{l.zone}</td><td><b><T v={l.element} /></b></td><td>{l.frequence}</td><td>{l.produit}</td><td>{l.methode}</td><td>{l.resp}</td></tr>)}</tbody>
        </table>
        <h2>Fiche de suivi — semaine du ____ / ____ / ________</h2>
        <table className="amdec">
          <thead><tr><th>Élément quotidien — parapher quand c’est fait</th>{JOURS.map((j) => <th key={j} style={{ width: 52, textAlign: 'center' }}>{j}</th>)}</tr></thead>
          <tbody>{suivi.map((l, i) => <tr key={i}><td style={cel}><b>{l.element || '—'}</b> <span style={{ color: '#66748b' }}>({l.zone})</span></td>{JOURS.map((j) => <td key={j} style={caseVide} />)}</tr>)}</tbody>
        </table>
        {autres.length ? (
          <table className="amdec" style={{ marginTop: 10 }}>
            <thead><tr><th>Élément hebdomadaire ou mensuel</th><th style={{ width: 90 }}>Fréquence</th><th style={{ width: 110 }}>Date</th><th style={{ width: 110 }}>Visa</th></tr></thead>
            <tbody>{autres.map((l, i) => <tr key={i}><td style={cel}><b>{l.element || '—'}</b> <span style={{ color: '#66748b' }}>({l.zone})</span></td><td style={cel}>{l.frequence}</td><td style={caseVide} /><td style={caseVide} /></tr>)}</tbody>
          </table>
        ) : null}
      </>
    );
  },
};
