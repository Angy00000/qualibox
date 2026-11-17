import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const TYPES = { B: ['Biologique', '#16a34a'], C: ['Chimique', '#7c3aed'], P: ['Physique', '#d97706'], A: ['Allergène', '#e5484d'] };
const NIVEAUX = { non: 'Maîtrisé par les PRP', prpo: 'PRPo', ccp: 'CCP' };
const etapeVide = () => ({ etape: '', type: 'B', danger: '', mesure: '', niveau: 'non', limite: '', surveillance: '', correction: '', enregistrement: '' });

export const haccp = {
  id: 'haccp',
  nom: 'Analyse HACCP',
  ico: '🍽️',
  court: 'Analyser les dangers étape par étape et construire le plan de maîtrise des CCP.',
  fiche: (
    <>
      <p>Le HACCP (Codex Alimentarius) repose sur <b>7 principes</b> : 1) analyser les dangers, 2) déterminer les points critiques (CCP), 3) fixer les limites critiques, 4) surveiller les CCP, 5) prévoir les actions correctives, 6) vérifier, 7) documenter.</p>
      <ul>
        <li>Suivez le diagramme de fabrication, étape par étape, de la réception à l’expédition.</li>
        <li>Pour chaque étape, notez le danger (biologique, chimique, physique, allergène) et la mesure de maîtrise.</li>
        <li>Une étape est un <b>CCP</b> si c’est la dernière étape qui peut éliminer ou réduire le danger à un niveau acceptable ; sinon, un PRPo ou les bonnes pratiques (PRP) suffisent.</li>
        <li>Chaque CCP doit avoir une limite mesurable (température, durée…), une surveillance, une action corrective et un enregistrement.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', produit: '', usage: '', etapes: [etapeVide()], verification: '' }),
  exemple: () => ({
    titre: 'Plan HACCP — lait caillé sucré en pot', date: aujourdhui(), reference: 'HACCP-2026-01', redacteur: 'Aïssatou Diallo', service: 'Qualité — Laiterie',
    produit: 'Lait caillé sucré (sow), pot de 500 g. Lait de vache local, sucre, ferments lactiques. Conservation entre 0 et 6 °C, DLC 10 jours.',
    usage: 'Consommé tel quel par tout public, y compris enfants. Allergène : lait.',
    etapes: [
      { etape: 'Réception du lait cru', type: 'C', danger: 'Résidus d’antibiotiques', mesure: 'Test antibiotiques sur chaque livraison, refus si positif', niveau: 'prpo', limite: 'Test négatif', surveillance: 'Test rapide à chaque citerne, par le contrôleur réception', correction: 'Refus du lait, information du collecteur', enregistrement: 'Fiche de réception lait' },
      { etape: 'Filtration', type: 'P', danger: 'Corps étrangers (poils, paille)', mesure: 'Filtre inox nettoyé à chaque lot', niveau: 'non', limite: '', surveillance: '', correction: '', enregistrement: '' },
      { etape: 'Pasteurisation', type: 'B', danger: 'Survie des germes pathogènes (Listeria, Salmonella, E. coli)', mesure: 'Chauffage à 90 °C pendant 5 minutes', niveau: 'ccp', limite: '≥ 90 °C pendant ≥ 5 min', surveillance: 'Thermomètre étalonné, relevé à chaque cuve par l’opérateur', correction: 'Reprendre le chauffage ; si impossible, lot détruit', enregistrement: 'Fiche de pasteurisation par lot' },
      { etape: 'Refroidissement et ensemencement', type: 'B', danger: 'Contamination par l’air ou le matériel', mesure: 'Nettoyage-désinfection, matériel dédié, hygiène du personnel', niveau: 'non', limite: '', surveillance: '', correction: '', enregistrement: '' },
      { etape: 'Conditionnement en pot', type: 'P', danger: 'Morceaux de plastique ou de verre', mesure: 'Pots contrôlés, pas de verre dans l’atelier', niveau: 'non', limite: '', surveillance: '', correction: '', enregistrement: '' },
      { etape: 'Stockage au froid', type: 'B', danger: 'Multiplication des germes', mesure: 'Chambre froide entre 0 et 6 °C', niveau: 'prpo', limite: '≤ 6 °C', surveillance: 'Relevé de température matin et soir', correction: 'Évaluer les produits, réparer, déplacer le stock', enregistrement: 'Relevé de température chambre froide' },
    ],
    verification: 'Analyses microbiologiques mensuelles par un laboratoire agréé. Étalonnage du thermomètre tous les 6 mois. Revue du plan HACCP une fois par an ou à chaque changement de recette ou de matériel.',
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ etapes: data.etapes.map((e, j) => (j === i ? { ...e, ...patch } : e)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Le produit</h2>
          <Champ label="Description du produit (composition, conservation, DLC)" multi rows={2} value={data.produit} onChange={(v) => set({ produit: v })} />
          <Champ label="Utilisation prévue et consommateurs" multi rows={2} value={data.usage} onChange={(v) => set({ usage: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Analyse des dangers par étape</h2>
          {data.etapes.map((e, i) => (
            <div className="risque-bloc" key={i}>
              <div className="rtete"><b>Étape {i + 1}</b>
                <span className="niveau" style={{ background: e.niveau === 'ccp' ? '#e5484d' : e.niveau === 'prpo' ? '#f59e0b' : '#dcfce7', color: e.niveau === 'non' ? '#15803d' : '#fff' }}>{e.niveau === 'ccp' ? `CCP ${data.etapes.slice(0, i + 1).filter((x) => x.niveau === 'ccp').length}` : NIVEAUX[e.niveau]}</span></div>
              <Champ label="Étape du procédé" value={e.etape} onChange={(v) => maj(i, { etape: v })} />
              <div className="deux">
                <div className="champ"><label>Type de danger</label><select value={e.type} onChange={(ev) => maj(i, { type: ev.target.value })}>{Object.entries(TYPES).map(([k, [n]]) => <option key={k} value={k}>{n}</option>)}</select></div>
                <div className="champ"><label>Niveau de maîtrise</label><select value={e.niveau} onChange={(ev) => maj(i, { niveau: ev.target.value })}>{Object.entries(NIVEAUX).map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></div>
              </div>
              <Champ label="Danger" value={e.danger} onChange={(v) => maj(i, { danger: v })} />
              <Champ label="Mesure de maîtrise" value={e.mesure} onChange={(v) => maj(i, { mesure: v })} />
              {e.niveau !== 'non' && (
                <>
                  <div className="deux">
                    <Champ label={e.niveau === 'ccp' ? 'Limite critique' : 'Critère d’action'} value={e.limite} onChange={(v) => maj(i, { limite: v })} />
                    <Champ label="Enregistrement" value={e.enregistrement} onChange={(v) => maj(i, { enregistrement: v })} />
                  </div>
                  <Champ label="Surveillance (quoi, comment, fréquence, qui)" value={e.surveillance} onChange={(v) => maj(i, { surveillance: v })} />
                  <Champ label="Action corrective" value={e.correction} onChange={(v) => maj(i, { correction: v })} />
                </>
              )}
              {data.etapes.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ etapes: data.etapes.filter((_, j) => j !== i) })}>Retirer cette étape</button></div>}
            </div>
          ))}
          <button type="button" className="btn secondaire" onClick={() => set({ etapes: [...data.etapes, etapeVide()] })}>+ Ajouter une étape</button>
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Vérification</h2>
          <Champ label="Comment vérifiez-vous que le plan fonctionne ?" multi value={data.verification} onChange={(v) => set({ verification: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    let nCcp = 0;
    const lignes = data.etapes.map((e, i) => ({ ...e, n: i + 1, ccp: e.niveau === 'ccp' ? ++nCcp : null }));
    const maitrise = lignes.filter((e) => e.niveau !== 'non');
    return (
      <>
        <h2>Description du produit</h2>
        <div className="doc-encadre"><T v={data.produit} />{data.usage ? `\n${data.usage}` : ''}</div>
        <h2>Analyse des dangers</h2>
        <table>
          <thead><tr><th style={{ width: 22 }}>N°</th><th>Étape</th><th style={{ width: 82 }}>Type</th><th>Danger</th><th>Mesure de maîtrise</th><th style={{ width: 72 }}>Niveau</th></tr></thead>
          <tbody>
            {lignes.map((e) => (
              <tr key={e.n}>
                <td>{e.n}</td><td><b><T v={e.etape} /></b></td>
                <td><span style={{ color: TYPES[e.type][1], fontWeight: 800, fontSize: 11, whiteSpace: 'nowrap' }}>● {TYPES[e.type][0]}</span></td>
                <td>{e.danger}</td><td>{e.mesure}</td>
                <td><span style={{ background: e.ccp ? '#e5484d' : e.niveau === 'prpo' ? '#f59e0b' : '#dcfce7', color: e.niveau === 'non' ? '#15803d' : '#fff', borderRadius: 999, padding: '2px 8px', fontWeight: 800, fontSize: 10.5, whiteSpace: 'nowrap' }}>{e.ccp ? `CCP ${e.ccp}` : e.niveau === 'prpo' ? 'PRPo' : 'PRP'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Plan de maîtrise (CCP et PRPo)</h2>
        {maitrise.length ? (
          <table>
            <thead><tr><th style={{ width: 62 }}>Point</th><th>Étape et danger</th><th>Limite</th><th>Surveillance</th><th>Action corrective</th><th>Enregistrement</th></tr></thead>
            <tbody>
              {maitrise.map((e) => (
                <tr key={e.n}><td><b style={{ color: e.ccp ? '#e5484d' : '#d97706' }}>{e.ccp ? `CCP ${e.ccp}` : 'PRPo'}</b></td><td><b>{e.etape}</b><div style={{ color: '#66748b', fontSize: 11 }}>{e.danger}</div></td>
                  <td><b><T v={e.limite} /></b></td><td><T v={e.surveillance} /></td><td><T v={e.correction} /></td><td><T v={e.enregistrement} /></td></tr>
              ))}
            </tbody>
          </table>
        ) : <div className="doc-encadre">Aucun CCP ni PRPo : tous les dangers sont maîtrisés par les bonnes pratiques d’hygiène (PRP).</div>}
        <h2>Vérification</h2>
        <div className="doc-encadre"><T v={data.verification} /></div>
      </>
    );
  },
};
