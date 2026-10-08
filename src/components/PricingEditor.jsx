'use client';
export default function PricingEditor({ pricing, setPricing }) {
  const addBreak = () => setPricing({ ...pricing, quantityBreaks: [...pricing.quantityBreaks, { minQty:100, pricePerUnit:0 }] });
  const addMod   = () => setPricing({ ...pricing, attributeModifiers: [...pricing.attributeModifiers, { attributeKey:'', optionValue:'', priceModifier:0, modifierType:'FLAT' }] });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Base price (₹)</label>
        <input type="number" value={pricing.basePrice} onChange={e => setPricing({ ...pricing, basePrice: Number(e.target.value) })} className="w-full px-4 py-2   rounded-md focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" />
      </div>

      <div>
        <h4 className="block text-xs font-bold text-slate-700 mb-1.5">Quantity breaks (volume discount)</h4>
        {pricing.quantityBreaks.map((b, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 mb-2">
            <input type="number" placeholder="min qty" value={b.minQty} onChange={e => setPricing({ ...pricing, quantityBreaks: pricing.quantityBreaks.map((x,k)=>k===i?{...x,minQty:Number(e.target.value)}:x) })} className="w-full px-4 py-2   rounded-md focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" />
            <input type="number" placeholder="price / unit" value={b.pricePerUnit} onChange={e => setPricing({ ...pricing, quantityBreaks: pricing.quantityBreaks.map((x,k)=>k===i?{...x,pricePerUnit:Number(e.target.value)}:x) })} className="w-full px-4 py-2   rounded-md focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" />
          </div>
        ))}
        <button type="button" onClick={addBreak} className="text-xs font-bold text-blue-600 neu-btn">+ Add break</button>
      </div>

      <div>
        <h4 className="block text-xs font-bold text-slate-700 mb-1.5">Option modifiers (premium options)</h4>
        {pricing.attributeModifiers.map((m, i) => (
          <div key={i} className="grid grid-cols-4 gap-3 mb-2">
            <input placeholder="attributeKey" value={m.attributeKey} onChange={e => setPricing({ ...pricing, attributeModifiers: pricing.attributeModifiers.map((x,k)=>k===i?{...x,attributeKey:e.target.value}:x) })} className="w-full px-4 py-2   rounded-md focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" />
            <input placeholder="optionValue" value={m.optionValue} onChange={e => setPricing({ ...pricing, attributeModifiers: pricing.attributeModifiers.map((x,k)=>k===i?{...x,optionValue:e.target.value}:x) })} className="w-full px-4 py-2   rounded-md focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" />
            <input type="number" placeholder="₹ / %" value={m.priceModifier} onChange={e => setPricing({ ...pricing, attributeModifiers: pricing.attributeModifiers.map((x,k)=>k===i?{...x,priceModifier:Number(e.target.value)}:x) })} className="w-full px-4 py-2   rounded-md focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" />
            <select value={m.modifierType} onChange={e => setPricing({ ...pricing, attributeModifiers: pricing.attributeModifiers.map((x,k)=>k===i?{...x,modifierType:e.target.value}:x) })} className="w-full px-4 py-2   rounded-md focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm">
              <option value="FLAT">FLAT ₹</option>
              <option value="PERCENTAGE">PERCENTAGE %</option>
              <option value="PER_SQ_FT">PER_SQ_FT</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={addMod} className="text-xs font-bold text-blue-600 neu-btn">+ Add modifier</button>
      </div>
    </div>
  );
}
