'use client';
export default function OptionsEditor({ attributes, setAttributes }) {
  const update = (i, patch) => setAttributes(attributes.map((a, idx) => idx === i ? { ...a, ...patch } : a));
  const addAttr = () => setAttributes([...attributes, { key:'', label:'', type:'select', required:true, options:[] }]);
  const addOpt  = (i) => update(i, { options: [...attributes[i].options, { value:'', label:'', priceModifier:0 }] });

  return (
    <div className="space-y-4">
      {attributes.map((a, i) => (
        <div key={i} className="rounded-xl p-4 space-y-3 bg-[var(--bg-subtle)] border border-[var(--border)]">
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="key (e.g. paper)" value={a.key} onChange={e => update(i,{key:e.target.value})} className="w-full px-4 py-2 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-faint)] focus:ring-1 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm" />
            <input placeholder="label (e.g. Paper Type)" value={a.label} onChange={e => update(i,{label:e.target.value})} className="w-full px-4 py-2 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-faint)] focus:ring-1 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm" />
            <select value={a.type} onChange={e => update(i,{type:e.target.value})} className="w-full px-4 py-2 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] focus:ring-1 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm">
              <option value="select">select</option>
              <option value="swatch">swatch</option>
              <option value="select-with-image">select-with-image</option>
              <option value="numeric-range">numeric-range</option>
            </select>
          </div>
          {a.options.map((o, j) => (
            <div key={j} className="grid grid-cols-3 gap-3 pl-4">
              <input placeholder="value" value={o.value} onChange={e => update(i,{options:a.options.map((x,k)=>k===j?{...x,value:e.target.value}:x)})} className="w-full px-4 py-2 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-faint)] focus:ring-1 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm" />
              <input placeholder="label" value={o.label} onChange={e => update(i,{options:a.options.map((x,k)=>k===j?{...x,label:e.target.value}:x)})} className="w-full px-4 py-2 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-faint)] focus:ring-1 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm" />
              <input type="number" placeholder="+₹" value={o.priceModifier} onChange={e => update(i,{options:a.options.map((x,k)=>k===j?{...x,priceModifier:Number(e.target.value)}:x)})} className="w-full px-4 py-2 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-faint)] focus:ring-1 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm" />
            </div>
          ))}
          <button type="button" onClick={() => addOpt(i)} className="text-xs font-bold text-blue-500 hover:underline">+ Add option</button>
        </div>
      ))}
      <button type="button" onClick={addAttr} className="text-sm font-bold text-blue-500 neu-btn px-4 py-2 rounded-lg">+ Add attribute</button>
    </div>
  );
}
