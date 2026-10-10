import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { AppContext } from '../App';

export function AddPage() {
  const { addDevice } = useOutletContext<AppContext>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [linkScreenModelTo, setLinkScreenModelTo] = useState('');
  const [heightMm, setHeightMm] = useState('');
  const [widthMm, setWidthMm] = useState('');
  const [radiusMm, setRadiusMm] = useState('');
  const [linkBaseModelTo, setLinkBaseModelTo] = useState('');
  const [error, setError] = useState('');

  function handleSave() {
    if (!name.trim()) {
      setError('Enter a brand & model first');
      return;
    }
    addDevice({ name, linkScreenModelTo, heightMm, widthMm, radiusMm, linkBaseModelTo });
    navigate(`/?q=${encodeURIComponent(name)}`);
  }

  return (
    <main className="px-[18px]">
      <div className="text-xl font-display font-bold mt-4 mb-1 tracking-tight">Add a device</div>
      <div className="text-[13px] text-ink-soft mb-4 leading-relaxed">
        Fill in whatever you actually know — every field is optional and every future search
        checks against it automatically.
      </div>

      <div className="bg-paper-raised border border-line rounded-[10px] p-4 mb-4">
        <Field label="Brand & model">
          <input
            className="input"
            placeholder="e.g. Redmi Note 14"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
          />
        </Field>
        {error && <div className="text-[13px] text-danger mt-1">{error}</div>}
      </div>

      <div className="bg-paper-raised border border-line rounded-[10px] p-4 mb-4">
        <div className="text-sm font-display font-semibold mb-1">Screen Guard Finder</div>
        <div className="text-[12px] text-ink-soft mb-3 leading-relaxed">
          Original Drawing links two phones that use the exact same screen/cutout. Full Temper
          needs the physical panel measurements for a 100% guaranteed fit.
        </div>

        <Field label="Original Drawing — same screen as...">
          <input
            className="input"
            placeholder="e.g. Redmi 9A"
            value={linkScreenModelTo}
            onChange={(e) => setLinkScreenModelTo(e.target.value)}
          />
          <div className="text-[11px] text-ink-soft mt-1 leading-snug">
            Type an existing device's name here if this phone's screen module interchanges with
            it — they'll be linked into the same group automatically.
          </div>
        </Field>

        <div className="text-[11px] uppercase tracking-wide text-ink-soft mb-1.5 mt-3">
          Full Temper — panel dimensions (mm)
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input
            className="input"
            placeholder="Height"
            value={heightMm}
            onChange={(e) => setHeightMm(e.target.value)}
          />
          <input
            className="input"
            placeholder="Width"
            value={widthMm}
            onChange={(e) => setWidthMm(e.target.value)}
          />
          <input
            className="input"
            placeholder="Radius"
            value={radiusMm}
            onChange={(e) => setRadiusMm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-paper-raised border border-line rounded-[10px] p-4 mb-4">
        <div className="text-sm font-display font-semibold mb-1">Phone Cases & Base Models</div>
        <div className="text-[12px] text-ink-soft mb-3 leading-relaxed">
          Devices that share a chassis take the same case. Link this phone to one that already
          takes the same cover.
        </div>
        <Field label="Same base model / case as...">
          <input
            className="input"
            placeholder="e.g. Redmi Note 10"
            value={linkBaseModelTo}
            onChange={(e) => setLinkBaseModelTo(e.target.value)}
          />
        </Field>
      </div>

      <button
        className="w-full py-3 rounded-lg border-[1.5px] border-ink bg-ink text-paper font-semibold text-sm cursor-pointer shadow-[3px_3px_0_var(--color-amber)] active:translate-x-px active:translate-y-px"
        onClick={handleSave}
      >
        Save device
      </button>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] uppercase tracking-wide text-ink-soft mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
