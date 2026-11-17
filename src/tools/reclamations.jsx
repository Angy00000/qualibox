import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const CANAUX = ['En boutique', 'Téléphone', 'WhatsApp', 'E-mail', 'Réseaux sociaux', 'Courrier'];
const STATUTS = {
  ouverte: { nom: 'Ouverte', bg: '#fde8e8', fg: '#b91c1c' },
  en_cours: { nom: 'En cours', bg: '#dbeafe', fg: '#1d4ed8' },
  close: { nom: 'Close', bg: '#dcfce7', fg: '#15803d' },
};
const dans = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const jours = (a, b) => (a && b ? Math.max(0, Math.round((new Date(b) - new Date(a)) / 864e5)) : null);
const reclamationVide = () => ({ date: aujourdhui(), client: '', canal: 'En boutique', objet: '', fondee: true, reponse: '', dateReponse: '', action: '', statut: 'ouverte' });

export const reclamations = {
  id: 'reclamations',
  nom: 'Traitement des réclamations',
  ico: '📣',
  court: 'Enregistrer les réclamations clients, suivre la réponse et le délai, et repérer les motifs qui reviennent.',
  fiche: (
    <>
      <p>Une réclamation bien traitée peut fidéliser un client. L’ISO 9001 (§ 8.2.1 et 9.1.2) et l’ISO 10002 demandent de les enregistrer et de les analyser.</p>
      <ul>
        <li>Enregistrez <b>toutes</b> les réclamations, même orales, le jour même.</li>
        <li>Accusez réception vite, répondez par écrit, et notez la date de réponse : le délai est calculé.</li>
        <li>Décidez si elle est fondée. Si le problème peut revenir, ouvrez une action corrective (fiche NC, 5 Pourquoi).</li>
        <li>Ne clôturez qu’une fois le client informé de la solution.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', periode: '', objectif: 3, liste: [reclamationVide()] }),
  exemple: () => ({
    titre: 'Registre des réclamations clients', date: aujourdhui(), reference: 'REC-2026', redacteur: 'Pape Ndiaye', service: 'Boutique — Service client',
    periode: 'Septembre à novembre 2026', objectif: 3,
    liste: [
      { date: dans(-70), client: 'Mme Diagne', canal: 'En boutique', objet: 'Écran remplacé qui ne répond plus au toucher après une semaine.', fondee: true, reponse: 'Écran remplacé sous garantie, gratuitement.', dateReponse: dans(-69), action: 'Test tactile complet de 2 minutes avant restitution.', statut: 'close' },
      { date: dans(-55), client: 'M. Faye', canal: 'WhatsApp', objet: 'Réparation livrée avec 4 jours de retard sans prévenir.', fondee: true, reponse: 'Excuses et remise de 10 % sur la réparation.', dateReponse: dans(-52), action: 'Message WhatsApp automatique si retard.', statut: 'close' },
      { date: dans(-40), client: 'Entreprise Sall BTP', canal: 'E-mail', objet: 'Facture avec un mauvais numéro de NINEA.', fondee: true, reponse: 'Facture corrigée et renvoyée.', dateReponse: dans(-39), action: '', statut: 'close' },
      { date: dans(-25), client: 'M. Gueye', canal: 'Réseaux sociaux', objet: 'Prix d’un chargeur jugé plus cher qu’ailleurs.', fondee: false, reponse: 'Explication : chargeur d’origine avec garantie 6 mois.', dateReponse: dans(-24), action: '', statut: 'close' },
      { date: dans(-10), client: 'Mme Ba', canal: 'Téléphone', objet: 'Téléphone rendu avec une rayure sur la coque.', fondee: true, reponse: 'Coque offerte ; en attente de la livraison.', dateReponse: dans(-8), action: 'Photo de l’appareil à la réception, avec le client.', statut: 'en_cours' },
      { date: dans(-2), client: 'M. Ndour', canal: 'En boutique', objet: 'Batterie neuve qui se décharge en une demi-journée.', fondee: true, reponse: '', dateReponse: '', action: '', statut: 'ouverte' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ liste: data.liste.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Période</h2>
          <div className="deux">
            <Champ label="Période couverte" value={data.periode} onChange={(v) => set({ periode: v })} />
            <Champ label="Objectif de délai de réponse (jours)" type="number" value={data.objectif} onChange={(v) => set({ objectif: Math.max(1, Number(v) || 3) })} />
          </div>
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Réclamations</h2>
          {data.liste.map((x, i) => {
            const s = STATUTS[x.statut]; const d = jours(x.date, x.dateReponse);
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Réclamation {i + 1}</b><span className="niveau" style={{ background: s.bg, color: s.fg }}>{s.nom}{d !== null ? ` · ${d} j` : ''}</span></div>
                <div className="trois">
                  <Champ label="Reçue le" type="date" value={x.date} onChange={(v) => maj(i, { date: v })} />
                  <Champ label="Client" value={x.client} onChange={(v) => maj(i, { client: v })} />
                  <div className="champ"><label>Canal</label><select value={x.canal} onChange={(e) => maj(i, { canal: e.target.value })}>{CANAUX.map((c) => <option key={c}>{c}</option>)}</select></div>
                </div>
                <Champ label="Objet de la réclamation" multi rows={2} value={x.objet} onChange={(v) => maj(i, { objet: v })} />
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 600, fontSize: 14, marginBottom: 12 }}><input type="checkbox" checked={!!x.fondee} onChange={(e) => maj(i, { fondee: e.target.checked })} /> Réclamation fondée</label>
                <Champ label="Réponse apportée au client" multi rows={2} value={x.reponse} onChange={(v) => maj(i, { reponse: v })} />
                <div className="deux">
                  <Champ label="Répondu le" type="date" value={x.dateReponse} onChange={(v) => maj(i, { dateReponse: v })} />
                  <div className="champ"><label>Statut</label><select value={x.statut} onChange={(e) => maj(i, { statut: e.target.value })}>{Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.nom}</option>)}</select></div>
                </div>
                <Champ label="Action pour éviter que cela recommence" value={x.action} onChange={(v) => maj(i, { action: v })} />
                {data.liste.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ liste: data.liste.filter((_, j) => j !== i) })}>Retirer</button></div>}
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ liste: [...data.liste, reclamationVide()] })}>+ Ajouter une réclamation</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const l = [...data.liste].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    const delais = l.map((x) => jours(x.date, x.dateReponse)).filter((d) => d !== null);
    const moyen = delais.length ? (delais.reduce((s, d) => s + d, 0) / delais.length).toFixed(1).replace('.', ',') : '—';
    const dansDelai = delais.length ? Math.round((delais.filter((d) => d <= data.objectif).length / delais.length) * 100) : null;
    const n = (k) => l.filter((x) => x.statut === k).length;
    const canaux = CANAUX.map((c) => [c, l.filter((x) => x.canal === c).length]).filter(([, v]) => v);
    const tuiles = [['Réclamations', l.length, '#0a0f0c'], ['Fondées', l.filter((x) => x.fondee).length, '#c2410c'], ['Ouvertes', n('ouverte') + n('en_cours'), '#e5484d'], ['Délai moyen', `${moyen} j`, '#0a0f0c'], [`Répondu en ≤ ${data.objectif} j`, dansDelai === null ? '—' : `${dansDelai} %`, dansDelai !== null && dansDelai < 80 ? '#e5484d' : '#15803d']];
    return (
      <>
        <h2>Bilan {data.periode ? `— ${data.periode}` : ''}</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {tuiles.map(([t, v, c]) => (
            <div key={t} style={{ border: '1px solid #dfe5ee', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>{t}</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 21, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        {canaux.length ? <div className="legende">{canaux.map(([c, v]) => <span key={c}>{c} : <b>{v}</b></span>)}</div> : null}
        <h2>Registre</h2>
        <table className="amdec">
          <thead><tr><th style={{ width: 54 }}>Reçue</th><th style={{ width: 90 }}>Client</th><th>Objet</th><th>Réponse et action</th><th style={{ width: 40, textAlign: 'center' }}>Délai</th><th style={{ width: 58 }}>Statut</th></tr></thead>
          <tbody>
            {l.map((x, i) => {
              const s = STATUTS[x.statut]; const d = jours(x.date, x.dateReponse);
              return (
                <tr key={i}>
                  <td>{dateFr(x.date) || '—'}</td>
                  <td><b><T v={x.client} /></b><div style={{ color: '#66748b' }}>{x.canal}</div></td>
                  <td>{x.objet}{!x.fondee ? <div style={{ color: '#66748b', fontStyle: 'italic' }}>Non fondée</div> : null}</td>
                  <td>{x.reponse || <span className="doc-vide">En attente</span>}{x.action ? <div style={{ color: '#15803d', marginTop: 3 }}>→ {x.action}</div> : null}</td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: d !== null && d > data.objectif ? '#b91c1c' : undefined }}>{d === null ? '—' : `${d} j`}</td>
                  <td><span style={{ background: s.bg, color: s.fg, borderRadius: 999, padding: '2px 7px', fontWeight: 800, whiteSpace: 'nowrap' }}>{s.nom}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  },
};
