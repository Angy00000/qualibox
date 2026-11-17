import { Champ, ListeLignes } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const BANDES = [
  { k: 'pilotage', nom: 'Processus de pilotage', aide: 'Ils orientent et décident : stratégie, revue de direction, amélioration.', bg: '#eef2ff', bord: '#a5b4fc', fg: '#3730a3' },
  { k: 'realisation', nom: 'Processus de réalisation', aide: 'Dans l’ordre, du besoin du client au produit ou service livré.', bg: '#dcfce7', bord: '#4ade80', fg: '#166534' },
  { k: 'support', nom: 'Processus de support', aide: 'Ils fournissent les moyens : personnel, achats, maintenance, informatique.', bg: '#fef3c7', bord: '#fbbf24', fg: '#92400e' },
];

const Bloc = ({ nom, b }) => <div style={{ background: '#fff', border: `1.5px solid ${b.bord}`, borderRadius: 8, padding: '8px 10px', fontWeight: 700, fontSize: 11.5, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 40 }}>{nom}</div>;
const Fleche = ({ c = '#16a34a' }) => <div style={{ color: c, fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center' }}>➜</div>;

export const cartographie = {
  id: 'cartographie',
  nom: 'Cartographie des processus',
  ico: '🗺️',
  court: 'Dessiner les processus de pilotage, de réalisation et de support, du besoin du client à sa satisfaction.',
  fiche: (
    <>
      <p>La cartographie montre en une page comment l’entreprise fonctionne. C’est souvent le premier document d’un système qualité ISO 9001 (§ 4.4).</p>
      <ul>
        <li><b>Réalisation</b> : la chaîne qui crée la valeur pour le client (vendre, produire, livrer…), dans l’ordre.</li>
        <li><b>Pilotage</b> : ce qui oriente l’entreprise. <b>Support</b> : ce qui fournit les moyens.</li>
        <li>À gauche les besoins des clients, à droite leur satisfaction. Entre 6 et 12 processus en tout suffisent.</li>
        <li>Nommez un pilote par processus : il en suit les indicateurs.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', entree: 'Besoins et exigences des clients', sortie: 'Satisfaction des clients', pilotage: [''], realisation: [''], support: [''], pilotes: '' }),
  exemple: () => ({
    titre: 'Cartographie des processus — imprimerie', date: aujourdhui(), reference: 'CARTO-v2', redacteur: 'Ousmane Kane', service: 'Direction qualité — Imprimerie',
    entree: 'Besoins des clients : entreprises, écoles, administrations', sortie: 'Imprimés livrés et clients satisfaits',
    pilotage: ['Stratégie et revue de direction', 'Mesure et amélioration', 'Gestion des risques'],
    realisation: ['Vente et devis', 'Prépresse (PAO)', 'Impression', 'Façonnage', 'Livraison et facturation'],
    support: ['Ressources humaines', 'Achats et stocks', 'Maintenance', 'Informatique', 'Finances'],
    pilotes: 'Vente : responsable commercial · Prépresse et impression : directeur technique · Façonnage et livraison : chef d’atelier · Achats : responsable achats · RH : DRH · Pilotage : directeur général et responsable qualité',
  }),
  Formulaire({ data, set }) {
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Entrée et sortie</h2>
          <div className="deux">
            <Champ label="À gauche (entrée)" value={data.entree} onChange={(v) => set({ entree: v })} />
            <Champ label="À droite (sortie)" value={data.sortie} onChange={(v) => set({ sortie: v })} />
          </div>
        </div>
        {BANDES.map((b, i) => (
          <div className="panneau" key={b.k}>
            <h2><span className="num">{i + 2}</span>{b.nom}</h2>
            <p className="aide" style={{ marginTop: 0 }}>{b.aide}</p>
            <ListeLignes items={data[b.k]} onChange={(v) => set({ [b.k]: v })} placeholder="Nom du processus" ajout="+ Ajouter un processus" />
          </div>
        ))}
        <div className="panneau">
          <h2><span className="num">5</span>Pilotes</h2>
          <Champ label="Pilote de chaque processus" multi value={data.pilotes} onChange={(v) => set({ pilotes: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    const l = (k) => data[k].filter((x) => x.trim());
    const bande = (b, contenu) => (
      <div style={{ background: b.bg, border: `1px solid ${b.bord}`, borderRadius: 12, padding: '8px 10px 10px' }}>
        <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: b.fg, marginBottom: 6 }}>{b.nom}</div>
        {contenu}
      </div>
    );
    const grille = (items, b) => items.length
      ? <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(items.length, 5)}, 1fr)`, gap: 8 }}>{items.map((x, i) => <Bloc key={i} nom={x} b={b} />)}</div>
      : <div className="doc-vide">À compléter</div>;
    const real = l('realisation');
    return (
      <>
        <h2>Cartographie</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '92px 1fr 92px', gap: 10, alignItems: 'stretch' }}>
          <div style={{ background: '#0a0f0c', color: '#fff', borderRadius: 12, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 800, fontSize: 11.5, lineHeight: 1.35 }}><T v={data.entree} /></div>
          <div style={{ display: 'grid', gap: 10 }}>
            {bande(BANDES[0], grille(l('pilotage'), BANDES[0]))}
            {bande(BANDES[1], real.length
              ? <div style={{ display: 'flex', alignItems: 'stretch', gap: 4 }}>{real.flatMap((x, i) => [i > 0 ? <Fleche key={`f${i}`} /> : null, <div key={`b${i}`} style={{ flex: 1 }}><Bloc nom={x} b={BANDES[1]} /></div>])}</div>
              : <div className="doc-vide">À compléter</div>)}
            {bande(BANDES[2], grille(l('support'), BANDES[2]))}
          </div>
          <div style={{ background: '#16a34a', color: '#fff', borderRadius: 12, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 800, fontSize: 11.5, lineHeight: 1.35 }}><T v={data.sortie} /></div>
        </div>
        <div className="legende"><span>Le pilotage oriente les processus de réalisation ; le support leur fournit les moyens.</span></div>
        <h2>Liste des processus</h2>
        <table className="compact">
          <thead><tr><th style={{ width: 150 }}>Type</th><th>Processus</th></tr></thead>
          <tbody>{BANDES.map((b) => <tr key={b.k}><td><b style={{ color: b.fg }}>{b.nom.replace('Processus de ', '')}</b></td><td>{l(b.k).join(' · ') || '—'}</td></tr>)}</tbody>
        </table>
        <h2>Pilotes</h2>
        <div className="doc-encadre"><T v={data.pilotes} /></div>
      </>
    );
  },
};
