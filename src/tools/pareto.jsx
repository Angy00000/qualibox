import { Champ } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const ligneVide = () => ({ nom: '', nb: '' });

/** Trie, calcule les % et le cumul ; marque les catégories qui font ~80 % (les « vitales »). */
export function calculPareto(categories) {
  const lignes = categories.map((c) => ({ nom: c.nom.trim(), nb: Number(String(c.nb).replace(',', '.')) || 0 })).filter((c) => c.nom && c.nb > 0).sort((a, b) => b.nb - a.nb);
  const total = lignes.reduce((s, c) => s + c.nb, 0);
  let cumul = 0;
  return {
    total,
    lignes: lignes.map((c) => {
      const avant = cumul; cumul += c.nb;
      const pct = total ? (c.nb / total) * 100 : 0;
      return { ...c, pct, cumul: total ? (cumul / total) * 100 : 0, vitale: total ? avant / total < 0.8 : false };
    }),
  };
}

const fmt = (n) => n.toLocaleString('fr-FR', { maximumFractionDigits: 1 });

function Graphique({ lignes }) {
  const W = 698, H = 300, g = 46, d = 46, h = 20, b = 70;
  const lw = W - g - d, lh = H - h - b;
  const max = Math.max(...lignes.map((l) => l.nb), 1);
  const pas = lw / Math.max(lignes.length, 1);
  const x = (i) => g + pas * i + pas / 2;
  const yG = (v) => h + lh - (v / max) * lh;
  const yD = (p) => h + lh - (p / 100) * lh;
  const pts = lignes.map((l, i) => `${x(i)},${yD(l.cumul)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block' }}>
      {[0, 25, 50, 75, 100].map((p) => (
        <g key={p}>
          <line x1={g} x2={W - d} y1={yD(p)} y2={yD(p)} stroke="#edf1f6" />
          <text x={W - d + 6} y={yD(p) + 4} fontSize="10" fill="#8190a8">{p} %</text>
          <text x={g - 6} y={yD(p) + 4} fontSize="10" fill="#8190a8" textAnchor="end">{fmt((max * p) / 100)}</text>
        </g>
      ))}
      <line x1={g} x2={W - d} y1={yD(80)} y2={yD(80)} stroke="#e5484d" strokeDasharray="5 4" strokeWidth="1.5" />
      <text x={W - d - 4} y={yD(80) - 5} fontSize="10" fill="#e5484d" fontWeight="700" textAnchor="end">seuil 80 %</text>
      {lignes.map((l, i) => (
        <g key={i}>
          <rect x={x(i) - pas * 0.36} y={yG(l.nb)} width={pas * 0.72} height={h + lh - yG(l.nb)} rx="4" fill={l.vitale ? '#16a34a' : '#b8c4d4'} />
          <text x={x(i)} y={yG(l.nb) - 5} fontSize="10.5" fontWeight="700" fill="#13203a" textAnchor="middle">{fmt(l.nb)}</text>
          <text x={x(i)} y={h + lh + 14} fontSize="10" fill="#4a5770" textAnchor="end" transform={`rotate(-30 ${x(i)} ${h + lh + 14})`}>{l.nom.length > 22 ? l.nom.slice(0, 21) + '…' : l.nom}</text>
        </g>
      ))}
      <polyline points={pts} fill="none" stroke="#0a0f0c" strokeWidth="2" />
      {lignes.map((l, i) => <circle key={i} cx={x(i)} cy={yD(l.cumul)} r="3.5" fill="#fff" stroke="#0a0f0c" strokeWidth="2" />)}
      <line x1={g} x2={W - d} y1={h + lh} y2={h + lh} stroke="#9aa7bb" />
    </svg>
  );
}

export const pareto = {
  id: 'pareto',
  nom: 'Diagramme de Pareto',
  ico: '📊',
  court: 'Trouver les quelques causes qui font l’essentiel des problèmes, pour agir là où ça compte.',
  fiche: (
    <>
      <p>Le principe de Pareto, ou règle des <b>80/20</b> : environ 20 % des causes produisent 80 % des effets. Le diagramme classe les catégories de la plus fréquente à la moins fréquente et montre leur poids cumulé.</p>
      <ul>
        <li>Choisissez ce que vous comptez (défauts, réclamations, pannes, coûts) et la période.</li>
        <li>Saisissez chaque catégorie avec son nombre : l’outil trie et calcule tout seul.</li>
        <li>Les barres vertes sont les catégories « vitales » : traitez-les en premier.</li>
        <li>Refaites le Pareto après vos actions pour mesurer le progrès.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', objet: '', unite: '', periode: '', categories: [ligneVide(), ligneVide(), ligneVide()], analyse: '' }),
  exemple: () => ({
    titre: 'Défauts sur la ligne d’ensachage d’eau', date: aujourdhui(), reference: 'PA-2026-005', redacteur: 'Cheikh Sow', service: 'Production — Unité d’eau en sachet',
    objet: 'Sachets d’eau rejetés au contrôle final', unite: 'sachets', periode: 'Octobre 2026',
    categories: [
      { nom: 'Soudure mal faite', nb: 480 }, { nom: 'Sachet percé', nb: 310 }, { nom: 'Volume insuffisant', nb: 140 },
      { nom: 'Impression illisible', nb: 70 }, { nom: 'Date absente', nb: 50 }, { nom: 'Sachet sale', nb: 30 }, { nom: 'Autres', nb: 20 },
    ],
    analyse: 'Deux défauts, la soudure et les sachets percés, représentent 72 % des rejets. Priorité : réglage et maintenance de la soudeuse, contrôle du film plastique à la réception.',
  }),
  Formulaire({ data, set }) {
    const maj = (i, patch) => set({ categories: data.categories.map((c, j) => (j === i ? { ...c, ...patch } : c)) });
    const { total } = calculPareto(data.categories);
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Ce que vous comptez</h2>
          <Champ label="Objet de l’analyse" value={data.objet} onChange={(v) => set({ objet: v })} placeholder="Ex. : réclamations clients, défauts, pannes" />
          <div className="deux">
            <Champ label="Unité" value={data.unite} onChange={(v) => set({ unite: v })} placeholder="Ex. : cas, sachets, FCFA" />
            <Champ label="Période" value={data.periode} onChange={(v) => set({ periode: v })} placeholder="Ex. : octobre 2026" />
          </div>
        </div>
        <div className="panneau">
          <h2><span className="num">2</span>Les catégories</h2>
          <p className="aide">L’ordre n’a pas d’importance : l’outil trie du plus grand au plus petit.</p>
          {data.categories.map((c, i) => (
            <div className="ligne-cause" key={i} style={{ marginBottom: 8 }}>
              <input value={c.nom} placeholder="Catégorie" onChange={(e) => maj(i, { nom: e.target.value })} />
              <input value={c.nb} placeholder="Nombre" inputMode="decimal" style={{ maxWidth: 110 }} onChange={(e) => maj(i, { nb: e.target.value })} />
              <button type="button" className="x" aria-label="Retirer" onClick={() => set({ categories: data.categories.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button type="button" className="btn secondaire petit" onClick={() => set({ categories: [...data.categories, ligneVide()] })}>+ Ajouter une catégorie</button>
          {total > 0 && <p className="aide" style={{ marginTop: 12 }}>Total : <b>{fmt(total)}</b> {data.unite}</p>}
        </div>
        <div className="panneau">
          <h2><span className="num">3</span>Analyse</h2>
          <Champ label="Ce qu’on retient et les priorités" multi value={data.analyse} onChange={(v) => set({ analyse: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    const { total, lignes } = calculPareto(data.categories);
    const vitales = lignes.filter((l) => l.vitale);
    const partVitales = vitales.length ? vitales[vitales.length - 1].cumul : 0;
    return (
      <>
        <h2>Objet de l’analyse</h2>
        <div className="doc-encadre"><b><T v={data.objet} /></b>{data.periode ? ` · ${data.periode}` : ''}{total ? ` · total : ${fmt(total)} ${data.unite || ''}` : ''}</div>
        <h2>Diagramme de Pareto</h2>
        {lignes.length ? <Graphique lignes={lignes} /> : <div className="doc-encadre doc-vide">Saisissez des catégories et leurs nombres.</div>}
        {vitales.length > 0 && (
          <div className="doc-encadre racine" style={{ marginTop: 8 }}>
            <b>{vitales.length} catégorie{vitales.length > 1 ? 's' : ''} sur {lignes.length}</b> représente{vitales.length > 1 ? 'nt' : ''} <b>{fmt(partVitales)} %</b> du total : {vitales.map((v) => v.nom).join(', ')}.
          </div>
        )}
        <h2>Tableau</h2>
        <table>
          <thead><tr><th>Catégorie</th><th style={{ width: 90 }}>Nombre</th><th style={{ width: 70 }}>%</th><th style={{ width: 90 }}>% cumulé</th></tr></thead>
          <tbody>
            {lignes.map((l, i) => (
              <tr key={i}><td>{l.vitale ? <b>{l.nom}</b> : l.nom}</td><td>{fmt(l.nb)}</td><td>{fmt(l.pct)} %</td><td>{fmt(l.cumul)} %</td></tr>
            ))}
            {lignes.length > 0 && <tr><td><b>Total</b></td><td><b>{fmt(total)}</b></td><td>100 %</td><td /></tr>}
          </tbody>
        </table>
        <h2>Analyse et priorités</h2>
        <div className="doc-encadre"><T v={data.analyse} /></div>
      </>
    );
  },
};
