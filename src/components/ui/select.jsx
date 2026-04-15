export function Select({ value, onValueChange, children }) {
  return children({ value, onValueChange });
}
export function SelectTrigger({ className = "", children }) {
  return <div className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm ${className}`}>{children}</div>;
}
export function SelectValue({ value, placeholder = "Select" }) {
  return <span>{value || placeholder}</span>;
}
export function SelectContent() { return null; }
export function SelectItem() { return null; }

export function NativeSelect({ value, onChange, options, className = "" }) {
  return (
    <select
      className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
