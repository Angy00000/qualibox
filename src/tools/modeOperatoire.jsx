import { Champ, ListeLignes } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const TYPES_POINT = { '': 'Aucun', qualite: 'Point qualité', securite: 'Point sécurité', hygiene: 'Point hygiène' };
const COUL = { qualite: ['#dbeafe', '#1d4ed8', '◆'], securite: ['#fde8e8', '#b91c1c', '⚠'], hygiene: ['#dcfce7', '#15803d', '✚'] };
const etapeVide = () => ({ action: '', detail: '', point: '', note: '' });

export const modeOperatoire = {
  id: 'mode-operatoire',
  nom: 'Mode opératoire',
  ico: '📝',
  court: 'Écrire une instruction de travail étape par étape, avec les points qualité, sécurité et hygiène.',
  fiche: (
    <>
      <p>Le mode opératoire (ou instruction de travail) explique <b>comment</b> faire une tâche, pour que tout le monde la fasse de la même façon. On l’affiche au poste.</p>
      <ul>
        <li>Une étape = un verbe d’action au début (« Peser », « Vérifier », « Nettoyer »).</li>
        <li>Signalez les <b>points clés</b> : ce qui garantit la qualité, la sécurité ou l’hygiène, avec la raison.</li>
        <li>Listez le matériel et les EPI. Testez-le avec un nouveau : s’il y arrive seul, il est bon.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', tache: '', poste: '', objet: '', materiel: [''], epi: [''], etapes: [etapeVide()], approbateur: '' }),
  exemple: () => ({
    titre: 'Mode opératoire — remplacement d’un écran de smartphone', date: aujourdhui(), reference: 'MO-REP-02', redacteur: 'ANGY', service: 'Boutique — Atelier réparation',
    tache: 'Remplacer l’écran d’un smartphone', poste: 'Établi de réparation', approbateur: 'Gérant',
    objet: 'Remplacer un écran cassé sans abîmer le téléphone ni les données du client, et rendre un appareil testé.',
    materiel: ['Écran neuf du bon modèle', 'Station à air chaud ou plaque chauffante', 'Ventouse, médiators, tournevis de précision', 'Colle ou joint adhésif', 'Bac aimanté pour les vis'],
    epi: ['Bracelet antistatique', 'Lunettes de protection'],
    etapes: [
      { action: 'Enregistrer l’appareil', detail: 'Remplir la fiche de réparation avec le client, photographier l’appareil sous tous les angles.', point: 'qualite', note: 'Évite les litiges sur les rayures existantes.' },
      { action: 'Éteindre et chauffer', detail: 'Éteindre le téléphone, chauffer le bord de l’écran à 80 °C pendant 1 à 2 minutes.', point: 'securite', note: 'Ne jamais dépasser 90 °C : risque pour la batterie.' },
      { action: 'Ouvrir', detail: 'Soulever avec la ventouse, glisser les médiators et couper la colle tout autour.', point: '', note: '' },
      { action: 'Débrancher la batterie', detail: 'Retirer la plaque de protection et débrancher la batterie en premier.', point: 'securite', note: 'Court-circuit et carte mère abîmée si oublié.' },
      { action: 'Remplacer l’écran', detail: 'Débrancher l’ancien écran, brancher le nouveau, ranger les vis dans l’ordre dans le bac aimanté.', point: 'qualite', note: 'Une vis longue au mauvais endroit perce la carte mère.' },
      { action: 'Tester avant de refermer', detail: 'Rebrancher la batterie, tester l’affichage, le tactile sur toute la surface, la luminosité et Face ID.', point: 'qualite', note: '' },
      { action: 'Refermer et coller', detail: 'Poser le joint adhésif, refermer, presser 10 minutes.', point: '', note: '' },
      { action: 'Contrôle final', detail: 'Test complet de 2 minutes, nettoyage, fiche de réparation complétée et garantie remise au client.', point: 'qualite', note: '' },
    ],
  }),
  Formulaire({ data, set }) {
    const majE = (i, patch) => set({ etapes: data.etapes.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    const deplacer = (i, d) => { const e = [...data.etapes]; const j = i + d; if (j < 0 || j >= e.length) return; [e[i], e[j]] = [e[j], e[i]]; set({ etapes: e }); };
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>La tâche</h2>
          <div className="deux">
            <Champ label="Tâche" value={data.tache} onChange={(v) => set({ tache: v })} />
            <Champ label="Poste" value={data.poste} onChange={(v) => set({ poste: v })} />
          </div>
          <Champ label="Objet (le résultat attendu)" multi rows={2} value={data.objet} onChange={(v) => set({ objet: v })} />
          <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Matériel</label>
          <ListeLignes items={data.materiel} onChange={(v) => set({ materiel: v })} />
          <label style={{ display: 'block', fontWeight: 600, fontSize: 14, margin: '14px 0 6px' }}>Équipements de protection (EPI)</label>
          <ListeLignes items={data.epi} onChange={(v) => set({ epi: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Étapes</h2>
          {data.etapes.map((x, i) => (
            <div className="risque-bloc" key={i}>
              <div className="rtete"><b>Étape {i + 1}</b><span style={{ display: 'flex', gap: 4 }}><button type="button" className="btn discret petit" onClick={() => deplacer(i, -1)} aria-label="Monter">↑</button><button type="button" className="btn discret petit" onClick={() => deplacer(i, 1)} aria-label="Descendre">↓</button></span></div>
              <Champ label="Action (verbe)" value={x.action} onChange={(v) => majE(i, { action: v })} />
              <Champ label="Comment faire" multi rows={2} value={x.detail} onChange={(v) => majE(i, { detail: v })} />
              <div className="deux">
                <div className="champ"><label>Point clé</label><select value={x.point} onChange={(e) => majE(i, { point: e.target.value })}>{Object.entries(TYPES_POINT).map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></div>
                <Champ label="Pourquoi (raison du point clé)" value={x.note} onChange={(v) => majE(i, { note: v })} />
              </div>
              {data.etapes.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ etapes: data.etapes.filter((_, j) => j !== i) })}>Retirer</button></div>}
            </div>
          ))}
          <button type="button" className="btn secondaire" onClick={() => set({ etapes: [...data.etapes, etapeVide()] })}>+ Ajouter une étape</button>
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Validation</h2>
          <Champ label="Approuvé par" value={data.approbateur} onChange={(v) => set({ approbateur: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    const mat = data.materiel.filter((x) => x.trim()); const epi = data.epi.filter((x) => x.trim());
    return (
      <>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="doc-encadre" style={{ whiteSpace: 'normal' }}><b>Tâche : </b>{data.tache || '—'}<br /><b>Poste : </b>{data.poste || '—'}<div style={{ marginTop: 6 }}><T v={data.objet} /></div></div>
          <div className="doc-encadre" style={{ whiteSpace: 'normal' }}>
            <b>Matériel</b><div style={{ fontSize: 11.5 }}>{mat.join(' · ') || '—'}</div>
            <b style={{ display: 'block', marginTop: 6, color: '#b91c1c' }}>EPI obligatoires</b><div style={{ fontSize: 11.5 }}>{epi.join(' · ') || '—'}</div>
          </div>
        </div>
        <h2>Étapes</h2>
        {data.etapes.map((x, i) => {
          const c = COUL[x.point];
          return (
            <div key={i} className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '34px 1fr 210px', gap: 10, padding: '8px 0', borderBottom: '1px solid #e6ebf2', alignItems: 'start' }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: '#0a0f0c', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'Sora', fontWeight: 800 }}>{i + 1}</div>
              <div><b style={{ fontSize: 13.5 }}>{x.action || '—'}</b><div style={{ fontSize: 12 }}>{x.detail}</div></div>
              <div>{c ? <div style={{ background: c[0], color: c[1], borderRadius: 8, padding: '5px 8px', fontSize: 11 }}><b>{c[2]} {TYPES_POINT[x.point]}</b>{x.note ? <div>{x.note}</div> : null}</div> : null}</div>
            </div>
          );
        })}
        <div className="legende evite-coupure" style={{ marginTop: 10 }}>{Object.entries(COUL).map(([k, c]) => <span key={k}><i style={{ background: c[1] }} />{TYPES_POINT[k]}</span>)}</div>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          {[`Rédigé par : ${data.redacteur || '—'}`, `Approuvé par : ${data.approbateur || '—'}`].map((v) => <div key={v} style={{ border: '1px dashed #c9d4e3', borderRadius: 10, height: 56, padding: '6px 10px', fontSize: 10.5, color: '#8190a8', fontWeight: 700 }}>{v}</div>)}
        </div>
      </>
    );
  },
};
