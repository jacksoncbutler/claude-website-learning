'use client';

/**
 * A labeled group of checkboxes plus "select all / select none" shortcuts.
 * Content-agnostic — used to build "study set" filters (pinyin's rows/
 * columns/tones, radicals' stroke count, ...) without each module
 * reimplementing the same checkbox-grid UI.
 */
export function CheckboxFilterGroup<T extends string | number>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: T; display: string }[];
  selected: Set<T>;
  onChange: (next: Set<T>) => void;
}) {
  function toggle(value: T) {
    const next = new Set(selected);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <button
          type="button"
          onClick={() => onChange(new Set(options.map((o) => o.value)))}
          className="text-xs text-brand-600 hover:underline"
        >
          All
        </button>
        <button type="button" onClick={() => onChange(new Set())} className="text-xs text-neutral-500 hover:underline">
          None
        </button>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 rounded-md border border-neutral-200 p-2">
        {options.map((opt) => (
          <label key={String(opt.value)} className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={selected.has(opt.value)} onChange={() => toggle(opt.value)} />
            {opt.display}
          </label>
        ))}
      </div>
    </div>
  );
}
