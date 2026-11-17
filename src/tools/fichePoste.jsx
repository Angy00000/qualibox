import { Champ, ListeLignes } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const Liste = ({ items }) => {
  const l = items.filter((x) => x.trim());
  return l.length ? <ul style={{ margin: 0, paddingLeft: 18 }}>{l.map((x, i) => <li key={i}>{x}</li>)}</ul> : <span className="doc-vide">À compléter</span>;
};
const Sous = ({ titre, children }) => <div style={{ fontWeight: 800, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: '#15803d', margin: '0 0 4px' }}>{titre}{children}</div>;

export const fichePoste = {
  id: 'fiche-poste',
  nom: 'Fiche de poste',
  ico: '🪪',
  court: 'Décrire la mission, les activités, les responsabilités et les compétences requises d’un poste.',
  fiche: (
    <>
      <p>La fiche de poste dit clairement ce qu’on attend d’une personne. Elle sert au recrutement, à l’accueil des nouveaux, aux entretiens annuels et à l’ISO 9001 (§ 5.3 et 7.2).</p>
      <ul>
        <li><b>Mission</b> : une ou deux phrases, la raison d’être du poste.</li>
        <li><b>Activités</b> : des verbes d’action (« Accueillir », « Contrôler », « Enregistrer »).</li>
        <li><b>Compétences</b> : savoirs, savoir-faire et savoir-être, plus la formation et l’expérience demandées.</li>
        <li>Faites-la signer par le titulaire et son responsable ; revoyez-la quand le poste change.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', intitule: '', rattachement: '', encadre: '', remplacant: '', lieu: '', mission: '', activites: [''], responsabilites: [''], savoirs: [''], savoirFaire: [''], savoirEtre: [''], formation: '', experience: '', conditions: '', indicateurs: [''] }),
  exemple: () => ({
    titre: 'Fiche de poste — Technicien réparateur', date: aujourdhui(), reference: 'FP-TECH-01', redacteur: 'ANGY', service: 'Boutique — Atelier réparation',
    intitule: 'Technicien réparateur smartphones et ordinateurs', rattachement: 'Gérant de la boutique', encadre: 'Apprenti technicien', remplacant: 'Second technicien', lieu: 'Atelier de la boutique, Parcelles Assainies',
    mission: 'Diagnostiquer et réparer les téléphones et ordinateurs des clients, dans les délais annoncés et avec un résultat garanti.',
    activites: ['Accueillir le client avec le vendeur et faire le diagnostic de la panne', 'Établir le devis et le délai de réparation', 'Réparer, remplacer les pièces, tester l’appareil', 'Enregistrer chaque réparation (fiche, pièces utilisées, garantie)', 'Ranger l’établi et suivre le stock de pièces'],
    responsabilites: ['Qualité des réparations et respect de la garantie', 'Protection des données des clients (aucune copie, aucune consultation)', 'Bon usage et entretien des outils de l’atelier'],
    savoirs: ['Électronique de base', 'Architecture des smartphones et ordinateurs portables'],
    savoirFaire: ['Démontage et remontage sans casse', 'Soudure fine et micro-soudure', 'Utilisation du multimètre et de la station à air chaud'],
    savoirEtre: ['Honnêteté et discrétion', 'Patience et pédagogie avec les clients', 'Rigueur et organisation'],
    formation: 'BT ou BTS en électronique, ou formation pratique équivalente',
    experience: '2 ans minimum en réparation de smartphones',
    conditions: 'Du lundi au samedi, 9 h – 19 h. Bracelet antistatique et lunettes de protection fournis.',
    indicateurs: ['Taux de retour sous garantie inférieur à 3 %', 'Au moins 90 % des réparations livrées dans le délai annoncé'],
  }),
  Formulaire({ data, set }) {
    const L = (k, label, ph) => (
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{label}</label>
        <ListeLignes items={data[k]} onChange={(v) => set({ [k]: v })} placeholder={ph} />
      </div>
    );
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Le poste</h2>
          <Champ label="Intitulé du poste" value={data.intitule} onChange={(v) => set({ intitule: v })} />
          <div className="deux">
            <Champ label="Rattaché à (supérieur)" value={data.rattachement} onChange={(v) => set({ rattachement: v })} />
            <Champ label="Personnes encadrées" value={data.encadre} onChange={(v) => set({ encadre: v })} />
          </div>
          <div className="deux">
            <Champ label="Remplacé par (en cas d’absence)" value={data.remplacant} onChange={(v) => set({ remplacant: v })} />
            <Champ label="Lieu de travail" value={data.lieu} onChange={(v) => set({ lieu: v })} />
          </div>
          <Champ label="Mission principale" multi rows={2} value={data.mission} onChange={(v) => set({ mission: v })} />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Activités et responsabilités</h2>
          {L('activites', 'Activités principales', 'Verbe d’action + tâche')}
          {L('responsabilites', 'Responsabilités', 'Ce dont la personne répond')}
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Compétences requises</h2>
          {L('savoirs', 'Savoirs (connaissances)', '')}
          {L('savoirFaire', 'Savoir-faire (pratique)', '')}
          {L('savoirEtre', 'Savoir-être (comportement)', '')}
          <div className="deux">
            <Champ label="Formation" value={data.formation} onChange={(v) => set({ formation: v })} />
            <Champ label="Expérience" value={data.experience} onChange={(v) => set({ experience: v })} />
          </div>
        </div>
        <div className="panneau">
          <h2><span className="num">4</span>Conditions et indicateurs</h2>
          <Champ label="Horaires, conditions de travail, EPI" multi rows={2} value={data.conditions} onChange={(v) => set({ conditions: v })} />
          {L('indicateurs', 'Indicateurs de performance', 'Ex. : taux de retour < 3 %')}
        </div>
      </>
    );
  },
  Document({ data }) {
    const info = [['Rattaché à', data.rattachement], ['Encadre', data.encadre], ['Remplaçant', data.remplacant], ['Lieu', data.lieu]];
    return (
      <>
        <div className="evite-coupure" style={{ background: '#0a0f0c', color: '#fff', borderRadius: 12, padding: '14px 18px', margin: '0 0 10px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: '#4ade80' }}>Intitulé du poste</div>
          <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 19 }}>{data.intitule || '—'}</div>
        </div>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, border: '1px solid #dfe5ee', borderRadius: 10, padding: '10px 12px' }}>
          {info.map(([l, v]) => <div key={l}><small style={{ display: 'block', fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#8190a8' }}>{l}</small><b style={{ fontSize: 12 }}>{v || '—'}</b></div>)}
        </div>
        <h2>Mission</h2>
        <div className="doc-encadre racine"><T v={data.mission} /></div>
        <h2>Activités principales</h2>
        <div className="doc-encadre evite-coupure"><Liste items={data.activites} /></div>
        <h2>Responsabilités</h2>
        <div className="doc-encadre evite-coupure"><Liste items={data.responsabilites} /></div>
        <h2>Compétences requises</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[['Savoirs', data.savoirs], ['Savoir-faire', data.savoirFaire], ['Savoir-être', data.savoirEtre]].map(([t, l]) => <div key={t} className="doc-encadre" style={{ whiteSpace: 'normal' }}><Sous titre={t} /><Liste items={l} /></div>)}
        </div>
        <div className="doc-encadre evite-coupure" style={{ marginTop: 10 }}><b>Formation : </b>{data.formation || '—'}{'\n'}<b>Expérience : </b>{data.experience || '—'}</div>
        <h2>Conditions de travail</h2>
        <div className="doc-encadre"><T v={data.conditions} /></div>
        <h2>Indicateurs de performance</h2>
        <div className="doc-encadre evite-coupure"><Liste items={data.indicateurs} /></div>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
          {['Le titulaire du poste (nom, date, signature)', 'Le responsable (nom, date, signature)'].map((v) => <div key={v} style={{ border: '1px dashed #c9d4e3', borderRadius: 10, height: 64, padding: '6px 10px', fontSize: 10.5, color: '#8190a8', fontWeight: 700 }}>{v}</div>)}
        </div>
      </>
    );
  },
};
