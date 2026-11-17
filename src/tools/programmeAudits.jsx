import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const STATUTS = {
  prevu: { nom: 'Prévu', bg: '#e2e8f0', fg: '#334155', c: '#94a3b8' },
  fait: { nom: 'Réalisé', bg: '#dcfce7', fg: '#15803d', c: '#16a34a' },
  reporte: { nom: 'Reporté', bg: '#fef9c3', fg: '#854d0e', c: '#f59e0b' },
  annule: { nom: 'Annulé', bg: '#fde8e8', fg: '#b91c1c', c: '#e5484d' },
};
const TYPES = ['Audit interne', 'Audit fournisseur', 'Audit de certification', 'Audit de suivi', 'Audit client'];
const auditVide = () => ({ theme: '', type: 'Audit interne', referentiel: 'ISO 9001', auditeur: '', audite: '', mois: 1, statut: 'prevu' });

export const programmeAudits = {
  id: 'programme-audits',
  nom: 'Programme d’audits',
  ico: '📅',
  court: 'Planifier les audits de l’année mois par mois, avec auditeurs et suivi de la réalisation.',
  fiche: (
    <>
      <p>Le programme d’audits (ISO 9001 § 9.2 et ISO 19011) planifie tous les audits de l’année : internes, fournisseurs, certification.</p>
      <ul>
        <li>Couvrez chaque processus au moins une fois par an ; plus souvent s’il est important ou s’il a posé problème.</li>
        <li>Un auditeur n’audite pas son propre travail (indépendance).</li>
        <li>Mettez à jour le statut : prévu, réalisé, reporté, annulé. Le taux de réalisation est calculé.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', annee: String(new Date().getFullYear() + 1), objectifs: '', audits: [auditVide()] }),
  exemple: () => ({
    titre: 'Programme d’audits 2027', date: aujourdhui(), reference: 'PAUD-2027', redacteur: 'Ousmane Kane', service: 'Direction qualité — Imprimerie',
    annee: '2027', objectifs: 'Vérifier l’efficacité du système qualité avant et après la certification ISO 9001 ; auditer chaque processus au moins une fois ; évaluer les 2 fournisseurs critiques sur place.',
    audits: [
      { theme: 'Vente et devis', type: 'Audit interne', referentiel: 'ISO 9001 § 8.2', auditeur: 'Responsable qualité', audite: 'Responsable commercial', mois: 1, statut: 'fait' },
      { theme: 'Certification ISO 9001', type: 'Audit de certification', referentiel: 'ISO 9001', auditeur: 'Organisme certificateur', audite: 'Toute l’entreprise', mois: 2, statut: 'fait' },
      { theme: 'Prépresse et impression', type: 'Audit interne', referentiel: 'ISO 9001 § 8.5', auditeur: 'Responsable achats', audite: 'Directeur technique', mois: 4, statut: 'reporte' },
      { theme: 'Papeterie Atlantique', type: 'Audit fournisseur', referentiel: 'Cahier des charges papier', auditeur: 'Responsable qualité', audite: 'Fournisseur', mois: 5, statut: 'prevu' },
      { theme: 'Achats et stocks', type: 'Audit interne', referentiel: 'ISO 9001 § 8.4', auditeur: 'Chef d’atelier', audite: 'Responsable achats', mois: 6, statut: 'prevu' },
      { theme: 'Façonnage et livraison', type: 'Audit interne', referentiel: 'ISO 9001 § 8.5 et 8.6', auditeur: 'Responsable qualité', audite: 'Chef d’atelier', mois: 7, statut: 'prevu' },
      { theme: 'Ressources humaines et maintenance', type: 'Audit interne', referentiel: 'ISO 9001 § 7.1 et 7.2', auditeur: 'Responsable commercial', audite: 'DRH, maintenance', mois: 9, statut: 'prevu' },
      { theme: 'Pilotage et amélioration', type: 'Audit interne', referentiel: 'ISO 9001 § 5, 6, 9, 10', auditeur: 'Consultant externe', audite: 'Direction', mois: 10, statut: 'prevu' },
      { theme: 'Suivi de certification', type: 'Audit de suivi', referentiel: 'ISO 9001', auditeur: 'Organisme certificateur', audite: 'Toute l’entreprise', mois: 12, statut: 'prevu' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ audits: data.audits.map((a, j) => (j === i ? { ...a, ...patch } : a)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>L’année</h2>
          <Champ label="Année" value={data.annee} onChange={(v) => set({ annee: v })} />
          <Champ label="Objectifs du programme" multi rows={2} value={data.objectifs} onChange={(v) => set({ objectifs: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Les audits</h2>
          {data.audits.map((a, i) => {
            const s = STATUTS[a.statut];
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Audit {i + 1}</b><span className="niveau" style={{ background: s.bg, color: s.fg }}>{MOIS[a.mois - 1]} · {s.nom}</span></div>
                <Champ label="Processus ou thème audité" value={a.theme} onChange={(v) => maj(i, { theme: v })} />
                <div className="deux">
                  <div className="champ"><label>Type</label><select value={a.type} onChange={(e) => maj(i, { type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
                  <Champ label="Référentiel" value={a.referentiel} onChange={(v) => maj(i, { referentiel: v })} />
                </div>
                <div className="deux">
                  <Champ label="Auditeur" value={a.auditeur} onChange={(v) => maj(i, { auditeur: v })} />
                  <Champ label="Audité" value={a.audite} onChange={(v) => maj(i, { audite: v })} />
                </div>
                <div className="deux">
                  <div className="champ"><label>Mois</label><select value={a.mois} onChange={(e) => maj(i, { mois: Number(e.target.value) })}>{MOIS.map((m, k) => <option key={k} value={k + 1}>{m}</option>)}</select></div>
                  <div className="champ"><label>Statut</label><select value={a.statut} onChange={(e) => maj(i, { statut: e.target.value })}>{Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.nom}</option>)}</select></div>
                </div>
                {data.audits.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ audits: data.audits.filter((_, j) => j !== i) })}>Retirer</button></div>}
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ audits: [...data.audits, auditVide()] })}>+ Ajouter un audit</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const audits = [...data.audits].sort((a, b) => a.mois - b.mois);
    const actifs = audits.filter((a) => a.statut !== 'annule');
    const faits = audits.filter((a) => a.statut === 'fait').length;
    const taux = actifs.length ? Math.round((faits / actifs.length) * 100) : 0;
    return (
      <>
        <h2>Objectifs {data.annee ? `— ${data.annee}` : ''}</h2>
        <div className="doc-encadre"><T v={data.objectifs} /></div>
        <div className="evite-coupure legende" style={{ marginTop: 10 }}>
          <span>Audits : <b>{audits.length}</b></span><span>Réalisés : <b>{faits}</b></span><span>Taux de réalisation : <b style={{ color: '#15803d' }}>{taux} %</b></span>
        </div>
        <h2>Planning</h2>
        <table className="amdec">
          <thead><tr><th>Audit</th>{MOIS.map((m) => <th key={m} style={{ width: 30, textAlign: 'center', padding: '7px 1px' }}>{m}</th>)}</tr></thead>
          <tbody>
            {audits.map((a, i) => (
              <tr key={i}>
                <td style={{ padding: '4px 5px' }}><b><T v={a.theme} /></b> <span style={{ color: '#66748b' }}>· {a.type}</span></td>
                {MOIS.map((m, k) => <td key={m} style={{ textAlign: 'center', verticalAlign: 'middle', padding: '4px 1px', borderLeft: '1px solid #eef2f7' }}>{a.mois === k + 1 ? <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: STATUTS[a.statut].c }} /> : null}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="legende">{Object.values(STATUTS).map((s) => <span key={s.nom}><i style={{ background: s.c }} />{s.nom}</span>)}</div>
        <h2>Détail</h2>
        <table className="compact">
          <thead><tr><th style={{ width: 42 }}>Mois</th><th>Thème</th><th style={{ width: 130 }}>Référentiel</th><th style={{ width: 120 }}>Auditeur</th><th style={{ width: 110 }}>Audité</th><th style={{ width: 70 }}>Statut</th></tr></thead>
          <tbody>{audits.map((a, i) => <tr key={i}><td>{MOIS[a.mois - 1]}</td><td><b>{a.theme}</b></td><td>{a.referentiel}</td><td>{a.auditeur}</td><td>{a.audite}</td><td><span style={{ background: STATUTS[a.statut].bg, color: STATUTS[a.statut].fg, borderRadius: 999, padding: '1px 7px', fontWeight: 800, whiteSpace: 'nowrap' }}>{STATUTS[a.statut].nom}</span></td></tr>)}</tbody>
        </table>
      </>
    );
  },
};
