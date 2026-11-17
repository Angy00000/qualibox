import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const matiereVide = () => ({ matiere: '', fournisseur: '', lot: '', quantite: '', reception: '' });
const etapeVide = () => ({ etape: '', date: '', operateur: '', controle: '' });
const expeditionVide = () => ({ client: '', date: '', quantite: '', document: '' });
const dans = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const num = (v) => Number(String(v || '').replace(',', '.').replace(/[^\d.]/g, '')) || 0;

export const tracabilite = {
  id: 'tracabilite',
  nom: 'Fiche de traçabilité',
  ico: '🔗',
  court: 'Suivre un lot de la matière première au client : en amont, la fabrication, en aval. Indispensable pour un rappel.',
  fiche: (
    <>
      <p>La traçabilité permet, à partir d’un numéro de lot, de retrouver <b>d’où il vient</b> (amont) et <b>où il est parti</b> (aval). En cas de problème, on peut retirer ou rappeler seulement les produits concernés (ISO 22000, ISO 9001 § 8.5.2).</p>
      <ul>
        <li><b>Amont</b> : matières premières, fournisseur et lot fournisseur.</li>
        <li><b>Fabrication</b> : étapes, dates, opérateurs, contrôles.</li>
        <li><b>Aval</b> : clients livrés, dates, quantités, bons de livraison.</li>
        <li>Testez votre traçabilité une fois par an : retrouver tout un lot en moins de 4 heures.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', lot: '', produit: '', fabrication: aujourdhui(), dlc: '', quantite: '', unite: 'unités', matieres: [matiereVide()], etapes: [etapeVide()], expeditions: [expeditionVide()] }),
  exemple: () => ({
    titre: 'Traçabilité du lot JB-2611', date: aujourdhui(), reference: 'TR-JB-2611', redacteur: 'Mariama Diop', service: 'Production — Atelier de jus locaux',
    lot: 'JB-2611', produit: 'Jus de bissap 50 cl', fabrication: dans(-4), dlc: dans(26), quantite: '480', unite: 'bouteilles',
    matieres: [
      { matiere: 'Fleurs de bissap séchées', fournisseur: 'Coopérative de Kaolack', lot: 'KAO-B-09', quantite: '12 kg', reception: dans(-20) },
      { matiere: 'Sucre en poudre', fournisseur: 'Grossiste Sandaga', lot: 'CSS-2610', quantite: '25 kg', reception: dans(-15) },
      { matiere: 'Menthe fraîche', fournisseur: 'Maraîcher des Niayes', lot: '—', quantite: '1 kg', reception: dans(-5) },
      { matiere: 'Bouteilles PET 50 cl', fournisseur: 'Emballages Dakar', lot: 'PET-4471', quantite: '500', reception: dans(-30) },
    ],
    etapes: [
      { etape: 'Infusion', date: dans(-4), operateur: 'Awa', controle: '20 min à 90 °C' },
      { etape: 'Filtration et sucrage', date: dans(-4), operateur: 'Awa', controle: 'Brix 12' },
      { etape: 'Pasteurisation', date: dans(-4), operateur: 'Moussa', controle: '85 °C pendant 15 min — CCP conforme' },
      { etape: 'Mise en bouteille et étiquetage', date: dans(-4), operateur: 'Moussa, Khady', controle: '480 bouteilles, 20 rebutées' },
      { etape: 'Refroidissement et stockage', date: dans(-4), operateur: 'Khady', controle: 'Chambre froide à 3 °C' },
    ],
    expeditions: [
      { client: 'Supérette Liberté 6', date: dans(-3), quantite: '120', document: 'BL-0912' },
      { client: 'Restaurant Le Lagon', date: dans(-3), quantite: '60', document: 'BL-0913' },
      { client: 'Boutique de l’atelier', date: dans(-2), quantite: '90', document: 'Vente directe' },
      { client: 'Traiteur Diallo (mariage)', date: dans(-1), quantite: '150', document: 'BL-0918' },
    ],
  }),
  Formulaire({ data, set }) {
    const majL = (k, i, patch) => set({ [k]: data[k].map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    const bloc = (k, titre, champs, vide, ajout) => (
      <>
        {data[k].map((x, i) => (
          <div className="risque-bloc" key={i}>
            <div className="rtete"><b>{titre} {i + 1}</b>{data[k].length > 1 && <button type="button" className="btn discret petit" onClick={() => set({ [k]: data[k].filter((_, j) => j !== i) })}>Retirer</button>}</div>
            <div className="deux">{champs.map(([c, l, t]) => <Champ key={c} label={l} type={t || 'text'} value={x[c]} onChange={(v) => majL(k, i, { [c]: v })} />)}</div>
          </div>
        ))}
        <button type="button" className="btn secondaire petit" onClick={() => set({ [k]: [...data[k], vide()] })}>{ajout}</button>
      </>
    );
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Le lot</h2>
          <div className="deux">
            <Champ label="N° de lot" value={data.lot} onChange={(v) => set({ lot: v })} />
            <Champ label="Produit" value={data.produit} onChange={(v) => set({ produit: v })} />
          </div>
          <div className="deux">
            <Champ label="Fabriqué le" type="date" value={data.fabrication} onChange={(v) => set({ fabrication: v })} />
            <Champ label="DLC / DDM" type="date" value={data.dlc} onChange={(v) => set({ dlc: v })} />
          </div>
          <div className="deux">
            <Champ label="Quantité produite" value={data.quantite} onChange={(v) => set({ quantite: v })} />
            <Champ label="Unité" value={data.unite} onChange={(v) => set({ unite: v })} />
          </div>
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Amont : matières utilisées</h2>
          {bloc('matieres', 'Matière', [['matiere', 'Matière ou emballage'], ['fournisseur', 'Fournisseur'], ['lot', 'Lot fournisseur'], ['quantite', 'Quantité utilisée'], ['reception', 'Reçue le', 'date']], matiereVide, '+ Ajouter une matière')}
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Fabrication</h2>
          {bloc('etapes', 'Étape', [['etape', 'Étape'], ['date', 'Date', 'date'], ['operateur', 'Opérateur'], ['controle', 'Contrôle ou mesure']], etapeVide, '+ Ajouter une étape')}
        </div>
        <div className="panneau">
          <h2><span className="num">4</span>Aval : expéditions</h2>
          {bloc('expeditions', 'Expédition', [['client', 'Client'], ['date', 'Date', 'date'], ['quantite', 'Quantité'], ['document', 'Bon de livraison ou facture']], expeditionVide, '+ Ajouter une expédition')}
        </div>
      </>
    );
  },
  Document({ data }) {
    const produit = num(data.quantite);
    const expedie = data.expeditions.reduce((s, x) => s + num(x.quantite), 0);
    const Colonne = ({ titre, couleur, children }) => (
      <div style={{ border: `1.5px solid ${couleur}`, borderRadius: 12, padding: '8px 10px', fontSize: 11 }}>
        <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: couleur, marginBottom: 4 }}>{titre}</div>{children}
      </div>
    );
    return (
      <>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 24px 1.1fr 24px 1fr', alignItems: 'stretch', gap: 4 }}>
          <Colonne titre={`Amont · ${data.matieres.length} matière(s)`} couleur="#0f766e">{data.matieres.map((m, i) => <div key={i}><b>{m.matiere || '—'}</b> · lot {m.lot || '—'}</div>)}</Colonne>
          <div style={{ display: 'grid', placeItems: 'center', color: '#16a34a', fontWeight: 900, fontSize: 18 }}>➜</div>
          <div style={{ background: '#0a0f0c', color: '#fff', borderRadius: 12, padding: '10px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: '#4ade80' }}>Lot</div>
            <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 20 }}>{data.lot || '—'}</div>
            <div style={{ fontSize: 12 }}>{data.produit}</div>
            <div style={{ fontSize: 10.5, color: '#cbd5e1', marginTop: 4 }}>Fabriqué le {dateFr(data.fabrication) || '—'} · DLC {dateFr(data.dlc) || '—'}</div>
            <div style={{ fontSize: 11, marginTop: 2 }}>{data.quantite} {data.unite}</div>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', color: '#16a34a', fontWeight: 900, fontSize: 18 }}>➜</div>
          <Colonne titre={`Aval · ${data.expeditions.length} client(s)`} couleur="#16a34a">{data.expeditions.map((e, i) => <div key={i}><b>{e.client || '—'}</b> · {e.quantite}</div>)}</Colonne>
        </div>
        {produit ? <div className="legende"><span>Expédié : <b>{expedie}</b> sur <b>{produit}</b> {data.unite} · en stock ou non expédié : <b>{Math.max(0, produit - expedie)}</b></span></div> : null}
        <h2>Amont : matières premières et emballages</h2>
        <table className="compact">
          <thead><tr><th>Matière</th><th>Fournisseur</th><th style={{ width: 100 }}>Lot fournisseur</th><th style={{ width: 80 }}>Quantité</th><th style={{ width: 80 }}>Reçue le</th></tr></thead>
          <tbody>{data.matieres.map((m, i) => <tr key={i}><td><b><T v={m.matiere} /></b></td><td>{m.fournisseur}</td><td>{m.lot}</td><td>{m.quantite}</td><td>{dateFr(m.reception) || '—'}</td></tr>)}</tbody>
        </table>
        <h2>Fabrication</h2>
        <table className="compact">
          <thead><tr><th>Étape</th><th style={{ width: 80 }}>Date</th><th style={{ width: 120 }}>Opérateur</th><th>Contrôle ou mesure</th></tr></thead>
          <tbody>{data.etapes.map((e, i) => <tr key={i}><td><b><T v={e.etape} /></b></td><td>{dateFr(e.date) || '—'}</td><td>{e.operateur}</td><td>{e.controle}</td></tr>)}</tbody>
        </table>
        <h2>Aval : expéditions</h2>
        <table className="compact">
          <thead><tr><th>Client</th><th style={{ width: 80 }}>Date</th><th style={{ width: 80 }}>Quantité</th><th style={{ width: 140 }}>Document</th></tr></thead>
          <tbody>{data.expeditions.map((e, i) => <tr key={i}><td><b><T v={e.client} /></b></td><td>{dateFr(e.date) || '—'}</td><td>{e.quantite}</td><td>{e.document}</td></tr>)}</tbody>
        </table>
      </>
    );
  },
};
