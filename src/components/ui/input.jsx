export function Input({ className = "", ...props }) {
  return <input className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500 ${className}`} {...props} />;
}
