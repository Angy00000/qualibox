import { Champ, ListeLignes } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const Liste = ({ items }) => {
  const l = items.filter((x) => x.trim());
  return l.length ? <ul style={{ margin: 0, paddingLeft: 16 }}>{l.map((x, i) => <li key={i}>{x}</li>)}</ul> : <span className="doc-vide">À compléter</span>;
};
const Case = ({ titre, couleur, children }) => (
  <div style={{ border: `1.5px solid ${couleur}`, borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
    <div style={{ background: couleur, color: '#fff', fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 8px' }}>{titre}</div>
    <div style={{ padding: '7px 9px', fontSize: 11.5, flex: 1 }}>{children}</div>
  </div>
);
const indicateurVide = () => ({ nom: '', cible: '', frequence: 'Mensuelle' });

export const ficheProcessus = {
  id: 'fiche-processus',
  nom: 'Fiche processus',
  ico: '🔄',
  court: 'Décrire un processus sur une page : finalité, fournisseurs, entrées, activités, sorties, clients, pilote, indicateurs.',
  fiche: (
    <>
      <p>Chaque processus de la cartographie a sa fiche d’identité (ISO 9001 § 4.4). On l’appelle aussi fiche <b>SIPOC</b> : fournisseurs, entrées, processus, sorties, clients.</p>
      <ul>
        <li><b>Finalité</b> : pourquoi ce processus existe, en une phrase.</li>
        <li><b>Entrées</b> : ce qu’il reçoit (demande, matière, information). <b>Sorties</b> : ce qu’il produit.</li>
        <li><b>Activités</b> : les grandes étapes, dans l’ordre (5 à 8).</li>
        <li>Un <b>pilote</b> responsable et 2 à 4 <b>indicateurs</b> avec une cible.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', processus: '', type: 'Réalisation', finalite: '', pilote: '', fournisseurs: [''], entrees: [''], activites: [''], sorties: [''], clients: [''], ressources: [''], documents: [''], risques: [''], indicateurs: [indicateurVide()] }),
  exemple: () => ({
    titre: 'Fiche processus — Vente et devis', date: aujourdhui(), reference: 'PR-R01', redacteur: 'Ousmane Kane', service: 'Direction qualité — Imprimerie',
    processus: 'Vente et devis', type: 'Réalisation', pilote: 'Responsable commercial',
    finalite: 'Transformer les demandes des clients en commandes claires, réalisables et rentables.',
    fournisseurs: ['Clients (entreprises, écoles, administrations)', 'Prépresse (faisabilité)', 'Direction (tarifs)'],
    entrees: ['Demande du client (visite, téléphone, e-mail)', 'Fichiers et maquettes', 'Grille tarifaire'],
    activites: ['Recevoir et enregistrer la demande', 'Vérifier la faisabilité avec la prépresse', 'Établir et envoyer le devis sous 24 h', 'Relancer le client', 'Enregistrer la commande et l’acompte', 'Transmettre le dossier de fabrication'],
    sorties: ['Devis', 'Bon de commande validé', 'Dossier de fabrication'],
    clients: ['Client', 'Prépresse et atelier', 'Comptabilité'],
    ressources: ['2 commerciaux', 'Logiciel de devis', 'Téléphone et WhatsApp professionnel'],
    documents: ['Procédure de vente', 'Modèle de devis', 'Grille tarifaire'],
    risques: ['Erreur de quantité ou de format sur le devis', 'Délai promis impossible à tenir'],
    indicateurs: [
      { nom: 'Délai d’envoi des devis', cible: '≤ 24 h pour 90 %', frequence: 'Mensuelle' },
      { nom: 'Taux de transformation des devis', cible: '≥ 40 %', frequence: 'Mensuelle' },
      { nom: 'Réclamations liées à la commande', cible: '≤ 1 %', frequence: 'Trimestrielle' },
    ],
  }),
  Formulaire({ data, set }) {
    const L = (k, label, ph) => (
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{label}</label>
        <ListeLignes items={data[k]} onChange={(v) => set({ [k]: v })} placeholder={ph} />
      </div>
    );
    const majI = (i, patch) => set({ indicateurs: data.indicateurs.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Identité</h2>
          <div className="deux">
            <Champ label="Nom du processus" value={data.processus} onChange={(v) => set({ processus: v })} />
            <div className="champ"><label>Type</label><select value={data.type} onChange={(e) => set({ type: e.target.value })}>{['Pilotage', 'Réalisation', 'Support'].map((t) => <option key={t}>{t}</option>)}</select></div>
          </div>
          <Champ label="Pilote" value={data.pilote} onChange={(v) => set({ pilote: v })} />
          <Champ label="Finalité" multi rows={2} value={data.finalite} onChange={(v) => set({ finalite: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>SIPOC</h2>
          {L('fournisseurs', 'Fournisseurs (qui fournit les entrées)')}
          {L('entrees', 'Entrées')}
          {L('activites', 'Activités, dans l’ordre', 'Verbe + action')}
          {L('sorties', 'Sorties')}
          {L('clients', 'Clients (qui reçoit les sorties)')}
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Moyens, documents, risques</h2>
          {L('ressources', 'Ressources (personnel, matériel, logiciels)')}
          {L('documents', 'Documents associés')}
          {L('risques', 'Principaux risques')}
        </div>
        <div className="panneau">
          <h2><span className="num">4</span>Indicateurs</h2>
          {data.indicateurs.map((x, i) => (
            <div className="risque-bloc" key={i}>
              <Champ label={`Indicateur ${i + 1}`} value={x.nom} onChange={(v) => majI(i, { nom: v })} />
              <div className="deux">
                <Champ label="Cible" value={x.cible} onChange={(v) => majI(i, { cible: v })} />
                <div className="champ"><label>Fréquence</label><select value={x.frequence} onChange={(e) => majI(i, { frequence: e.target.value })}>{['Hebdomadaire', 'Mensuelle', 'Trimestrielle', 'Annuelle'].map((f) => <option key={f}>{f}</option>)}</select></div>
              </div>
              {data.indicateurs.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ indicateurs: data.indicateurs.filter((_, j) => j !== i) })}>Retirer</button></div>}
            </div>
          ))}
          <button type="button" className="btn secondaire petit" onClick={() => set({ indicateurs: [...data.indicateurs, indicateurVide()] })}>+ Ajouter un indicateur</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const couleur = { Pilotage: '#4f46e5', Réalisation: '#16a34a', Support: '#d97706' }[data.type] || '#16a34a';
    const activites = data.activites.filter((x) => x.trim());
    return (
      <>
        <div className="evite-coupure" style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
          <div style={{ flex: 1, background: '#0a0f0c', color: '#fff', borderRadius: 12, padding: '12px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: '#4ade80' }}>Processus de {data.type.toLowerCase()}</div>
            <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 19 }}>{data.processus || '—'}</div>
          </div>
          <div style={{ border: '1px solid #dfe5ee', borderRadius: 12, padding: '12px 16px', minWidth: 180 }}>
            <small style={{ display: 'block', fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>Pilote</small>
            <b>{data.pilote || '—'}</b>
          </div>
        </div>
        <h2>Finalité</h2>
        <div className="doc-encadre racine"><T v={data.finalite} /></div>
        <h2>Fournisseurs, entrées, activités, sorties, clients</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr 1fr 1fr', gap: 6 }}>
          <Case titre="Fournisseurs" couleur="#64748b"><Liste items={data.fournisseurs} /></Case>
          <Case titre="Entrées" couleur="#0f766e"><Liste items={data.entrees} /></Case>
          <Case titre="Activités" couleur={couleur}>{activites.length ? <ol style={{ margin: 0, paddingLeft: 16 }}>{activites.map((x, i) => <li key={i}>{x}</li>)}</ol> : <span className="doc-vide">À compléter</span>}</Case>
          <Case titre="Sorties" couleur="#0f766e"><Liste items={data.sorties} /></Case>
          <Case titre="Clients" couleur="#64748b"><Liste items={data.clients} /></Case>
        </div>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
          <Case titre="Ressources" couleur="#0a0f0c"><Liste items={data.ressources} /></Case>
          <Case titre="Documents associés" couleur="#0a0f0c"><Liste items={data.documents} /></Case>
          <Case titre="Principaux risques" couleur="#e5484d"><Liste items={data.risques} /></Case>
        </div>
        <h2>Indicateurs</h2>
        <table>
          <thead><tr><th>Indicateur</th><th style={{ width: 160 }}>Cible</th><th style={{ width: 110 }}>Fréquence</th></tr></thead>
          <tbody>{data.indicateurs.map((x, i) => <tr key={i}><td><b><T v={x.nom} /></b></td><td>{x.cible || '—'}</td><td>{x.frequence}</td></tr>)}</tbody>
        </table>
      </>
    );
  },
};
