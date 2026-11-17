import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const ORIGINES = ['Contrôle interne', 'Réclamation client', 'Réception fournisseur', 'Audit', 'Inspection', 'Autre'];
const GRAVITES = { mineure: ['Mineure', '#d97706'], majeure: ['Majeure', '#f97316'], critique: ['Critique', '#e5484d'] };
const TRAITEMENTS = ['Retouche / réparation', 'Reclassement (2e choix)', 'Rebut / destruction', 'Retour au fournisseur', 'Acceptation par dérogation', 'Tri / contrôle à 100 %'];
const fmtF = (v) => { const n = Number(String(v || '').replace(/\s/g, '')); return n ? `${n.toLocaleString('fr-FR')} FCFA` : ''; };

export const ficheNc = {
  id: 'fiche-nc',
  nom: 'Fiche de non-conformité',
  ico: '🧾',
  court: 'Enregistrer une non-conformité, décider de son traitement, suivre l’action corrective jusqu’à la clôture.',
  fiche: (
    <>
      <p>La fiche de non-conformité (NC) trace tout écart sur un produit, un service ou un processus (ISO 9001 § 8.7 et § 10.2). Elle garde la mémoire des problèmes et de leur coût.</p>
      <ul>
        <li><b>Constater</b> : quoi, combien, où, quand, qui a détecté.</li>
        <li><b>Traiter le produit</b> : retouche, rebut, retour fournisseur, dérogation… et qui a décidé.</li>
        <li><b>Chercher la cause</b> et décider si une action corrective est nécessaire (5 Pourquoi, 8D).</li>
        <li><b>Vérifier</b> que l’action a fonctionné avant de clôturer.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', detecte: aujourdhui(), detectePar: '', origine: 'Contrôle interne', produit: '', quantite: '', description: '', gravite: 'mineure', traitements: [], decidePar: '', cout: '', cause: '', correctiveOui: true, corrective: '', resp: '', echeance: '', verification: '', cloture: '' }),
  exemple: () => ({
    titre: 'Chargeurs USB-C défectueux reçus du fournisseur', date: aujourdhui(), reference: 'NC-2026-031', redacteur: 'Pape Ndiaye', service: 'Boutique — Réception des marchandises',
    detecte: '2026-11-10', detectePar: 'Pape Ndiaye (magasinier)', origine: 'Réception fournisseur', produit: 'Chargeurs USB-C 20 W, lot fournisseur C-2410', quantite: '14 sur 50',
    description: '14 chargeurs sur 50 ne chargent pas les téléphones (voyant éteint). Test fait sur 3 téléphones différents. Emballages sans date ni marquage de conformité.',
    gravite: 'majeure', traitements: ['Tri / contrôle à 100 %', 'Retour au fournisseur'], decidePar: 'Gérant de la boutique', cout: '98000',
    cause: 'Pas de contrôle à la réception : les produits sont mis en vente sans test. Fournisseur nouveau, non évalué.',
    correctiveOui: true, corrective: 'Test de 5 pièces par lot à la réception ; évaluation de chaque nouveau fournisseur avant la première commande ; demande d’avoir au fournisseur.', resp: 'Gérant', echeance: '2026-11-30',
    verification: 'Sur les 3 livraisons suivantes, 0 produit défectueux mis en vente.', cloture: '',
  }),
  Formulaire({ data, set }) {
    const basculer = (t) => set({ traitements: data.traitements.includes(t) ? data.traitements.filter((x) => x !== t) : [...data.traitements, t] });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Constat</h2>
          <div className="deux">
            <Champ label="Détectée le" type="date" value={data.detecte} onChange={(v) => set({ detecte: v })} />
            <Champ label="Détectée par" value={data.detectePar} onChange={(v) => set({ detectePar: v })} />
          </div>
          <div className="deux">
            <div className="champ"><label>Origine</label><select value={data.origine} onChange={(e) => set({ origine: e.target.value })}>{ORIGINES.map((o) => <option key={o}>{o}</option>)}</select></div>
            <div className="champ"><label>Gravité</label><select value={data.gravite} onChange={(e) => set({ gravite: e.target.value })}>{Object.entries(GRAVITES).map(([k, [n]]) => <option key={k} value={k}>{n}</option>)}</select></div>
          </div>
          <div className="deux">
            <Champ label="Produit / service / lot" value={data.produit} onChange={(v) => set({ produit: v })} />
            <Champ label="Quantité concernée" value={data.quantite} onChange={(v) => set({ quantite: v })} />
          </div>
          <Champ label="Description de l’écart (faits)" multi value={data.description} onChange={(v) => set({ description: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Traitement du produit</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {TRAITEMENTS.map((t) => <button key={t} type="button" className={`puce${data.traitements.includes(t) ? ' active' : ''}`} onClick={() => basculer(t)}>{t}</button>)}
          </div>
          <div className="deux">
            <Champ label="Décidé par" value={data.decidePar} onChange={(v) => set({ decidePar: v })} />
            <Champ label="Coût estimé (FCFA)" value={data.cout} onChange={(v) => set({ cout: v })} />
          </div>
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Cause et action corrective</h2>
          <Champ label="Cause identifiée" multi rows={2} value={data.cause} onChange={(v) => set({ cause: v })} />
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 600, fontSize: 14, marginBottom: 12 }}><input type="checkbox" checked={!!data.correctiveOui} onChange={(e) => set({ correctiveOui: e.target.checked })} /> Une action corrective est nécessaire</label>
          {data.correctiveOui && (
            <>
              <Champ label="Action corrective" multi rows={2} value={data.corrective} onChange={(v) => set({ corrective: v })} />
              <div className="deux">
                <Champ label="Responsable" value={data.resp} onChange={(v) => set({ resp: v })} />
                <Champ label="Échéance" type="date" value={data.echeance} onChange={(v) => set({ echeance: v })} />
              </div>
            </>
          )}
        </div>
        <div className="panneau">
          <h2><span className="num">4</span>Vérification et clôture</h2>
          <Champ label="Vérification de l’efficacité" multi rows={2} value={data.verification} onChange={(v) => set({ verification: v })} />
          <Champ label="Clôturée le" type="date" value={data.cloture} onChange={(v) => set({ cloture: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    const [gNom, gCoul] = GRAVITES[data.gravite] || GRAVITES.mineure;
    const Case = ({ l, v }) => <div><small style={{ display: 'block', fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>{l}</small><b style={{ fontSize: 12.5 }}>{v || '—'}</b></div>;
    return (
      <>
        <div className="evite-coupure" style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '0 0 6px' }}>
          <span style={{ background: gCoul, color: '#fff', borderRadius: 999, padding: '4px 12px', fontWeight: 800, fontSize: 12 }}>NC {gNom.toLowerCase()}</span>
          <span style={{ background: data.cloture ? '#dcfce7' : '#fef9c3', color: data.cloture ? '#15803d' : '#854d0e', borderRadius: 999, padding: '4px 12px', fontWeight: 800, fontSize: 12 }}>{data.cloture ? `Clôturée le ${dateFr(data.cloture)}` : 'En cours'}</span>
        </div>
        <h2>1. Constat</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, border: '1px solid #dfe5ee', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
          <Case l="Détectée le" v={dateFr(data.detecte)} /><Case l="Par" v={data.detectePar} /><Case l="Origine" v={data.origine} /><Case l="Quantité" v={data.quantite} />
        </div>
        <div className="doc-encadre probleme"><b><T v={data.produit} /></b>{data.description ? `\n${data.description}` : ''}</div>
        <h2>2. Traitement du produit</h2>
        <div className="doc-encadre evite-coupure">
          {data.traitements.length ? data.traitements.map((t) => <div key={t}>☑ {t}</div>) : <span className="doc-vide">À décider</span>}
          <div style={{ marginTop: 6, color: '#4a5770' }}>Décidé par : <b>{data.decidePar || '—'}</b>{fmtF(data.cout) ? <> · Coût estimé : <b>{fmtF(data.cout)}</b></> : null}</div>
        </div>
        <h2>3. Cause et action corrective</h2>
        <div className="doc-encadre racine"><b>Cause : </b><T v={data.cause} /></div>
        {data.correctiveOui ? (
          <table style={{ marginTop: 8 }}>
            <thead><tr><th>Action corrective</th><th style={{ width: 130 }}>Responsable</th><th style={{ width: 90 }}>Échéance</th></tr></thead>
            <tbody><tr><td><T v={data.corrective} /></td><td><T v={data.resp} /></td><td>{dateFr(data.echeance) || '—'}</td></tr></tbody>
          </table>
        ) : <div className="doc-encadre" style={{ marginTop: 8 }}>Pas d’action corrective nécessaire (cas isolé).</div>}
        <h2>4. Vérification et clôture</h2>
        <div className="doc-encadre"><T v={data.verification} /></div>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
          {['Visa du responsable qualité', 'Visa de la direction'].map((v) => <div key={v} style={{ border: '1px dashed #c9d4e3', borderRadius: 10, height: 70, padding: '6px 10px', fontSize: 10.5, color: '#8190a8', fontWeight: 700 }}>{v}</div>)}
        </div>
      </>
    );
  },
};
