// Outils communs : stockage sur l'appareil, entreprise, PDF, partage.

export const WHATSAPP = '221710538917';
export const SITE = 'qualibox-sn.vercel.app';

const lire = (cle, defaut) => {
  try { const v = localStorage.getItem(cle); return v ? JSON.parse(v) : defaut; } catch { return defaut; }
};
const ecrire = (cle, valeur) => {
  try { localStorage.setItem(cle, JSON.stringify(valeur)); return true; } catch { return false; }
};

export const ENTREPRISE_VIDE = { nom: '', service: '', redacteur: '', logo: '' };
export const lireEntreprise = () => ({ ...ENTREPRISE_VIDE, ...lire('qb:entreprise', {}) });
export const ecrireEntreprise = (e) => ecrire('qb:entreprise', e);

export const lireBrouillon = (id, defaut) => lire(`qb:outil:${id}`, defaut);
export const ecrireBrouillon = (id, data) => ecrire(`qb:outil:${id}`, data);

export const aujourdhui = () => new Date().toISOString().slice(0, 10);
export const dateFr = (iso) => {
  if (!iso) return '';
  const [a, m, j] = iso.split('-');
  return a && m && j ? `${j}/${m}/${a}` : iso;
};

/** Réduit une image (logo) pour la garder sur l'appareil sans dépasser la place disponible. */
export function reduireImage(fichier, max = 360) {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onerror = reject;
    lecteur.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const r = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/png'));
      };
      img.src = lecteur.result;
    };
    lecteur.readAsDataURL(fichier);
  });
}

/** Transforme le document A4 affiché en PDF (une ou plusieurs pages). */
export async function creerPdf(element) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
  await document.fonts?.ready;
  const echelle = 2;
  // Endroits où l'on peut couper une page : entre deux lignes de tableau ou deux blocs.
  const haut = element.getBoundingClientRect().top;
  const coupures = [...element.querySelectorAll('tr, h2, .evite-coupure, .maillon, .doc-encadre, .doc-meta')]
    .filter((el) => !el.parentElement?.closest('.evite-coupure')) // on ne coupe jamais à l'intérieur d'un bloc insécable
    .filter((el) => !(el.tagName === 'TR' && el.parentElement?.tagName === 'TBODY' && !el.previousElementSibling)) // ni entre l'en-tête d'un tableau et sa première ligne
    .map((el) => ({ y: Math.round((el.getBoundingClientRect().top - haut) * echelle), titre: el.tagName === 'H2' }))
    .filter((c) => c.y > 0);
  const titres = coupures.filter((c) => c.titre).map((c) => c.y);
  // Un titre de section ne reste jamais seul en bas de page : on ne coupe pas juste après lui.
  const coupuresOk = coupures.filter((c) => c.titre || !titres.some((t) => c.y > t && c.y - t < 90 * echelle)).map((c) => c.y).sort((a, b) => a - b);
  const canvas = await html2canvas(element, { scale: echelle, backgroundColor: '#ffffff', useCORS: true, logging: false });
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const largeur = 210, hauteurPage = 297;
  const pxParMm = canvas.width / largeur;
  const hauteurPagePx = Math.floor(hauteurPage * pxParMm);
  const marge = Math.round(14 * pxParMm); // marge en haut des pages suivantes
  let y = 0, page = 0;
  while (y < canvas.height - 4) {
    const dispo = page === 0 ? hauteurPagePx : hauteurPagePx - marge;
    const reste = canvas.height - y;
    // Tolérance : si ce qui reste dépasse la page de 6 % au plus, on le réduit légèrement pour tout garder sur la page.
    let h = reste <= dispo * 1.06 ? reste : dispo;
    if (h < reste) {
      const coupe = coupuresOk.filter((c) => c > y + dispo * 0.5 && c <= y + dispo).pop();
      if (coupe) h = coupe - y;
    }
    const morceau = document.createElement('canvas');
    morceau.width = canvas.width; morceau.height = h;
    const ctx = morceau.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, morceau.width, h);
    ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
    if (page > 0) pdf.addPage();
    const reduction = Math.min(1, dispo / h); // 1 sauf pour un dernier morceau un peu trop haut
    const l = largeur * reduction;
    pdf.addImage(morceau.toDataURL('image/jpeg', 0.92), 'JPEG', (largeur - l) / 2, page === 0 ? 0 : marge / pxParMm, l, (h / pxParMm) * reduction);
    y += h; page += 1;
  }
  return pdf.output('blob');
}

export const nomFichier = (outil, data) => {
  const sujet = (data?.titre || '').toString().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  return `QualiBox-${outil}${sujet ? '-' + sujet : ''}.pdf`;
};

export function telecharger(blob, nom) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nom; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Partage le PDF (téléphone : WhatsApp, e-mail…) ; sinon télécharge et ouvre WhatsApp avec un message. */
export async function partager(blob, nom, texte) {
  const fichier = new File([blob], nom, { type: 'application/pdf' });
  if (navigator.canShare?.({ files: [fichier] })) {
    try { await navigator.share({ files: [fichier], title: nom, text: texte }); return 'partage'; }
    catch (e) { if (e?.name === 'AbortError') return 'annule'; }
  }
  telecharger(blob, nom);
  window.open(`https://wa.me/?text=${encodeURIComponent(texte)}`, '_blank', 'noopener');
  return 'whatsapp';
}

export const lienDiagnostic = (outil) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Bonjour Angy Qualité, j'utilise QualiBox${outil ? ` (outil : ${outil})` : ''} et je souhaite un diagnostic qualité gratuit pour mon entreprise.`)}`;
export const lienExpert = (sujet) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Bonjour Angy Company, j'utilise QualiBox et j'aimerais l'aide d'un expert qualité${sujet ? ` (${sujet})` : ''}.`)}`;
