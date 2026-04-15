import React from "react";

const TabsContext = React.createContext();

export function Tabs({ defaultValue, className = "", children }) {
  const [value, setValue] = React.useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsContext.Provider>;
}
export function TabsList({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
export function TabsTrigger({ value, children }) {
  const ctx = React.useContext(TabsContext);
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={`rounded-xl px-3 py-2 text-sm ${active ? "bg-slate-900 text-white" : "bg-transparent text-slate-700 hover:bg-slate-100"}`}
    >
      {children}
    </button>
  );
}
export function TabsContent({ value, children }) {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div>{children}</div>;
}
