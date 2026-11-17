import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui, dateFr } from '../lib.js';

const scenarioVide = () => ({ situation: '', alerte: '', actions: '', responsable: '', moyens: '' });
const numeroVide = () => ({ service: '', numero: '' });
const exerciceVide = () => ({ date: '', scenario: '', bilan: '' });

export const planUrgence = {
  id: 'plan-urgence',
  nom: 'Plan d’urgence',
  ico: '🚨',
  court: 'Préparer les situations d’urgence : qui alerte, que faire, qui fait quoi, numéros utiles et exercices.',
  fiche: (
    <>
      <p>Un plan d’urgence prépare l’équipe à réagir vite et bien : incendie, accident grave, fuite, déversement, coupure d’électricité. Il est demandé par l’ISO 45001 et l’ISO 14001 (§ 8.2).</p>
      <ul>
        <li>Pour chaque situation : comment donner l’alerte, les gestes dans l’ordre, le responsable et le matériel.</li>
        <li>Affichez les numéros d’urgence et le point de rassemblement.</li>
        <li>Faites au moins un <b>exercice</b> par an et notez ce qu’il faut améliorer.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', site: '', rassemblement: '', numeros: [{ service: 'Sapeurs-pompiers', numero: '18' }, { service: 'Police', numero: '17' }, { service: 'SAMU', numero: '1515' }, numeroVide()], scenarios: [scenarioVide()], exercices: [exerciceVide()] }),
  exemple: () => ({
    titre: 'Plan d’urgence — usine', date: aujourdhui(), reference: 'PU-2026', redacteur: 'Lamine Seck', service: 'QHSE — Usine de Mbour',
    site: 'Usine de transformation de poisson, 45 personnes, zone industrielle de Mbour',
    rassemblement: 'Parking devant le portail principal, à côté du poste de garde',
    numeros: [{ service: 'Sapeurs-pompiers', numero: '18' }, { service: 'Police', numero: '17' }, { service: 'SAMU', numero: '1515' }, { service: 'Responsable QHSE (astreinte)', numero: '77 000 00 00' }, { service: 'Directeur d’usine', numero: '78 000 00 00' }],
    scenarios: [
      { situation: 'Incendie', alerte: 'Crier « Au feu », déclencher l’alarme, appeler le 18.', actions: '1. Attaquer le feu avec l’extincteur si on est formé et sans danger.\n2. Couper l’électricité et le gaz.\n3. Évacuer par l’issue la plus proche, sans courir.\n4. Se rendre au point de rassemblement, faire l’appel.', responsable: 'Chef d’équipe présent', moyens: '12 extincteurs, 2 RIA, alarme sonore' },
      { situation: 'Accident grave d’un salarié', alerte: 'Prévenir le sauveteur secouriste, appeler le 1515.', actions: '1. Protéger : arrêter la machine, sécuriser la zone.\n2. Ne pas déplacer la victime sauf danger.\n3. Premiers secours par un sauveteur formé.\n4. Envoyer quelqu’un au portail pour guider les secours.', responsable: 'Sauveteur secouriste', moyens: '2 trousses de secours, brancard' },
      { situation: 'Fuite d’ammoniac (installation de froid)', alerte: 'Odeur forte : alarme, appeler le frigoriste et le 18.', actions: '1. Évacuer la zone en se déplaçant contre le vent.\n2. Couper l’installation depuis l’armoire extérieure.\n3. Personne n’entre sans masque adapté.', responsable: 'Responsable maintenance', moyens: '2 masques à cartouche, manche à air' },
      { situation: 'Déversement de gasoil', alerte: 'Prévenir le responsable QHSE.', actions: '1. Arrêter la fuite si possible.\n2. Contenir avec le kit absorbant, protéger les regards d’égout.\n3. Récupérer les absorbants souillés en fût, comme déchet dangereux.', responsable: 'Responsable QHSE', moyens: 'Kit absorbant 200 L, fûts vides' },
    ],
    exercices: [
      { date: '2026-03-12', scenario: 'Évacuation incendie', bilan: 'Évacuation en 4 min 30. Un visiteur oublié : registre des visiteurs à apporter au rassemblement.' },
      { date: '', scenario: 'Déversement de gasoil (prévu)', bilan: '' },
    ],
  }),
  Formulaire({ data, set }) {
    const majL = (k, i, patch) => set({ [k]: data[k].map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Site</h2>
          <Champ label="Site, activité et effectif" value={data.site} onChange={(v) => set({ site: v })} />
          <Champ label="Point de rassemblement" value={data.rassemblement} onChange={(v) => set({ rassemblement: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Numéros d’urgence</h2>
          {data.numeros.map((x, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 34px', gap: 8, alignItems: 'end' }}>
              <Champ label={i ? '' : 'Service ou personne'} value={x.service} onChange={(v) => majL('numeros', i, { service: v })} />
              <Champ label={i ? '' : 'Numéro'} value={x.numero} onChange={(v) => majL('numeros', i, { numero: v })} />
              <button type="button" className="btn discret petit" style={{ marginBottom: 14 }} aria-label="Retirer" onClick={() => set({ numeros: data.numeros.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button type="button" className="btn secondaire petit" onClick={() => set({ numeros: [...data.numeros, numeroVide()] })}>+ Ajouter un numéro</button>
          <p className="aide">Vérifiez les numéros d’urgence de votre pays et de votre ville.</p>
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Situations d’urgence</h2>
          {data.scenarios.map((x, i) => (
            <div className="risque-bloc" key={i}>
              <Champ label={`Situation ${i + 1}`} value={x.situation} onChange={(v) => majL('scenarios', i, { situation: v })} placeholder="Ex. : incendie" />
              <Champ label="Comment donner l’alerte" value={x.alerte} onChange={(v) => majL('scenarios', i, { alerte: v })} />
              <Champ label="Que faire (une action par ligne)" multi rows={4} value={x.actions} onChange={(v) => majL('scenarios', i, { actions: v })} />
              <div className="deux">
                <Champ label="Responsable" value={x.responsable} onChange={(v) => majL('scenarios', i, { responsable: v })} />
                <Champ label="Moyens disponibles" value={x.moyens} onChange={(v) => majL('scenarios', i, { moyens: v })} />
              </div>
              {data.scenarios.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ scenarios: data.scenarios.filter((_, j) => j !== i) })}>Retirer</button></div>}
            </div>
          ))}
          <button type="button" className="btn secondaire" onClick={() => set({ scenarios: [...data.scenarios, scenarioVide()] })}>+ Ajouter une situation</button>
        </div>
        <div className="panneau">
          <h2><span className="num">4</span>Exercices</h2>
          {data.exercices.map((x, i) => (
            <div className="risque-bloc" key={i}>
              <div className="deux">
                <Champ label="Date" type="date" value={x.date} onChange={(v) => majL('exercices', i, { date: v })} />
                <Champ label="Scénario" value={x.scenario} onChange={(v) => majL('exercices', i, { scenario: v })} />
              </div>
              <Champ label="Bilan et améliorations" multi rows={2} value={x.bilan} onChange={(v) => majL('exercices', i, { bilan: v })} />
            </div>
          ))}
          <button type="button" className="btn secondaire petit" onClick={() => set({ exercices: [...data.exercices, exerciceVide()] })}>+ Ajouter un exercice</button>
        </div>
      </>
    );
  },
  Document({ data }) {
    const nums = data.numeros.filter((x) => x.service || x.numero);
    const ex = data.exercices.filter((x) => x.scenario || x.date);
    return (
      <>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 10 }}>
          <div style={{ background: '#b91c1c', color: '#fff', borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.85 }}>Numéros d’urgence</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2px 12px', marginTop: 4 }}>
              {nums.flatMap((x, i) => [<span key={`s${i}`} style={{ fontSize: 12 }}>{x.service}</span>, <b key={`n${i}`} style={{ fontFamily: 'Sora', fontSize: i < 3 ? 16 : 13 }}>{x.numero}</b>])}
            </div>
          </div>
          <div style={{ background: '#16a34a', color: '#fff', borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.85 }}>Point de rassemblement</div>
            <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 14, marginTop: 4 }}>{data.rassemblement || '—'}</div>
            <div style={{ fontSize: 11, marginTop: 6, opacity: 0.9 }}>{data.site}</div>
          </div>
        </div>
        <h2>Que faire en cas de…</h2>
        {data.scenarios.map((x, i) => (
          <div key={i} className="evite-coupure" style={{ border: '1px solid #dfe5ee', borderRadius: 10, marginBottom: 6, overflow: 'hidden' }}>
            <div style={{ background: '#0a0f0c', color: '#fff', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', gap: 10 }}><b style={{ fontFamily: 'Sora' }}>{x.situation || '—'}</b><span style={{ fontSize: 11, color: '#4ade80' }}>Responsable : {x.responsable || '—'}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 12, padding: '6px 12px', fontSize: 11, lineHeight: 1.38 }}>
              <div><b style={{ color: '#b91c1c' }}>Alerte</b><div>{x.alerte}</div>{x.moyens ? <><b style={{ display: 'block', marginTop: 6 }}>Moyens</b><div>{x.moyens}</div></> : null}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}><b>Actions</b>{'\n'}<T v={x.actions} /></div>
            </div>
          </div>
        ))}
        {ex.length ? (
          <>
            <h2>Exercices</h2>
            <table className="compact">
              <thead><tr><th style={{ width: 80 }}>Date</th><th style={{ width: 170 }}>Scénario</th><th>Bilan</th></tr></thead>
              <tbody>{ex.map((x, i) => <tr key={i}><td>{dateFr(x.date) || 'À planifier'}</td><td><b>{x.scenario}</b></td><td>{x.bilan || '—'}</td></tr>)}</tbody>
            </table>
          </>
        ) : null}
      </>
    );
  },
};
