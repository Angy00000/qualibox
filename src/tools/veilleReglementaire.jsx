import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const DOMAINES = ['Qualité', 'Sécurité des aliments', 'Santé et sécurité au travail', 'Environnement', 'Social', 'Autre'];
const CONFORMITE = {
  C: { nom: 'Conforme', bg: '#dcfce7', fg: '#15803d' },
  P: { nom: 'Partiel', bg: '#fef9c3', fg: '#854d0e' },
  NC: { nom: 'Non conforme', bg: '#fde8e8', fg: '#b91c1c' },
  AE: { nom: 'À évaluer', bg: '#e2e8f0', fg: '#334155' },
};
const texteVide = () => ({ texte: '', domaine: 'Qualité', exigence: '', preuve: '', conformite: 'AE', action: '', resp: '' });

export const veilleReglementaire = {
  id: 'veille-reglementaire',
  nom: 'Veille réglementaire',
  ico: '📜',
  court: 'Lister les textes et exigences qui s’appliquent à l’entreprise et évaluer votre conformité, exigence par exigence.',
  fiche: (
    <>
      <p>Les normes ISO 9001, 14001, 45001 et 22000 demandent d’identifier les <b>exigences légales et réglementaires</b> applicables et d’évaluer régulièrement si on les respecte.</p>
      <ul>
        <li>Pour chaque texte (loi, décret, arrêté, norme rendue obligatoire, exigence client), notez ce qu’il vous demande concrètement.</li>
        <li>Indiquez la preuve que vous le respectez (document, registre, contrôle).</li>
        <li>Pour tout écart, une action et un responsable.</li>
        <li>Vérifiez toujours la version en vigueur des textes (Journal officiel, ministères, organismes officiels).</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', perimetre: '', prochaine: '', textes: [texteVide()] }),
  exemple: () => ({
    titre: 'Registre de veille réglementaire — usine', date: aujourdhui(), reference: 'VR-2026', redacteur: 'Lamine Seck', service: 'QHSE — Usine de Mbour',
    perimetre: 'Usine de transformation de poisson destiné à l’export. Exemple de démonstration : textes et références à vérifier et compléter selon votre activité.',
    prochaine: (() => { const d = new Date(); d.setMonth(d.getMonth() + 6); return d.toISOString().slice(0, 10); })(),
    textes: [
      { texte: 'Code du travail — hygiène et sécurité', domaine: 'Santé et sécurité au travail', exigence: 'Évaluer les risques, fournir les EPI, organiser la visite médicale du personnel.', preuve: 'Document unique, registre des EPI', conformite: 'P', action: 'Planifier les visites médicales en retard', resp: 'RH' },
      { texte: 'Code de l’environnement — rejets', domaine: 'Environnement', exigence: 'Autorisation d’exploiter à jour, eaux usées traitées avant rejet, normes de rejet respectées.', preuve: 'Autorisation, analyses mensuelles', conformite: 'NC', action: 'Renouveler l’autorisation de rejet', resp: 'Directeur d’usine' },
      { texte: 'Règlement des pays importateurs (agrément export)', domaine: 'Sécurité des aliments', exigence: 'Plan HACCP, traçabilité, contrôles officiels, analyses des lots.', preuve: 'Plan HACCP, fiches de lot', conformite: 'C', action: '', resp: '' },
      { texte: 'Codex Alimentarius — Principes généraux d’hygiène alimentaire (CXC 1-1969)', domaine: 'Sécurité des aliments', exigence: 'Bonnes pratiques d’hygiène, nettoyage, lutte contre les nuisibles, formation.', preuve: 'Plan de nettoyage, contrat de dératisation', conformite: 'C', action: '', resp: '' },
      { texte: 'Réglementation des équipements sous pression', domaine: 'Santé et sécurité au travail', exigence: 'Inspection périodique des compresseurs et réservoirs d’air.', preuve: '', conformite: 'AE', action: 'Faire l’inventaire des équipements concernés', resp: 'Maintenance' },
      { texte: 'Cahier des charges du client importateur', domaine: 'Qualité', exigence: 'Étiquetage bilingue, température ≤ −18 °C, certificat d’analyse par lot.', preuve: 'Enregistrements de température', conformite: 'C', action: '', resp: '' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ textes: data.textes.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Périmètre</h2>
          <Champ label="Activité et site concernés" multi rows={2} value={data.perimetre} onChange={(v) => set({ perimetre: v })} />
          <Champ label="Prochaine évaluation" type="date" value={data.prochaine} onChange={(v) => set({ prochaine: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Textes et exigences</h2>
          {data.textes.map((x, i) => {
            const c = CONFORMITE[x.conformite];
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Texte {i + 1}</b><span className="niveau" style={{ background: c.bg, color: c.fg }}>{c.nom}</span></div>
                <Champ label="Texte (loi, décret, norme, exigence client)" value={x.texte} onChange={(v) => maj(i, { texte: v })} />
                <div className="champ"><label>Domaine</label><select value={x.domaine} onChange={(e) => maj(i, { domaine: e.target.value })}>{DOMAINES.map((d) => <option key={d}>{d}</option>)}</select></div>
                <Champ label="Ce qu’il exige concrètement" multi rows={2} value={x.exigence} onChange={(v) => maj(i, { exigence: v })} />
                <Champ label="Preuve de conformité" value={x.preuve} onChange={(v) => maj(i, { preuve: v })} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {Object.entries(CONFORMITE).map(([k, v]) => <button key={k} type="button" className="btn petit" onClick={() => maj(i, { conformite: k })} style={{ background: x.conformite === k ? v.fg : v.bg, color: x.conformite === k ? '#fff' : v.fg, borderRadius: 999 }}>{v.nom}</button>)}
                </div>
                <div className="deux">
                  <Champ label="Action" value={x.action} onChange={(v) => maj(i, { action: v })} />
                  <Champ label="Responsable" value={x.resp} onChange={(v) => maj(i, { resp: v })} />
                </div>
                {data.textes.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ textes: data.textes.filter((_, j) => j !== i) })}>Retirer</button></div>}
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ textes: [...data.textes, texteVide()] })}>+ Ajouter un texte</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const n = (k) => data.textes.filter((x) => x.conformite === k).length;
    const evalues = data.textes.filter((x) => x.conformite !== 'AE').length;
    const taux = evalues ? Math.round(((n('C') + 0.5 * n('P')) / evalues) * 100) : null;
    const ordre = { NC: 0, P: 1, AE: 2, C: 3 };
    const liste = [...data.textes].sort((a, b) => ordre[a.conformite] - ordre[b.conformite]);
    return (
      <>
        <h2>Périmètre</h2>
        <div className="doc-encadre"><T v={data.perimetre} />{data.prochaine ? `\nProchaine évaluation : ${dateFr(data.prochaine)}` : ''}</div>
        <h2>Bilan de conformité</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {[['Taux de conformité', taux === null ? '—' : `${taux} %`, taux !== null && taux < 80 ? '#e5484d' : '#15803d'], ...Object.entries(CONFORMITE).map(([k, v]) => [v.nom, n(k), k === 'C' ? '#15803d' : k === 'P' ? '#a16207' : k === 'NC' ? '#e5484d' : '#334155'])].map(([l, v, c]) => (
            <div key={l} style={{ border: '1px solid #dfe5ee', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>{l}</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 21, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <h2>Registre (écarts en premier)</h2>
        <table className="amdec">
          <thead><tr><th>Texte</th><th>Exigence</th><th style={{ width: 110 }}>Preuve</th><th style={{ width: 66 }}>Conformité</th><th style={{ width: 130 }}>Action</th></tr></thead>
          <tbody>
            {liste.map((x, i) => { const c = CONFORMITE[x.conformite]; return (
              <tr key={i}>
                <td><b><T v={x.texte} /></b><div style={{ color: '#66748b' }}>{x.domaine}</div></td>
                <td>{x.exigence}</td><td>{x.preuve || '—'}</td>
                <td><span style={{ background: c.bg, color: c.fg, borderRadius: 999, padding: '2px 7px', fontWeight: 800, whiteSpace: 'nowrap' }}>{c.nom}</span></td>
                <td>{x.action}{x.resp ? <div style={{ color: '#66748b' }}>{x.resp}</div> : null}</td>
              </tr>
            ); })}
          </tbody>
        </table>
      </>
    );
  },
};
