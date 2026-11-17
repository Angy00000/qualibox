export function Champ({ label, value, onChange, multi, rows = 3, placeholder, type = 'text' }) {
  return (
    <div className="champ">
      <label>{label}</label>
      {multi
        ? <textarea rows={rows} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        : <input type={type} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

export function Choix({ label, value, onChange, options }) {
  return (
    <div className="champ">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

/** Liste de lignes ajoutables (causes, mesures…). */
export function ListeLignes({ items, onChange, placeholder, ajout = '+ Ajouter' }) {
  const maj = (i, v) => onChange(items.map((x, j) => (j === i ? v : x)));
  return (
    <>
      <div className="liste-causes">
        {items.map((c, i) => (
          <div className="ligne-cause" key={i}>
            <input value={c} placeholder={placeholder} onChange={(e) => maj(i, e.target.value)} />
            <button type="button" className="x" aria-label="Retirer" onClick={() => onChange(items.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
      </div>
      <button type="button" className="btn secondaire petit" onClick={() => onChange([...items, ''])}>{ajout}</button>
    </>
  );
}
