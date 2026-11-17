import { Champ, ListeLignes } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

export const FAMILLES = [
  { k: 'main', nom: 'Main-d’œuvre', couleur: '#2563eb', aide: 'Les personnes : formation, compétences, consignes, fatigue…' },
  { k: 'methode', nom: 'Méthode', couleur: '#7c3aed', aide: 'Les façons de faire : procédures, modes opératoires, contrôles…' },
  { k: 'milieu', nom: 'Milieu', couleur: '#0891b2', aide: 'L’environnement : chaleur, humidité, propreté, électricité…' },
  { k: 'matiere', nom: 'Matière', couleur: '#d97706', aide: 'Ce qui entre : matières premières, emballages, fournisseurs…' },
  { k: 'materiel', nom: 'Matériel', couleur: '#dc2626', aide: 'Les équipements : machines, outils, entretien, réglages…' },
];

const causesVides = () => Object.fromEntries(FAMILLES.map((f) => [f.k, ['']]));

export const ishikawa = {
  id: 'ishikawa',
  nom: 'Diagramme d’Ishikawa',
  ico: '🐟',
  court: 'Classer toutes les causes possibles d’un problème selon les 5M, pour n’en oublier aucune.',
  fiche: (
    <>
      <p>Le diagramme d’Ishikawa (ou « arête de poisson ») range les causes possibles d’un problème en cinq familles, les <b>5M</b> : Main-d’œuvre, Méthode, Milieu, Matière, Matériel. Il se remplit idéalement en groupe, avec les personnes du terrain.</p>
      <ul>
        <li>Écrivez l’effet (le problème) dans la tête du poisson.</li>
        <li>Pour chaque famille, listez toutes les causes possibles, sans les juger.</li>
        <li>Choisissez ensuite la ou les causes les plus probables, puis vérifiez-les sur le terrain.</li>
        <li>Astuce : utilisez les 5 Pourquoi sur la cause principale pour aller plus loin.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', effet: '', causes: causesVides(), principale: '', action: '' }),
  exemple: () => ({
    titre: 'Jus de bissap qui fermente avant la date limite', date: aujourdhui(), reference: 'AN-2026-007', redacteur: 'Awa Ndiaye', service: 'Qualité — Unité de transformation',
    effet: 'Jus de bissap qui fermente avant la date limite (8 % des bouteilles retournées)',
    causes: {
      main: ['Lavage des mains non respecté', 'Personnel non formé à l’hygiène'],
      methode: ['Pasteurisation trop courte', 'Température de pasteurisation non contrôlée', 'Pas d’enregistrement par lot'],
      milieu: ['Atelier très chaud (plus de 35 °C)', 'Coupures d’électricité'],
      matiere: ['Fleurs de bissap mal séchées', 'Sucre stocké à l’humidité'],
      materiel: ['Bouteilles mal nettoyées', 'Réfrigérateur de stockage souvent en panne'],
    },
    principale: 'Pasteurisation trop courte et sans contrôle de température.',
    action: 'Fixer la pasteurisation à 85 °C pendant 15 minutes, avec un thermomètre et une fiche d’enregistrement à chaque lot.',
  }),
  Formulaire({ data, set }) {
    const majCauses = (k, liste) => set({ causes: { ...data.causes, [k]: liste } });
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>L’effet (le problème)</h2>
          <Champ label="Effet observé" multi rows={2} value={data.effet} onChange={(v) => set({ effet: v })} placeholder="Ex. : jus qui fermente avant la date limite" />
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Les causes possibles (5M)</h2>
          {FAMILLES.map((f) => (
            <div className="groupe-m" key={f.k}>
              <h3><i style={{ background: f.couleur }} />{f.nom}</h3>
              <p className="aide">{f.aide}</p>
              <ListeLignes items={data.causes[f.k]} onChange={(l) => majCauses(f.k, l)} placeholder="Une cause possible" ajout="+ Ajouter une cause" />
            </div>
          ))}
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Conclusion</h2>
          <Champ label="Cause(s) principale(s) retenue(s)" multi rows={2} value={data.principale} onChange={(v) => set({ principale: v })} />
          <Champ label="Action prévue" multi rows={2} value={data.action} onChange={(v) => set({ action: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    const pos = { main: { left: 0, haut: true }, methode: { left: 180, haut: true }, milieu: { left: 360, haut: true }, matiere: { left: 90, haut: false }, materiel: { left: 300, haut: false } };
    return (
      <>
        <h2>Diagramme des causes (5M)</h2>
        <div className="poisson">
          <svg viewBox="0 0 698 470" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="235" x2="526" y2="235" stroke="#0b1b33" strokeWidth="4" />
            <polygon points="526,225 546,235 526,245" fill="#0b1b33" />
            {FAMILLES.map((f) => {
              const p = pos[f.k];
              return p.haut
                ? <line key={f.k} x1={p.left + 40} y1="150" x2={p.left + 120} y2="235" stroke={f.couleur} strokeWidth="3" />
                : <line key={f.k} x1={p.left + 40} y1="320" x2={p.left + 120} y2="235" stroke={f.couleur} strokeWidth="3" />;
            })}
          </svg>
          {FAMILLES.map((f) => {
            const p = pos[f.k];
            const liste = (data.causes[f.k] || []).filter((c) => c.trim());
            return (
              <div key={f.k} className={`os ${p.haut ? 'haut' : 'bas'}`} style={{ left: p.left, width: 165 }}>
                <h4 style={{ background: f.couleur }}>{f.nom}</h4>
                {liste.length ? <ul>{liste.map((c, i) => <li key={i}>{c}</li>)}</ul> : <div className="doc-vide" style={{ fontSize: 11.5 }}>Aucune cause</div>}
              </div>
            );
          })}
          <div className="tete-poisson"><T v={data.effet} /></div>
        </div>
        <h2>Cause(s) principale(s) retenue(s)</h2>
        <div className="doc-encadre racine"><b><T v={data.principale} /></b></div>
        <h2>Action prévue</h2>
        <div className="doc-encadre"><T v={data.action} /></div>
      </>
    );
  },
};
