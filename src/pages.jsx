import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { BIENTOT, OUTILS, outil as trouverOutil } from './tools/index.js';
import { Doc } from './components/Doc.jsx';
import { Champ } from './components/Champs.jsx';
import { creerPdf, ecrireBrouillon, ecrireEntreprise, lienExpert, lireBrouillon, lireEntreprise, nomFichier, partager, reduireImage, SITE, telecharger } from './lib.js';

/* ---------------- Cadre ---------------- */
export function Cadre() {
  return (
    <>
      <header className="entete">
        <div className="entete-in">
          <Link to="/" className="marque"><img src="/icon.svg" alt="" /><b>Quali<span>Box</span></b></Link>
          <nav>
            <NavLink to="/#outils" className="lien-entete" onClick={() => setTimeout(() => document.getElementById('outils')?.scrollIntoView({ behavior: 'smooth' }), 50)}>Outils</NavLink>
            <NavLink to="/mon-entreprise" className="lien-entete plein">Mon entreprise</NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
      <footer className="pied">
        <div className="pied-in">
          <span><b style={{ color: '#fff' }}>QualiBox</b> · Tous vos outils qualité, au même endroit.</span>
          <span>Un produit <a href="https://angycompany.com" target="_blank" rel="noopener">Angy Company</a> · Dakar, Sénégal · <a href={lienExpert()} target="_blank" rel="noopener">Besoin d’un expert ?</a></span>
        </div>
      </footer>
    </>
  );
}

/* ---------------- Accueil ---------------- */
export function Accueil() {
  useEffect(() => { document.title = 'QualiBox · Tous vos outils qualité, au même endroit'; }, []);
  return (
    <>
      <section className="hero">
        <div className="hero-in">
          <div>
            <span className="pastille"><i />Gratuit · Fait à Dakar pour les qualiticiens</span>
            <h1>Tous vos outils qualité, <em>au même endroit.</em></h1>
            <p className="lead">5 Pourquoi, Ishikawa, QQOQCP, matrice des risques… Remplissez-les sur votre téléphone en quelques minutes et repartez avec un PDF propre, au logo de votre entreprise.</p>
            <div className="hero-ctas">
              <a href="#outils" className="btn principal">Choisir un outil</a>
              <Link to="/mon-entreprise" className="btn secondaire">Ajouter mon logo</Link>
            </div>
            <div className="hero-chiffres">
              <div><b>{OUTILS.length}</b><span>outils prêts</span></div>
              <div><b>0 FCFA</b><span>sans inscription</span></div>
              <div><b>PDF</b><span>à votre logo</span></div>
            </div>
          </div>
          <div className="hero-visuel" aria-hidden="true">
            <div className="carte-flottante cf1">
              <h4>❓ 5 Pourquoi</h4>
              <div className="mini-chaine"><span>P1 · Le four dépasse 250 °C</span><span>P2 · Température non vérifiée</span><span>P3 · Thermomètre en panne</span><span>Cause racine · Pas de plan de maintenance</span></div>
            </div>
            <div className="carte-flottante cf2">
              <h4>⚠️ Matrice des risques</h4>
              <div className="mini-matrice">
                {['#facc15', '#f97316', '#e5484d', '#e5484d', '#facc15', '#facc15', '#f97316', '#e5484d', '#22c55e', '#facc15', '#facc15', '#f97316', '#22c55e', '#22c55e', '#22c55e', '#facc15'].map((c, i) => <i key={i} style={{ background: c }} />)}
              </div>
            </div>
            <div className="carte-flottante cf3">
              <h4>📄 PDF prêt</h4>
              <div className="ligne" style={{ width: '90%' }} /><div className="ligne" style={{ width: '70%' }} /><div className="ligne" style={{ width: '80%', background: '#e3f6f2' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="outils">
        <div className="section-tete">
          <span className="surtitre">La boîte à outils</span>
          <h2>Choisissez votre outil</h2>
          <p>Chaque outil vient avec une fiche simple et un exemple réel pris au Sénégal. Votre travail reste enregistré sur votre téléphone.</p>
        </div>
        <div className="grille-outils">
          {OUTILS.map((o) => (
            <Link key={o.id} to={`/outil/${o.id}`} className="carte-outil">
              <span className="ico">{o.ico}</span>
              <h3>{o.nom}</h3>
              <p>{o.court}</p>
              <span className="aller">Utiliser l’outil →</span>
            </Link>
          ))}
          {BIENTOT.map((o) => (
            <div key={o.id} className="carte-outil bientot">
              <span className="badge">Bientôt</span>
              <span className="ico">{o.ico}</span>
              <h3>{o.nom}</h3>
              <p>{o.court}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="section-tete">
          <span className="surtitre">Comment ça marche</span>
          <h2>Un document propre en 5 minutes</h2>
        </div>
        <div className="etapes">
          <div className="etape"><b>1</b><h3>Choisissez l’outil</h3><p>Lisez la fiche en deux minutes, ou chargez l’exemple pour voir à quoi ressemble un outil bien rempli.</p></div>
          <div className="etape"><b>2</b><h3>Remplissez-le</h3><p>Sur téléphone ou ordinateur. Le document se construit en direct, et votre travail est gardé sur l’appareil.</p></div>
          <div className="etape"><b>3</b><h3>Téléchargez le PDF</h3><p>Avec le nom et le logo de votre entreprise, prêt pour un audit, une réunion ou un dossier de certification.</p></div>
          <div className="etape"><b>4</b><h3>Partagez-le</h3><p>Envoyez-le sur WhatsApp ou par e-mail à votre équipe en un geste.</p></div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="bandeau-expert">
          <div>
            <h3>Besoin d’aller plus loin ?</h3>
            <p>Audit, mise en place d’un système qualité, HACCP, ISO 9001, ISO 22000, ISO 45001 : les experts d’Angy Company vous accompagnent.</p>
          </div>
          <a className="btn wa" href={lienExpert()} target="_blank" rel="noopener">💬 Parler à un expert</a>
        </div>
      </section>
    </>
  );
}

/* ---------------- Page d'un outil ---------------- */
function useLargeur(ref) {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return undefined;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

export function PageOutil() {
  const { id } = useParams();
  const o = trouverOutil(id);
  const navigate = useNavigate();
  const [data, setData] = useState(() => (o ? { ...o.vide(), ...lireBrouillon(o.id, {}) } : null));
  const [entreprise] = useState(lireEntreprise);
  const [occupe, setOccupe] = useState(false);
  const [toast, setToast] = useState('');
  const cadre = useRef(null);
  const capture = useRef(null);
  const visible = useRef(null);
  const largeur = useLargeur(cadre);
  const [hauteurDoc, setHauteurDoc] = useState(1123);

  useEffect(() => { if (!o) navigate('/', { replace: true }); else document.title = `${o.nom} · QualiBox`; }, [o, navigate]);
  useEffect(() => { if (o && data) ecrireBrouillon(o.id, data); }, [o, data]);
  useLayoutEffect(() => { if (visible.current) setHauteurDoc(visible.current.offsetHeight); });
  useEffect(() => { if (!toast) return undefined; const t = setTimeout(() => setToast(''), 2800); return () => clearTimeout(t); }, [toast]);

  if (!o || !data) return null;
  const set = (patch) => setData((d) => ({ ...d, ...patch }));
  const echelle = largeur ? Math.min(1, largeur / 794) : 0.5;
  const meta = { ...data, service: data.service || entreprise.service, redacteur: data.redacteur || entreprise.redacteur };
  const { Formulaire, Document } = o;

  const pdf = async (mode) => {
    setOccupe(true);
    try {
      const blob = await creerPdf(capture.current);
      const nom = nomFichier(o.id, data);
      if (mode === 'partage') {
        const r = await partager(blob, nom, `${o.nom}${data.titre ? ` — ${data.titre}` : ''} (fait avec QualiBox : https://${SITE})`);
        if (r === 'whatsapp') setToast('PDF téléchargé : joignez-le dans WhatsApp.');
      } else { telecharger(blob, nom); setToast('PDF téléchargé.'); }
    } catch { setToast('Le PDF n’a pas pu être créé. Réessayez.'); }
    finally { setOccupe(false); }
  };

  return (
    <main className="outil-page">
      <div className="fil"><Link to="/">QualiBox</Link> › {o.nom}</div>
      <div className="outil-tete">
        <div>
          <h1><span className="ico">{o.ico}</span>{o.nom}</h1>
          <p>{o.court}</p>
        </div>
      </div>
      <div className="outil-grille">
        <div>
          <details className="fiche">
            <summary>📘 Fiche : comment utiliser cet outil</summary>
            {o.fiche}
          </details>
          <div className="actions-barre">
            <button type="button" className="btn secondaire petit" onClick={() => { setData(o.exemple()); setToast('Exemple chargé : modifiez-le à votre façon.'); }}>✨ Charger un exemple</button>
            <button type="button" className="btn discret petit" onClick={() => { if (window.confirm('Effacer ce document et repartir de zéro ?')) setData(o.vide()); }}>Tout effacer</button>
          </div>
          <div className="panneau">
            <h2>📌 Informations du document</h2>
            <Champ label="Sujet" value={data.titre} onChange={(v) => set({ titre: v })} placeholder="Ex. : Baguettes brûlées à la première fournée" />
            <div className="deux">
              <Champ label="Service / site" value={data.service} onChange={(v) => set({ service: v })} placeholder={entreprise.service || 'Ex. : Production'} />
              <Champ label="Rédigé par" value={data.redacteur} onChange={(v) => set({ redacteur: v })} placeholder={entreprise.redacteur || 'Votre nom'} />
            </div>
            <div className="deux">
              <Champ label="Date" type="date" value={data.date} onChange={(v) => set({ date: v })} />
              <Champ label="Référence" value={data.reference} onChange={(v) => set({ reference: v })} placeholder="Ex. : NC-2026-014" />
            </div>
            {!entreprise.nom && <p className="aide">Astuce : <Link to="/mon-entreprise">ajoutez le nom et le logo de votre entreprise</Link> pour qu’ils apparaissent sur le PDF.</p>}
          </div>
          <div style={{ marginTop: 16 }}><Formulaire data={data} set={set} /></div>
        </div>
        <div className="apercu-col">
          <div className="actions-barre">
            <button type="button" className="btn principal" disabled={occupe} onClick={() => pdf('telecharger')}>{occupe ? 'Préparation…' : '⬇️ Télécharger le PDF'}</button>
            <button type="button" className="btn wa" disabled={occupe} onClick={() => pdf('partage')}>Partager sur WhatsApp</button>
          </div>
          <div className="apercu-cadre" ref={cadre}>
            <div style={{ height: hauteurDoc * echelle, width: '100%', overflow: 'hidden' }}>
              <div className="apercu-echelle" ref={visible} style={{ transform: `scale(${echelle})`, width: 794 }}>
                <Doc outil={o} entreprise={entreprise} meta={meta}><Document data={data} /></Doc>
              </div>
            </div>
          </div>
          <p className="apercu-note">Aperçu en direct · votre travail est enregistré sur cet appareil.</p>
        </div>
      </div>
      <div className="hors-ecran" aria-hidden="true">
        <div ref={capture}><Doc outil={o} entreprise={entreprise} meta={meta}><Document data={data} /></Doc></div>
      </div>
      <div className="barre-mobile">
        <button type="button" className="btn principal" disabled={occupe} onClick={() => pdf('telecharger')}>{occupe ? 'Préparation…' : '⬇️ PDF'}</button>
        <button type="button" className="btn wa" disabled={occupe} onClick={() => pdf('partage')}>WhatsApp</button>
        <button type="button" className="btn secondaire" onClick={() => document.querySelector('.apercu-col')?.scrollIntoView({ behavior: 'smooth' })}>Aperçu</button>
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

/* ---------------- Mon entreprise ---------------- */
export function MonEntreprise() {
  const [e, setE] = useState(lireEntreprise);
  const [ok, setOk] = useState('');
  useEffect(() => { document.title = 'Mon entreprise · QualiBox'; }, []);
  const set = (patch) => setE((x) => ({ ...x, ...patch }));
  const enregistrer = () => { setOk(ecrireEntreprise(e) ? 'Enregistré : vos prochains PDF porteront ces informations.' : 'Impossible d’enregistrer sur cet appareil.'); };
  const choisirLogo = async (f) => { if (!f) return; try { set({ logo: await reduireImage(f) }); } catch { setOk('Cette image n’a pas pu être lue.'); } };
  return (
    <main className="reglages">
      <div className="fil"><Link to="/">QualiBox</Link> › Mon entreprise</div>
      <h1 style={{ margin: '4px 0 6px' }}>Mon entreprise</h1>
      <p style={{ color: 'var(--gris)', marginTop: 0 }}>Ces informations apparaissent en haut de chaque PDF. Elles restent sur votre appareil.</p>
      <div className="panneau">
        <Champ label="Nom de l’entreprise" value={e.nom} onChange={(v) => set({ nom: v })} placeholder="Ex. : Boulangerie Mame Diarra" />
        <Champ label="Service ou site par défaut" value={e.service} onChange={(v) => set({ service: v })} placeholder="Ex. : Service qualité" />
        <Champ label="Votre nom (rédacteur par défaut)" value={e.redacteur} onChange={(v) => set({ redacteur: v })} placeholder="Ex. : Awa Ndiaye" />
        <div className="champ">
          <label>Logo</label>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="logo-apercu">{e.logo ? <img src={e.logo} alt="Logo" /> : 'Aucun logo'}</div>
            <label className="btn secondaire petit" style={{ cursor: 'pointer' }}>
              Choisir une image
              <input type="file" accept="image/*" hidden onChange={(ev) => choisirLogo(ev.target.files?.[0])} />
            </label>
            {e.logo && <button type="button" className="btn discret petit" onClick={() => set({ logo: '' })}>Retirer</button>}
          </div>
        </div>
        <button type="button" className="btn principal" onClick={enregistrer}>Enregistrer</button>
        {ok && <p className="aide" style={{ marginTop: 12 }}>{ok}</p>}
      </div>
    </main>
  );
}
