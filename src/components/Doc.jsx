import { dateFr, SITE } from '../lib.js';

/** Feuille A4 commune à tous les outils : en-tête de l'entreprise, références, pied QualiBox. */
export function Doc({ outil, entreprise, meta, children }) {
  const initiales = (entreprise.nom || 'QB').split(/\s+/).filter(Boolean).slice(0, 2).map((m) => m[0]).join('').toUpperCase();
  return (
    <div className="doc">
      <div className="doc-tete">
        <div className="doc-ent">
          {entreprise.logo ? <img src={entreprise.logo} alt="" /> : <div className="sans-logo">{initiales}</div>}
          <div>
            <b>{entreprise.nom || 'Votre entreprise'}</b>
            <span>{meta.service || entreprise.service || 'Service qualité'}</span>
          </div>
        </div>
        <div className="doc-titre">
          <small>Outil qualité</small>
          <h1>{outil.nom}</h1>
        </div>
      </div>
      <div className="doc-meta">
        <div><small>Sujet</small><b>{meta.titre || '—'}</b></div>
        <div><small>Rédigé par</small><b>{meta.redacteur || entreprise.redacteur || '—'}</b></div>
        <div><small>Date</small><b>{dateFr(meta.date) || '—'}</b></div>
        <div><small>Référence</small><b>{meta.reference || '—'}</b></div>
      </div>
      {children}
      <div className="doc-pied">
        <span>{entreprise.nom || ''}{entreprise.nom ? ' · ' : ''}{outil.nom}</span>
        <span>Réalisé avec <b>QualiBox</b> · {SITE}</span>
      </div>
    </div>
  );
}

export const T = ({ v }) => (v && String(v).trim() ? v : <span className="doc-vide">À compléter</span>);
