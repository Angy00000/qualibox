import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const ETAPES = [
  ['d1', 'D1', 'Constituer l’équipe', 'Qui travaille sur le problème, avec quel rôle ? (un pilote, des personnes du terrain)'],
  ['d2', 'D2', 'Décrire le problème', 'Faits précis : quoi, qui, où, quand, combien. Le QQOQCP aide beaucoup.'],
  ['d3', 'D3', 'Actions immédiates (confinement)', 'Protéger le client tout de suite : bloquer, trier, rappeler, remplacer.'],
  ['d4', 'D4', 'Causes racines', 'Pourquoi c’est arrivé, et pourquoi on ne l’a pas détecté ? (5 Pourquoi, Ishikawa)'],
  ['d5', 'D5', 'Actions correctives choisies', 'Les actions qui suppriment les causes racines.'],
  ['d6', 'D6', 'Mise en œuvre et vérification', 'Ce qui a été fait, quand, et la preuve que ça marche.'],
  ['d7', 'D7', 'Éviter que ça recommence', 'Procédures, formations, contrôles, autres produits ou sites concernés.'],
  ['d8', 'D8', 'Clôture et remerciements', 'Validation de la clôture, information du client, remerciement de l’équipe.'],
];
const COULEURS = ['#2563eb', '#0891b2', '#e5484d', '#d97706', '#7c3aed', '#16a34a', '#0d9488', '#0a0f0c'];

export const huitD = {
  id: '8d',
  nom: 'Méthode 8D',
  ico: '🛠️',
  court: 'Traiter une réclamation client ou une non-conformité grave en huit étapes, jusqu’à la clôture.',
  fiche: (
    <>
      <p>La méthode 8D (huit disciplines) est la référence pour <b>répondre à une réclamation client</b> ou traiter une non-conformité importante. Le client attend souvent un rapport 8D.</p>
      <ul>
        <li>Agissez vite sur D3 : le client doit être protégé dans les 24 à 48 heures.</li>
        <li>En D4, cherchez deux causes : pourquoi le défaut est apparu, et pourquoi il n’a pas été détecté.</li>
        <li>D6 doit contenir une preuve chiffrée que les actions fonctionnent.</li>
        <li>Ne clôturez (D8) qu’après cette preuve.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', client: '', recu: aujourdhui(), produit: '', ...Object.fromEntries(ETAPES.map(([k]) => [k, ''])), cloture: '' }),
  exemple: () => ({
    titre: 'Yaourts gonflés livrés à un supermarché', date: aujourdhui(), reference: '8D-2026-011', redacteur: 'Aïssatou Diallo', service: 'Qualité — Laiterie',
    client: 'Chaîne de supermarchés (magasin de Thiès)', recu: '2026-11-03', produit: 'Yaourt sucré 500 g, lot L2610-28',
    d1: 'Pilote : Aïssatou Diallo (responsable qualité). Membres : chef de production, responsable maintenance, responsable logistique, un opérateur de la ligne de conditionnement.',
    d2: 'Le 3 novembre, le client signale 46 pots gonflés sur 600 livrés (7,7 %), lot L2610-28 fabriqué le 28 octobre. Odeur aigre à l’ouverture. Aucun autre lot concerné à ce jour.',
    d3: 'Blocage du stock restant du lot (1 140 pots) le 3 novembre. Retrait des 554 pots restants chez le client et remplacement par le lot L2611-02 contrôlé. Information des autres clients livrés avec ce lot.',
    d4: 'Apparition : le joint de la porte de la chambre froide était abîmé ; la température est montée à 12 °C pendant le week-end du 1er novembre.\nNon-détection : la température n’est relevée que les jours ouvrables et la chambre froide n’a pas d’alarme.',
    d5: 'Remplacer le joint de la porte. Installer un enregistreur de température avec alarme SMS. Relever la température deux fois par jour, week-end compris.',
    d6: 'Joint remplacé le 5 novembre. Enregistreur installé le 7 novembre. Sur 3 semaines : température entre 2 et 5 °C, aucune alarme. Aucun pot gonflé sur les 12 lots suivants.',
    d7: 'Procédure « surveillance des chambres froides » mise à jour et affichée. Contrôle des joints ajouté au plan de maintenance mensuel. Formation des 6 agents de la logistique le 12 novembre.',
    d8: 'Rapport 8D envoyé au client le 25 novembre ; le client a accepté la clôture. Merci à l’équipe pour la réaction rapide.',
    cloture: '2026-11-25',
  }),
  Formulaire({ data, set }) {
    return (
      <>
        <div className="panneau">
          <h2>📥 La réclamation</h2>
          <Champ label="Client" value={data.client} onChange={(v) => set({ client: v })} />
          <div className="deux">
            <Champ label="Reçue le" type="date" value={data.recu} onChange={(v) => set({ recu: v })} />
            <Champ label="Produit / lot" value={data.produit} onChange={(v) => set({ produit: v })} />
          </div>
        </div>
        {ETAPES.map(([k, n, nom, aide], i) => (
          <div className="panneau" key={k}>
            <h2><span className="num" style={{ background: COULEURS[i], width: 34, borderRadius: 9 }}>{n}</span>{nom}</h2>
            <p className="aide">{aide}</p>
            <Champ label={nom} multi rows={3} value={data[k]} onChange={(v) => set({ [k]: v })} />
            {k === 'd8' && <Champ label="Date de clôture" type="date" value={data.cloture} onChange={(v) => set({ cloture: v })} />}
          </div>
        ))}
      </>
    );
  },
  Document({ data }) {
    return (
      <>
        <table className="evite-coupure">
          <thead><tr><th>Client</th><th style={{ width: 110 }}>Reçue le</th><th>Produit / lot</th><th style={{ width: 110 }}>Clôturée le</th></tr></thead>
          <tbody><tr><td><b><T v={data.client} /></b></td><td>{dateFr(data.recu) || '—'}</td><td><T v={data.produit} /></td><td>{dateFr(data.cloture) || 'En cours'}</td></tr></tbody>
        </table>
        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          {ETAPES.map(([k, n, nom], i) => (
            <div key={k} className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '46px 1fr', gap: 12, alignItems: 'start' }}>
              <div style={{ background: COULEURS[i], color: '#fff', borderRadius: 10, height: 40, display: 'grid', placeItems: 'center', fontFamily: 'Sora', fontWeight: 800 }}>{n}</div>
              <div>
                <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 12.5, color: '#0a0f0c', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>{nom}</div>
                <div className={`doc-encadre${k === 'd4' ? ' racine' : k === 'd2' ? ' probleme' : ''}`}><T v={data[k]} /></div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  },
};
