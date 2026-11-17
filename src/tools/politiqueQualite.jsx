import { Champ, ListeLignes } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const axeVide = () => ({ axe: '', objectif: '', indicateur: '', cible: '' });

export const politiqueQualite = {
  id: 'politique-qualite',
  nom: 'Politique qualité',
  ico: '🎯',
  court: 'Rédiger l’engagement de la direction, les axes et les objectifs qualité, prêts à afficher et signer.',
  fiche: (
    <>
      <p>La politique qualité (ISO 9001 § 5.2) est l’engagement écrit de la direction. Elle est affichée, connue du personnel et revue chaque année.</p>
      <ul>
        <li>Partez de la <b>mission</b> de l’entreprise et de ce qui compte pour vos clients.</li>
        <li>Choisissez 3 à 5 <b>axes</b>, chacun avec un objectif mesurable, un indicateur et une cible (§ 6.2).</li>
        <li>Les engagements obligatoires : satisfaire les exigences applicables et améliorer en continu.</li>
        <li>Faites-la signer par le dirigeant ; une page suffit.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: 'Politique qualité', date: aujourdhui(), reference: '', redacteur: '', service: '', mission: '', vision: '', axes: [axeVide()], engagements: ['Satisfaire les exigences de nos clients et les exigences légales et réglementaires', 'Améliorer en continu notre système de management de la qualité'], signataire: '', fonction: 'Directeur général' }),
  exemple: () => ({
    titre: 'Politique qualité 2027', date: aujourdhui(), reference: 'POL-Q-03', redacteur: 'Ousmane Kane', service: 'Direction générale — Imprimerie',
    mission: 'Imprimer, pour les entreprises, écoles et administrations du Sénégal, des documents fidèles à leurs attentes, livrés à temps.',
    vision: 'Devenir d’ici 2028 l’imprimerie de référence de Dakar pour la fiabilité des délais et la qualité des couleurs.',
    axes: [
      { axe: 'Satisfaction des clients', objectif: 'Tenir nos délais de livraison', indicateur: 'Livraisons à l’heure', cible: '≥ 95 %' },
      { axe: 'Qualité des produits', objectif: 'Réduire les erreurs et la gâche', indicateur: 'Taux de réclamations', cible: '≤ 2 %' },
      { axe: 'Compétences', objectif: 'Rendre l’équipe polyvalente sur les postes clés', indicateur: 'Postes tenus par 2 personnes autonomes', cible: '100 %' },
      { axe: 'Fournisseurs', objectif: 'Sécuriser les approvisionnements en papier', indicateur: 'Fournisseurs classés A', cible: '≥ 80 %' },
    ],
    engagements: ['Satisfaire les exigences de nos clients et les exigences légales et réglementaires', 'Améliorer en continu notre système de management de la qualité', 'Fournir à l’équipe les moyens, la formation et un cadre de travail sûr', 'Obtenir la certification ISO 9001 en 2027'],
    signataire: 'Mamadou Sy', fonction: 'Directeur général',
  }),
  Formulaire({ data, set }) {
    const majA = (i, patch) => set({ axes: data.axes.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Mission et vision</h2>
          <Champ label="Mission (ce que fait l’entreprise et pour qui)" multi rows={2} value={data.mission} onChange={(v) => set({ mission: v })} />
          <Champ label="Vision (où elle veut aller)" multi rows={2} value={data.vision} onChange={(v) => set({ vision: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Axes et objectifs</h2>
          {data.axes.map((x, i) => (
            <div className="risque-bloc" key={i}>
              <Champ label={`Axe ${i + 1}`} value={x.axe} onChange={(v) => majA(i, { axe: v })} placeholder="Ex. : Satisfaction des clients" />
              <Champ label="Objectif" value={x.objectif} onChange={(v) => majA(i, { objectif: v })} />
              <div className="deux">
                <Champ label="Indicateur" value={x.indicateur} onChange={(v) => majA(i, { indicateur: v })} />
                <Champ label="Cible" value={x.cible} onChange={(v) => majA(i, { cible: v })} />
              </div>
              {data.axes.length > 1 && <div style={{ textAlign: 'right' }}><button type="button" className="btn discret petit" onClick={() => set({ axes: data.axes.filter((_, j) => j !== i) })}>Retirer</button></div>}
            </div>
          ))}
          <button type="button" className="btn secondaire petit" onClick={() => set({ axes: [...data.axes, axeVide()] })}>+ Ajouter un axe</button>
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Engagements de la direction</h2>
          <ListeLignes items={data.engagements} onChange={(v) => set({ engagements: v })} placeholder="Nous nous engageons à…" ajout="+ Ajouter un engagement" />
          <div className="deux" style={{ marginTop: 14 }}>
            <Champ label="Signataire" value={data.signataire} onChange={(v) => set({ signataire: v })} />
            <Champ label="Fonction" value={data.fonction} onChange={(v) => set({ fonction: v })} />
          </div>
        </div>
      </>
    );
  },
  Document({ data }) {
    const eng = data.engagements.filter((x) => x.trim());
    return (
      <>
        <div className="evite-coupure" style={{ background: '#0a0f0c', color: '#fff', borderRadius: 14, padding: '16px 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: '#4ade80' }}>Notre mission</div>
          <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15.5, lineHeight: 1.45, marginTop: 4 }}><T v={data.mission} /></div>
          {data.vision ? <><div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: '#4ade80', marginTop: 12 }}>Notre vision</div><div style={{ fontSize: 13, marginTop: 2, color: '#d1fae5' }}>{data.vision}</div></> : null}
        </div>
        <h2>Nos axes et objectifs</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(Math.max(data.axes.length, 1), 4)}, 1fr)`, gap: 8 }}>
          {data.axes.map((x, i) => (
            <div key={i} style={{ border: '1.5px solid #bbf7d0', borderRadius: 12, padding: '10px 12px', background: '#f6fef9' }}>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 24, color: '#16a34a', lineHeight: 1 }}>{i + 1}</div>
              <div style={{ fontWeight: 800, fontSize: 13, margin: '4px 0' }}>{x.axe || '—'}</div>
              <div style={{ fontSize: 11.5 }}>{x.objectif}</div>
              {x.indicateur || x.cible ? <div style={{ marginTop: 6, fontSize: 10.5, color: '#4a5770' }}>{x.indicateur} : <b style={{ color: '#15803d' }}>{x.cible}</b></div> : null}
            </div>
          ))}
        </div>
        <h2>Nos engagements</h2>
        <div className="doc-encadre evite-coupure" style={{ whiteSpace: 'normal' }}>
          {eng.length ? eng.map((x, i) => <div key={i} style={{ display: 'flex', gap: 8, padding: '3px 0' }}><span style={{ color: '#16a34a', fontWeight: 900 }}>✓</span><span>{x}</span></div>) : <span className="doc-vide">À compléter</span>}
        </div>
        <p style={{ fontSize: 12, color: '#4a5770', marginTop: 14 }}>Cette politique est communiquée à tout le personnel, affichée dans nos locaux et revue chaque année lors de la revue de direction.</p>
        <div className="evite-coupure" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <div style={{ border: '1px dashed #c9d4e3', borderRadius: 10, width: 280, height: 92, padding: '8px 12px' }}>
            <div style={{ fontWeight: 800 }}>{data.signataire || '—'}</div>
            <div style={{ fontSize: 11, color: '#66748b' }}>{data.fonction}</div>
            <div style={{ fontSize: 10, color: '#8190a8', marginTop: 28 }}>Signature</div>
          </div>
        </div>
      </>
    );
  },
};
