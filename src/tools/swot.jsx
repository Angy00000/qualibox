import { Champ, ListeLignes } from '../components/Champs.jsx';
import { T } from '../components/Doc.jsx';
import { aujourdhui } from '../lib.js';

const CASES = [
  ['forces', 'Forces', 'Interne · positif', '#16a34a', '#ecfdf3', 'Ce que vous faites bien, vos atouts.'],
  ['faiblesses', 'Faiblesses', 'Interne · négatif', '#e5484d', '#fff5f5', 'Ce qui vous freine, ce qui manque.'],
  ['opportunites', 'Opportunités', 'Externe · positif', '#2563eb', '#eff6ff', 'Ce que le marché ou l’environnement vous offre.'],
  ['menaces', 'Menaces', 'Externe · négatif', '#d97706', '#fffbeb', 'Ce qui pourrait vous nuire : concurrence, règles, prix…'],
];

export const swot = {
  id: 'swot',
  nom: 'SWOT',
  ico: '🧩',
  court: 'Analyser forces, faiblesses, opportunités et menaces pour décider de la stratégie.',
  fiche: (
    <>
      <p>Le SWOT (en français FFOM) fait le point sur une entreprise, un service ou un projet. Il sert à analyser le <b>contexte de l’organisme</b> demandé par l’ISO 9001 (chapitre 4.1).</p>
      <ul>
        <li><b>Forces et faiblesses</b> : ce qui dépend de vous (interne).</li>
        <li><b>Opportunités et menaces</b> : ce qui vient de l’extérieur (externe).</li>
        <li>Soyez concret : « 15 ans d’expérience en pâtisserie » plutôt que « savoir-faire ».</li>
        <li>Finissez par des stratégies : utiliser les forces pour saisir les opportunités, corriger les faiblesses face aux menaces.</li>
      </ul>
    </>
  ),
  vide: () => ({ titre: '', date: aujourdhui(), reference: '', redacteur: '', service: '', sujet: '', forces: [''], faiblesses: [''], opportunites: [''], menaces: [''], strategies: '' }),
  exemple: () => ({
    titre: 'SWOT — GIE de transformation de céréales locales', date: aujourdhui(), reference: 'SWOT-2026-01', redacteur: 'Ndèye Fatou Ndour', service: 'Direction — GIE de femmes, Kaolack',
    sujet: 'Développement des ventes de farines et de couscous de mil et de maïs pour 2027.',
    forces: ['Recettes traditionnelles appréciées', '25 femmes formées aux bonnes pratiques d’hygiène', 'Mil acheté directement aux producteurs de la région', 'Prix inférieurs aux produits importés'],
    faiblesses: ['Emballages peu attractifs', 'Pas de certification ni d’autorisation FRA pour tous les produits', 'Machines anciennes, pannes fréquentes', 'Ventes surtout au marché local'],
    opportunites: ['Demande croissante pour le « consommer local »', 'Supermarchés de Dakar à la recherche de produits locaux', 'Programmes d’appui et de financement pour les femmes entrepreneures', 'Vente en ligne et sur WhatsApp'],
    menaces: ['Hausse du prix du mil en période de soudure', 'Concurrence de marques mieux équipées', 'Coupures d’électricité', 'Exigences d’hygiène plus strictes des supermarchés'],
    strategies: 'Forces + opportunités : proposer nos produits aux supermarchés de Dakar en mettant en avant l’origine locale.\nFaiblesses à corriger : nouvel emballage avec étiquetage complet, démarche d’autorisation pour tous les produits.\nFace aux menaces : stocker le mil après la récolte, demander un financement pour un groupe électrogène et une nouvelle décortiqueuse.',
  }),
  Formulaire({ data, set }) {
    return (
      <>
        <div className="panneau">
          <h2><span className="num">1</span>Sujet de l’analyse</h2>
          <Champ label="Entreprise, service ou projet analysé" multi rows={2} value={data.sujet} onChange={(v) => set({ sujet: v })} />
        </div>
        {CASES.map(([k, nom, sous, coul, , aide]) => (
          <div className="panneau" key={k}>
            <h2><span className="num" style={{ background: coul }}>{nom[0]}</span>{nom} <small style={{ color: 'var(--gris)', fontWeight: 600, fontSize: 12 }}>· {sous}</small></h2>
            <p className="aide">{aide}</p>
            <ListeLignes items={data[k]} onChange={(l) => set({ [k]: l })} placeholder={nom.slice(0, -1)} ajout="+ Ajouter" />
          </div>
        ))}
        <div className="panneau">
          <h2><span className="num">✓</span>Stratégies retenues</h2>
          <Champ label="Ce que vous décidez de faire" multi rows={4} value={data.strategies} onChange={(v) => set({ strategies: v })} />
        </div>
      </>
    );
  },
  Document({ data }) {
    return (
      <>
        <h2>Sujet</h2>
        <div className="doc-encadre"><b><T v={data.sujet} /></b></div>
        <h2>Matrice SWOT</h2>
        <div className="evite-coupure" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {CASES.map(([k, nom, sous, coul, pale]) => {
            const items = data[k].filter((x) => x.trim());
            return (
              <div key={k} style={{ border: `2px solid ${coul}`, background: pale, borderRadius: 12, padding: '10px 14px', minHeight: 170 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 15, color: coul }}>{nom}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8190a8' }}>{sous}</span>
                </div>
                {items.length ? <ul style={{ margin: '8px 0 0', paddingLeft: 16, fontSize: 12, lineHeight: 1.5 }}>{items.map((x, i) => <li key={i}>{x}</li>)}</ul> : <div className="doc-vide" style={{ marginTop: 8 }}>À compléter</div>}
              </div>
            );
          })}
        </div>
        <h2>Stratégies retenues</h2>
        <div className="doc-encadre racine"><T v={data.strategies} /></div>
      </>
    );
  },
};
