import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const TYPES = {
  arret: { nom: 'Accident avec arrêt', bg: '#e5484d', fg: '#fff' },
  sans: { nom: 'Accident sans arrêt', bg: '#fed7aa', fg: '#9a3412' },
  presque: { nom: 'Presque-accident', bg: '#fef9c3', fg: '#854d0e' },
  trajet: { nom: 'Accident de trajet', bg: '#e0e7ff', fg: '#3730a3' },
};
const evenementVide = () => ({ date: aujourdhui(), lieu: '', victime: '', type: 'sans', description: '', lesion: '', jours: 0, cause: '', action: '' });
const dans = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

export const registreAccidents = {
  id: 'registre-accidents',
  nom: 'Registre des accidents',
  ico: '🩹',
  court: 'Enregistrer les accidents et presque-accidents du travail, avec causes, actions et taux de fréquence et de gravité.',
  fiche: (
    <>
      <p>Tenir un registre des accidents du travail est une base de la sécurité (ISO 45001 § 10.2). Les <b>presque-accidents</b> comptent aussi : ils annoncent les accidents de demain.</p>
      <ul>
        <li>Décrivez les faits, la lésion et le nombre de jours d’arrêt.</li>
        <li>Cherchez la cause (5 Pourquoi, Ishikawa) et notez l’action pour éviter que cela recommence.</li>
        <li>Avec les heures travaillées sur la période, le PDF calcule le <b>taux de fréquence</b> (accidents avec arrêt par million d’heures) et le <b>taux de gravité</b> (jours perdus pour 1 000 heures).</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', periode: '', heures: '', evenements: [evenementVide()] }),
  exemple: () => ({
    titre: 'Registre des accidents du travail — 2026', date: aujourdhui(), reference: 'RAT-2026', redacteur: 'Mamadou Diouf', service: 'QHSE — Chantier BTP Diamniadio',
    periode: 'Janvier à octobre 2026', heures: '96000',
    evenements: [
      { date: dans(-280), lieu: 'Zone de coffrage', victime: 'Ouvrier coffreur (matricule 112)', type: 'arret', description: 'Chute d’un échafaudage de 2 m lors du décoffrage.', lesion: 'Entorse de la cheville', jours: 12, cause: 'Garde-corps retiré pour passer du matériel et non remis.', action: 'Interdiction de retirer un garde-corps sans accord du chef d’équipe ; contrôle quotidien des échafaudages.' },
      { date: dans(-210), lieu: 'Atelier ferraillage', victime: 'Ferrailleur (matricule 087)', type: 'sans', description: 'Coupure à la main en manipulant des aciers.', lesion: 'Coupure superficielle', jours: 0, cause: 'Gants usés non remplacés.', action: 'Stock de gants au magasin ; remplacement sur simple demande.' },
      { date: dans(-150), lieu: 'Entrée du chantier', victime: '—', type: 'presque', description: 'Un camion toupie a reculé sans guide ; un piéton s’est écarté à temps.', lesion: '', jours: 0, cause: 'Pas de séparation piétons / engins, pas de guide pour les manœuvres.', action: 'Allée piétonne balisée et guide obligatoire pour toute marche arrière.' },
      { date: dans(-90), lieu: 'Route Rufisque–Diamniadio', victime: 'Maçon (matricule 140)', type: 'trajet', description: 'Accident de moto en venant au travail.', lesion: 'Contusions', jours: 5, cause: 'Hors du contrôle de l’entreprise.', action: 'Sensibilisation au port du casque.' },
      { date: dans(-40), lieu: 'Dalle R+2', victime: 'Manœuvre (matricule 158)', type: 'arret', description: 'Projection de laitance de ciment dans l’œil.', lesion: 'Irritation oculaire', jours: 3, cause: 'Lunettes de protection non portées.', action: 'Port des lunettes obligatoire au coulage ; rappel au quart d’heure sécurité.' },
      { date: dans(-12), lieu: 'Zone de stockage', victime: '—', type: 'presque', description: 'Chute d’une palette de parpaings mal empilée, personne à proximité.', lesion: '', jours: 0, cause: 'Empilage sur 4 niveaux sur un sol non plan.', action: 'Limiter à 2 niveaux ; aire de stockage nivelée.' },
    ],
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ evenements: data.evenements.map((e, j) => (j === i ? { ...e, ...patch } : e)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Période</h2>
          <div className="deux">
            <Champ label="Période couverte" value={data.periode} onChange={(v) => set({ periode: v })} placeholder="Ex. : janvier à octobre 2026" />
            <Champ label="Heures travaillées (facultatif)" value={data.heures} onChange={(v) => set({ heures: v })} placeholder="Pour les taux TF et TG" />
          </div>
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Événements</h2>
          {data.evenements.map((e, i) => {
            const t = TYPES[e.type];
            return (
              <div className="risque-bloc" key={i}>
                <div className="rtete"><b>Événement {i + 1}</b><span className="niveau" style={{ background: t.bg, color: t.fg }}>{t.nom}</span></div>
                <div className="trois">
                  <Champ label="Date" type="date" value={e.date} onChange={(v) => maj(i, { date: v })} />
                  <div className="champ"><label>Type</label><select value={e.type} onChange={(x) => maj(i, { type: x.target.value, jours: x.target.value === 'arret' || x.target.value === 'trajet' ? e.jours : 0 })}>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v.nom}</option>)}</select></div>
                  <Champ label="Lieu" value={e.lieu} onChange={(v) => maj(i, { lieu: v })} />
                </div>
                <Champ label="Personne concernée (nom ou matricule)" value={e.victime} onChange={(v) => maj(i, { victime: v })} />
                <Champ label="Ce qui s’est passé" multi rows={2} value={e.description} onChange={(v) => maj(i, { description: v })} />
                <div className="deux">
                  <Champ label="Lésion" value={e.lesion} onChange={(v) => maj(i, { lesion: v })} />
                  <Champ label="Jours d’arrêt" type="number" value={e.jours} onChange={(v) => maj(i, { jours: Math.max(0, Number(v) || 0) })} />
                </div>
                <Champ label="Cause" multi rows={2} value={e.cause} onChange={(v) => maj(i, { cause: v })} />
                <Champ label="Action pour éviter que cela recommence" multi rows={2} value={e.action} onChange={(v) => maj(i, { action: v })} />
                {data.evenements.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ evenements: data.evenements.filter((_, j) => j !== i) })}>Retirer</button></div>}
              </div>
            );
          })}
          <button type="button" className="btn secondaire" onClick={() => set({ evenements: [...data.evenements, evenementVide()] })}>+ Ajouter un événement</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const ev = [...data.evenements].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    const n = (k) => ev.filter((e) => e.type === k).length;
    const avecArret = n('arret');
    const jours = ev.filter((e) => e.type === 'arret').reduce((s, e) => s + Number(e.jours || 0), 0);
    const h = Number(String(data.heures || '').replace(/\s/g, ''));
    const tf = h ? ((avecArret * 1e6) / h).toFixed(1).replace('.', ',') : '—';
    const tg = h ? ((jours * 1e3) / h).toFixed(2).replace('.', ',') : '—';
    const tuiles = [['Avec arrêt', avecArret, '#e5484d'], ['Sans arrêt', n('sans'), '#c2410c'], ['Presque-accidents', n('presque'), '#a16207'], ['Trajet', n('trajet'), '#3730a3'], ['Jours perdus', jours, '#0a0f0c'], ['TF', tf, '#0a0f0c'], ['TG', tg, '#0a0f0c']];
    return (
      <>
        <h2>Bilan {data.periode ? `— ${data.periode}` : ''}</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {tuiles.map(([l, v, c]) => (
            <div key={l} style={{ border: '1px solid #dfe5ee', borderRadius: 10, padding: '8px 9px' }}>
              <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: .6, textTransform: 'uppercase', color: '#8190a8' }}>{l}</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 19, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="legende" style={{ marginTop: 6 }}><span>TF = accidents avec arrêt × 1 000 000 / heures travaillées{h ? ` (${h.toLocaleString('fr-FR')} h)` : ''}</span><span>TG = jours d’arrêt × 1 000 / heures travaillées (hors trajet)</span></div>
        <h2>Registre</h2>
        <table className="amdec">
          <thead><tr><th style={{ width: 54 }}>Date</th><th style={{ width: 78 }}>Type</th><th>Faits et lésion</th><th style={{ width: 28, textAlign: 'center' }}>Jours</th><th>Cause</th><th>Action</th></tr></thead>
          <tbody>
            {ev.map((e, i) => {
              const t = TYPES[e.type];
              return (
                <tr key={i}>
                  <td>{dateFr(e.date) || '—'}</td>
                  <td><span style={{ background: t.bg, color: t.fg, borderRadius: 6, padding: '2px 5px', fontWeight: 800, display: 'inline-block', lineHeight: 1.25 }}>{t.nom}</span></td>
                  <td><b><T v={e.description} /></b><div style={{ color: '#66748b' }}>{[e.lieu, e.victime !== '—' ? e.victime : '', e.lesion].filter(Boolean).join(' · ')}</div></td>
                  <td style={{ textAlign: 'center', fontWeight: 800 }}>{e.jours || '—'}</td>
                  <td>{e.cause}</td><td>{e.action}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  },
};
