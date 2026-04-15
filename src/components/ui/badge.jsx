export function Badge({ className = "", variant = "secondary", children }) {
  const variants = {
    secondary: "bg-slate-100 text-slate-800",
    outline: "border border-slate-300 text-slate-700",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${variants[variant] || variants.secondary} ${className}`}>{children}</span>;
}
